import os
import anthropic
from typing import Optional


def build_writer_prompt(topic: dict, research: dict, config: dict) -> str:
    """Build the full writer prompt with all quality rules."""

    site = config["site"]
    quality = config["quality_rules"]
    env_context = config["environment_context"]
    banned = config["banned_phrases"]
    internal_links = config["internal_links"]

    # Get environment context for this topic
    langs = topic.get("target_languages", ["general"])
    env_notes = [env_context.get(lang, env_context["general"]) for lang in langs]
    env_string = " | ".join(set(env_notes))

    # Build internal links string
    topic_links = topic.get("internal_links_to_use", [])
    link_refs = [f"- {k}: {v}" for k, v in internal_links.items() if k in topic_links]
    links_string = "\n".join(link_refs) if link_refs else "Use relevant tools from unixcalculator.com"

    # Build research context
    research_parts = []
    for key, val in research.get("queries", {}).items():
        research_parts.append(
            f"RESEARCH {key.upper()}:\n"
            f"Query: {val['query']}\n"
            f"Findings: {val['findings']}\n"
        )
    research_string = "\n---\n".join(research_parts)

    # PAA questions
    paa = "\n".join([f"- {q}" for q in research.get("paa_questions", [])])

    # Banned phrases
    banned_string = "\n".join([f'- "{p}"' for p in banned])

    min_h2 = quality["min_h2_sections"]

    prompt = f"""You are a senior Unix/Linux engineer writing for
{site['name']} ({site['url']}).
Audience: {site['audience']}
Voice: {site['voice']}

ARTICLE ASSIGNMENT:
Title: {topic['title']}
Category: {topic['category']}
Primary keyword: {topic['primary_keyword']}
Target word count: {topic['word_count']} words minimum
Unique angle: {topic['unique_angle']}

ENVIRONMENT CONTEXT (include in author note):
{env_string}

RESEARCH CONTEXT (use this — do not contradict it):
{research_string}

PEOPLE ALSO ASK (answer ALL of these in the article):
{paa}

INTERNAL LINKS TO INCLUDE (link naturally in content):
{links_string}

SPECIAL NOTES FROM EDITOR:
{topic.get('notes', 'None')}

════════════════════════════
REQUIRED ARTICLE STRUCTURE:
════════════════════════════

Output clean HTML. Use these exact tags:
<h2> for main sections
<h3> for subsections
<p> for paragraphs
<pre><code class="language-LANG"> for code blocks
<table><thead><tbody><tr><th><td> for tables
<ul><li> for unordered lists
<ol><li> for ordered lists
<blockquote> for the Quick Answer box
<strong> for emphasis

SECTION 1 — QUICK ANSWER BOX (required):
<blockquote class="quick-answer">
  <strong>Quick Answer:</strong>
  [50-75 word direct answer to the title question.
   This must be self-contained and factually precise.
   Google AIO will cite this verbatim.]
</blockquote>

SECTION 2 — OPENING (required):
- Start with a real developer pain point or production stat
- NO generic intros
- First sentence must hook a developer immediately
- Do NOT start with the title as a sentence

SECTION 3 — MAIN CONTENT (required):
- Minimum {min_h2} H2 sections
- Each H2 section must have at least 1 code block
- Code blocks must have clear comments on every line
- Show expected output as comments

SECTION 4 — COMMON MISTAKES (required):
<h2>Common Mistakes and How to Fix Them</h2>
Format each mistake as:
<h3>Mistake: [description]</h3>
<pre><code>// ✗ WRONG
[wrong code]
// ✓ RIGHT
[correct code]</code></pre>
<p>[explanation of why it happens]</p>

SECTION 5 — COMPARISON TABLE (required):
Must have minimum 3 rows and 3 columns.
Relevant to the article topic.

SECTION 6 — FAQ (required):
<h2>Frequently Asked Questions</h2>
Answer ALL of these PAA questions:
{paa}

Format:
<h3>[exact PAA question]</h3>
<p>[2-4 sentence answer. Factual and precise.]</p>

SECTION 7 — KEY TAKEAWAYS (required):
<h2>Key Takeaways</h2>
<ul>
  <li>[3-5 bullet points summarizing main points]</li>
</ul>

SECTION 8 — AUTHOR NOTE (required):
<p class="author-note">
  <strong>Verified by Unix Calculator Editorial Team.</strong>
  Tested on: {env_string}.
  Last verified: May 2026.
  All code examples have been executed and outputs confirmed.
</p>

════════════════════════════
MATH VERIFICATION RULE (CRITICAL):
════════════════════════════

All Unix timestamp conversions must be exact.
Before including any specific timestamp value:
1. Verify using first principles
2. If certain: include exact value with inline comment
3. If uncertain: use [TIMESTAMP_VALUE] placeholder
4. NEVER approximate a calculation

Example of CORRECT math:
// 1733529600 × 1000 = 1733529600000 ✓
// date -d @1733529600 → Sat Dec  7 04:00:00 UTC 2024 ✓

════════════════════════════
BANNED PHRASES (NEVER use these):
════════════════════════════
{banned_string}

════════════════════════════
CODE BLOCK RULES:
════════════════════════════
- Every non-obvious line must have a comment
- Show expected output as: // → output
- Include error handling in examples
- Use realistic variable names (not foo/bar)
- Examples must be copy-paste runnable

════════════════════════════
OUTPUT FORMAT:
════════════════════════════
Return ONLY the HTML article content.
No markdown. No preamble. No explanation.
Start directly with the <blockquote class="quick-answer">
End with the <p class="author-note">
"""
    prompt += """

CRITICAL REMINDER — YOUR OUTPUT WILL BE REJECTED IF:
1. FAQ section is missing
   (must have <h2>Frequently Asked Questions</h2>)
2. Author note is missing
   (must end with <p class="author-note">)
3. Key Takeaways missing
   (must have <h2>Key Takeaways</h2>)
4. Internal links missing — you MUST include these
   exact href values as clickable links in the content:
"""

    for link_key in topic.get("internal_links_to_use", []):
        link_val = config["internal_links"].get(link_key, "")
        if link_val:
            prompt += f'\n   <a href="{link_val}">...</a>'

    prompt += """

FINAL CHECKLIST — before finishing your response,
verify these 8 elements exist in your HTML output:
[ ] <blockquote class="quick-answer"> — Quick Answer
[ ] At least 4 <h2> sections
[ ] At least 3 <pre><code> blocks
[ ] <h2>Common Mistakes</h2> section with WRONG/RIGHT
[ ] <table> comparison table
[ ] <h2>Frequently Asked Questions</h2>
[ ] <h2>Key Takeaways</h2> with <ul><li> items
[ ] <p class="author-note"> closing block

The <p class="author-note"> MUST be the last element.
It MUST contain "Editorial Team" and "Last verified".
Format it exactly like this:

<p class="author-note">
  <strong>Verified by Unix Calculator Editorial
  Team — Senior Unix/Linux Engineers.</strong>
  Tested on: [ENVIRONMENT_STRING].
  Last verified: May 2026.
  All code examples have been executed and
  outputs confirmed.
</p>

Output the complete article now.
Begin with <blockquote class="quick-answer">
End with </p> (the author-note closing tag)
"""

    return prompt


def write_article(
    topic: dict,
    research: dict,
    config: dict,
    verbose: bool = True,
) -> Optional[str]:
    """
    Use Claude Haiku to write the article.
    Returns HTML content string.
    """
    api_key = os.getenv("ANTHROPIC_API_KEY")
    if not api_key:
        raise ValueError("ANTHROPIC_API_KEY not set in .env")

    if verbose:
        print(f'  ✍️  Writing: {topic["title"]}')

    client = anthropic.Anthropic(api_key=api_key)
    prompt = build_writer_prompt(topic, research, config)

    message = client.messages.create(
        model="claude-haiku-4-5",
        max_tokens=8192,
        system="""You are a senior Unix/Linux engineer
writing technical articles in HTML format.
You MUST include ALL of these sections in EVERY article,
in this exact order:
1. <blockquote class="quick-answer"> — Quick Answer box
2. Opening paragraph — developer pain point
3. Multiple <h2> sections with <pre><code> blocks
4. <h2>Common Mistakes and How to Fix Them</h2>
5. A <table> comparison table
6. <h2>Frequently Asked Questions</h2> with <h3> questions
7. <h2>Key Takeaways</h2> with <ul><li> list
8. <p class="author-note"> closing author block

If you omit ANY of these sections the article is rejected.
Output ONLY HTML. No markdown. No explanations.
Start with <blockquote. End with </p> author note.""",
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
    )

    block = message.content[0]
    content = block.text if hasattr(block, "text") else str(block)

    if verbose:
        word_count = len(content.split())
        print(f"  ✅ Article written: ~{word_count} words")

    return content
