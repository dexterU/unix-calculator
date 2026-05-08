# Unix Calculator Blog Pipeline

Generates high-quality developer articles using Perplexity research + Claude writing.

## Setup

1. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

2. Copy and fill in `.env`:

   ```bash
   cp .env.example .env
   ```

3. Add your API keys to `.env`:

   - `ANTHROPIC_API_KEY` (from console.anthropic.com)
   - `PERPLEXITY_API_KEY` (from perplexity.ai/settings)
   - `UC_SUPABASE_URL` (Supabase project URL)
   - `UC_SUPABASE_SERVICE_ROLE_KEY` (Supabase service key)

## Usage

Test one article without uploading:

```bash
python generate.py --slug seconds-vs --dry-run
```

Run first article only:

```bash
python generate.py --limit 1
```

Run top 3 priority articles:

```bash
python generate.py --priority 3
```

Run all 11 articles:

```bash
python generate.py
```

Run specific slug:

```bash
python generate.py --slug y2038-problem
```

## Quality Gate

Articles scoring below 85/100 are saved as `draft`. Review drafts in Supabase → `blog_posts` table. Change `status` to `published` to make them live.

## Cost Estimate

~$0.10 per article (Perplexity + Claude Haiku). 11 articles ≈ $1.10 total.
