import re
from typing import List, Tuple


def check_quality(
    content: str,
    topic: dict,
    rules: dict,
    verbose: bool = True,
) -> Tuple[bool, int, List[str]]:
    """
    Quality gate. Returns (passed, score, failures).
    Score is 0-100. Must reach rules['min_quality_score'].
    """
    failures: List[str] = []
    score = 100

    # ── Word count ────────────────────────────────────
    word_count = len(content.split())
    min_words = rules.get("min_word_count", 1200)
    if word_count < min_words:
        deficit = min_words - word_count
        failures.append(
            f"WORD COUNT: {word_count} words (need {min_words}, deficit: {deficit})"
        )
        score -= 20

    # ── Quick answer box ──────────────────────────────
    if rules.get("requires_quick_answer"):
        if "quick-answer" not in content and "Quick Answer" not in content:
            failures.append("MISSING: Quick Answer box")
            score -= 15

    # ── Code blocks ───────────────────────────────────
    code_blocks = len(re.findall(r"<pre>", content))
    min_code = rules.get("min_code_blocks", 3)
    if code_blocks < min_code:
        failures.append(f"CODE BLOCKS: {code_blocks} found, need {min_code}")
        score -= 10

    # ── H2 sections ───────────────────────────────────
    h2_count = len(re.findall(r"<h2", content))
    min_h2 = rules.get("min_h2_sections", 4)
    if h2_count < min_h2:
        failures.append(f"H2 SECTIONS: {h2_count} found, need {min_h2}")
        score -= 10

    # ── FAQ section ───────────────────────────────────
    if rules.get("requires_faq_section"):
        faq_indicators = [
            "FAQ",
            "Frequently Asked",
            "frequently asked",
            "faq",
        ]
        if not any(ind in content for ind in faq_indicators):
            failures.append("MISSING: FAQ section")
            score -= 10

    # ── Common mistakes ───────────────────────────────
    if rules.get("requires_common_mistakes"):
        if (
            "Mistake" not in content
            and "WRONG" not in content
            and "mistake" not in content.lower()
        ):
            failures.append("MISSING: Common mistakes section")
            score -= 10

    # ── Comparison table ──────────────────────────────
    if rules.get("requires_comparison_table"):
        if "<table" not in content:
            failures.append("MISSING: Comparison table")
            score -= 5

    # ── Author attribution ────────────────────────────
    if rules.get("requires_author_attribution"):
        author_indicators = [
            "author-note",
            "Editorial Team",
            "Verified by",
            "verified by",
            "Last verified",
        ]
        if not any(ind in content for ind in author_indicators):
            failures.append("MISSING: Author attribution")
            score -= 5

    # ── Environment note ──────────────────────────────
    if rules.get("requires_environment_note"):
        env_indicators = ["Ubuntu", "macOS", "Node.js", "Python 3", "Go 1", "Tested on"]
        has_env = any(e in content for e in env_indicators)
        if not has_env:
            failures.append("MISSING: Environment context note")
            score -= 5

    # ── Key takeaways ─────────────────────────────────
    if rules.get("requires_key_takeaways"):
        takeaway_indicators = [
            "Takeaway",
            "takeaway",
            "Key Points",
            "Key Takeaways",
            "Summary",
            "Conclusion",
            "What You",
        ]
        if not any(ind in content for ind in takeaway_indicators):
            failures.append("MISSING: Key takeaways section")
            score -= 5

    # ── Banned phrases ────────────────────────────────
    banned = [
        "In this article, we will",
        "In conclusion",
        "It is important to note",
        "Simply put",
    ]
    for phrase in banned:
        if phrase.lower() in content.lower():
            failures.append(f'BANNED PHRASE: "{phrase}"')
            score -= 3

    # ── Keyword density ───────────────────────────────
    keyword = topic.get("primary_keyword", "")
    if keyword:
        kw_count = content.lower().count(keyword.lower())
        density = kw_count / max(word_count, 1)
        max_density = rules.get("max_keyword_density", 0.02)
        if density > max_density:
            failures.append(
                f'KEYWORD STUFFING: "{keyword}" appears {kw_count}x '
                f"(density: {density:.3f}, max: {max_density})"
            )
            score -= 5

    # ── Internal links ────────────────────────────────
    links = topic.get("internal_links_to_use", [])
    if links:
        all_links = {
            "timestamp_debugger": "/tools/timestamp-debugger",
            "jwt_decoder": "/tools/jwt-decoder",
            "permissions_calculator": "/tools/permissions-calculator",
            "cron_next_runs": "/tools/cron-next-runs",
            "timestamp_converter": "/tools/timestamp-converter",
            "timestamp_api": "/tools/timestamp-api",
            "cron_generator": "/tools/cron-generator",
            "cheatsheet_js": "/cheatsheets/javascript",
            "cheatsheet_python": "/cheatsheets/python",
            "cheatsheet_go": "/cheatsheets/go",
            "challenges": "/challenges",
        }
        links_found = sum(
            1 for k in links if all_links.get(k, "") in content
        )
        if links_found == 0:
            # Soft warning only — reduce score but don't block
            failures.append(
                "WARNING: No internal links found "
                "(recommended, not required)"
            )
            score -= 3

    # ── Final score ───────────────────────────────────
    score = max(0, score)
    min_score = rules.get("min_quality_score", 85)
    passed = score >= min_score and len(
        [
            f
            for f in failures
            if f.startswith("MISSING") or f.startswith("WORD COUNT")
        ]
    ) == 0

    if verbose:
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"  {status} Quality score: {score}/100")
        if failures:
            for f in failures:
                icon = "⚠️ " if passed else "❌ "
                print(f"     {icon}{f}")

    return passed, score, failures
