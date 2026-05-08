import os
import requests


def research_topic(topic: dict, verbose: bool = True) -> dict:
    """
    Use Perplexity Sonar to research a blog topic.
    Returns structured research context.
    """
    api_key = os.getenv("PERPLEXITY_API_KEY")
    if not api_key:
        raise ValueError("PERPLEXITY_API_KEY not set in .env")

    if verbose:
        print(f'  📡 Researching: {topic["title"]}')

    results = {}

    # Run each research query
    for i, query in enumerate(topic.get("perplexity_queries", [])):
        if verbose:
            print(f"     Query {i + 1}: {query[:60]}...")

        response = requests.post(
            "https://api.perplexity.ai/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            json={
                "model": "sonar",
                "messages": [
                    {
                        "role": "system",
                        "content": (
                            "You are a technical research assistant. "
                            "Provide factual, current information with "
                            "specific examples, code snippets, version "
                            "numbers, and real-world data. "
                            "Focus on developer-relevant details. "
                            "Include any recent changes or deprecations."
                        ),
                    },
                    {"role": "user", "content": query},
                ],
                "max_tokens": 1000,
            },
            timeout=30,
        )

        if response.status_code == 200:
            data = response.json()
            content = data["choices"][0]["message"]["content"]
            results[f"query_{i + 1}"] = {
                "query": query,
                "findings": content,
            }
        else:
            if verbose:
                print(f"     ⚠️  Query failed: {response.status_code}")
            results[f"query_{i + 1}"] = {
                "query": query,
                "findings": "Research unavailable",
            }

    # Build structured research summary
    research = {
        "topic_slug": topic["slug"],
        "title": topic["title"],
        "queries": results,
        "paa_questions": topic.get("paa_questions", []),
        "unique_angle": topic.get("unique_angle", ""),
        "target_languages": topic.get("target_languages", []),
        "notes": topic.get("notes", ""),
        "internal_links": topic.get("internal_links_to_use", []),
    }

    if verbose:
        print(f"  ✅ Research complete: {len(results)} queries")

    return research
