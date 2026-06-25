# Deployment

Hosting is on **Vercel using its native Git integration** — connect the repo once
in the Vercel dashboard and every push deploys automatically. No tokens, no
secrets, no GitHub Actions deploy job.

| Branch | Vercel environment | Domain                        | Indexable?   |
| ------ | ------------------ | ----------------------------- | ------------ |
| `main` | Production         | `carolinacreampups.com`       | yes          |
| `dev`  | Preview            | `beta.carolinacreampups.com`  | no (noindex) |
| PRs    | Preview            | auto-generated URL            | no (noindex) |

GitHub Actions still runs the **`verify`** check (lint/typecheck/test/build) on
every push and PR. Gate production by requiring that check via branch protection
(below), so `dev` can only merge into `main` when CI is green.

## One-time setup

### 1. Connect the project

Vercel dashboard → **Add New → Project** → import `samuel-burke/carolina-cream-pups`.
Framework auto-detects as Next.js. Set the **Production Branch** to `main`
(Settings → Git).

### 2. Environment variables

Project → **Settings → Environment Variables**:

| Variable                     | Production                       | Preview                              |
| ---------------------------- | ------------------------------- | ------------------------------------ |
| `NEXT_PUBLIC_SITE_URL`       | `https://carolinacreampups.com` | `https://beta.carolinacreampups.com` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | your cloud name          | your cloud name                      |
| `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | your key/secret (server-only) | your key/secret |
| `NEXT_PUBLIC_NOINDEX`        | _(unset)_                       | `1`                                  |

`NEXT_PUBLIC_NOINDEX=1` on Preview makes `dev`/PR deploys serve
`robots.txt → Disallow: /` and `<meta name="robots" content="noindex">`.

### 3. Domains

Project → **Settings → Domains**:

- Add `carolinacreampups.com` (+ `www`) — assigned to **Production** (the `main` branch).
- Add `beta.carolinacreampups.com` → assign it to the **`dev` branch** (Vercel lets
  you point a domain at a specific git branch). That gives `dev` a stable staging URL.

Your DNS is at Namecheap, so Vercel will show records to add there (an A/ALIAS for
the apex and CNAMEs for `www`/`beta`). Until DNS is pointed, deploys still work on
the auto-generated `*.vercel.app` URLs.

### 4. Branch protection (the CI gate)

GitHub → repo **Settings → Branches → Add rule** for `main`:

- ✅ Require status checks to pass before merging → select **`verify`**.
- ✅ Require a pull request before merging.

Now production (`main`) can only receive code that passed CI.

## How it works

- Push to `dev` → Vercel builds a Preview and updates `beta.carolinacreampups.com`.
- Open/update a PR → Vercel posts a unique preview URL on the PR.
- Merge to `main` (allowed only when `verify` is green) → Vercel builds Production
  and updates `carolinacreampups.com`.

## Rollback

Vercel dashboard → project → **Deployments** → pick a previous Production
deployment → **Promote to Production** (instant, no rebuild).
