import os
import re
from datetime import datetime, timezone

from supabase import create_client


def get_supabase_client():
    url = os.getenv("UC_SUPABASE_URL")
    key = os.getenv("UC_SUPABASE_SERVICE_ROLE_KEY")
    if not url or not key:
        raise ValueError(
            "UC_SUPABASE_URL and UC_SUPABASE_SERVICE_ROLE_KEY must be set"
        )
    return create_client(url, key)


def upload_article(
    topic: dict,
    content: str,
    quality_score: int,
    passed_quality: bool,
    verbose: bool = True,
) -> dict:
    """
    Upload article to Supabase.
    Sets status to 'published' only if quality passed.
    Otherwise saves as 'draft' for manual review.
    """
    supabase = get_supabase_client()

    status = "published" if passed_quality else "draft"
    published_at = datetime.now(timezone.utc).isoformat() if passed_quality else None

    # Build excerpt from content — extract first <p> tag content
    p_match = re.search(r"<p[^>]*>(.*?)</p>", content, re.DOTALL)
    excerpt = ""
    if p_match:
        raw = p_match.group(1)
        excerpt = re.sub(r"<[^>]+>", "", raw).strip()
        excerpt = excerpt[:300] + "..." if len(excerpt) > 300 else excerpt

    # Estimate read time (200 words per minute)
    word_count = len(content.split())
    read_time = max(1, round(word_count / 200))

    record = {
        "slug": topic["slug"],
        "title": topic["title"],
        "category": topic["category"],
        "excerpt": excerpt or topic.get("notes", "")[:200],
        "content": content,
        "keywords": [topic["primary_keyword"]] + topic.get("secondary_keywords", []),
        "author": "Unix Calculator Editorial Team",
        "read_time_minutes": read_time,
        "status": status,
        "featured": topic.get("priority", 99) <= 3,
        "published_at": published_at,
    }

    result = supabase.table("blog_posts").upsert(record, on_conflict="slug").execute()

    if verbose:
        icon = "🚀" if status == "published" else "📝"
        print(f'  {icon} Uploaded as {status.upper()}: {topic["slug"]}')
        if status == "draft":
            print(
                "     Review at: https://supabase.com/dashboard — blog_posts table"
            )

    data = result.data
    if isinstance(data, list) and len(data) > 0:
        return data[0]
    if isinstance(data, dict):
        return data
    return {}
