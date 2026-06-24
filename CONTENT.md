# Editing the site — where everything lives

A quick map of what you can change and where. Three places hold content:
**Airtable** (operational data), **R2** (photos), and **code** (page copy).

| You want to change… | Where | How |
| --- | --- | --- |
| Litter status / dates / counts | **Airtable** → `Litter` table | Edit the grid — see [docs/ADMIN-AIRTABLE.md](docs/ADMIN-AIRTABLE.md) |
| Waitlist open/full/closed + counts | **Airtable** → `Waitlists` table | Edit the grid |
| Testimonials | **Airtable** → `Testimonials` table | Add/edit rows |
| Any photo | **R2 bucket** | Upload — see [docs/IMAGES.md](docs/IMAGES.md) |
| The gallery (add/remove photos) | **R2 + tooling** | See [docs/IMAGES.md](docs/IMAGES.md) |
| Page copy (Home, About) | **Code** → `src/lib/content.ts` | Edit the text, commit |
| Parents & health clearances | **Code** → `src/lib/content.ts` (`getParentsContent`) | Edit, commit |
| FAQ questions/answers | **Code** → `src/lib/content.ts` (`getFaqs`) | Edit, commit |
| Navigation / business info | **Code** → `src/lib/site.ts` | Edit, commit |

## The two kinds of edits

### 1. Airtable & R2 — no code, no deploy
Edit the Airtable grid or upload a photo to R2. The live site picks it up within
~5 minutes (or instantly if the revalidate webhook is set up). Nothing to commit.
This is the easiest path and covers the things that change most often.

- **Airtable** holds the litter, both waitlists, and testimonials. Setup +
  table layouts: [docs/ADMIN-AIRTABLE.md](docs/ADMIN-AIRTABLE.md).
- **R2** holds every photo. Adding/replacing/removing: [docs/IMAGES.md](docs/IMAGES.md).
- If Airtable/R2 aren't configured, the site shows built-in defaults — so it
  never breaks.

### 2. Code — for page copy
Marketing copy (Home, About), the parent/health details, and the FAQ live in
`src/lib/content.ts` as plain text. To change them: edit the file, commit, and
push. That triggers a deploy automatically.

```bash
git checkout dev && git pull
# edit src/lib/content.ts
git commit -am "Update About copy" && git push
```

## How changes go live

- **Airtable / R2 edit** → live in ~5 min (ISR), no deploy.
- **Code push to `dev`** → deploys a preview at `beta.carolinacreampups.com`.
- **Merge `dev` → `main`** → deploys production at `carolinacreampups.com`.

## Quick reference

- Litter & waitlists & testimonials → [docs/ADMIN-AIRTABLE.md](docs/ADMIN-AIRTABLE.md)
- Photos & gallery → [docs/IMAGES.md](docs/IMAGES.md)
- Deployment & environments → [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
