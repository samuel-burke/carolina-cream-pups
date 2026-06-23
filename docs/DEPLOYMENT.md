# Deployment

Continuous deployment runs on **GitHub Actions → Vercel**, gated by CI. The
`deploy` job in `.github/workflows/ci.yml` only runs after `verify`
(lint/typecheck/test/build) passes, and only on pushes:

| Branch | Environment | Domain                      | Indexable? |
| ------ | ----------- | --------------------------- | ---------- |
| `main` | production  | `carolinacreampups.com`     | yes        |
| `dev`  | staging     | `beta.carolinacreampups.com`| no (noindex) |

Pull requests run CI but do **not** deploy.

## One-time setup

### 1. Create & link the Vercel project

```bash
npm i -g vercel
vercel login
vercel link        # run in the repo root; creates .vercel/ locally (gitignored)
```

After linking, read the IDs from `.vercel/project.json` (`orgId`, `projectId`).

### 2. Create a Vercel token

Vercel dashboard → **Account Settings → Tokens → Create**. Copy the value.

### 3. Add GitHub repository secrets

Repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret              | Value                                  |
| ------------------- | -------------------------------------- |
| `VERCEL_TOKEN`      | the token from step 2                  |
| `VERCEL_ORG_ID`     | `orgId` from `.vercel/project.json`    |
| `VERCEL_PROJECT_ID` | `projectId` from `.vercel/project.json`|

> Optional: create GitHub **Environments** named `production` and `staging`
> (Settings → Environments). The workflow already targets them, so you can later
> add required reviewers to `production` for a manual approval gate.

### 4. Configure Vercel environment variables

Vercel project → **Settings → Environment Variables**:

| Variable                | Production environment        | Preview environment              |
| ----------------------- | ----------------------------- | -------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | `https://carolinacreampups.com` | `https://beta.carolinacreampups.com` |
| `NEXT_PUBLIC_NOINDEX`   | _(unset)_                     | `1`                              |

`NEXT_PUBLIC_NOINDEX=1` on Preview makes the staging build serve
`robots.txt → Disallow: /` and `<meta name="robots" content="noindex">`.

### 5. Configure domains

Vercel project → **Settings → Domains**:

- Add `carolinacreampups.com` (and `www`) — keep it assigned to **Production**.
- Add `beta.carolinacreampups.com` — the staging deploy is aliased to it by the
  workflow (`vercel alias set`).

Point DNS at Vercel per the dashboard instructions (A/ALIAS for the apex,
CNAME for `beta`).

## How it works

- The workflow uses the Vercel CLI: `vercel pull` (fetch project settings/env for
  the target environment) → `vercel build` (build with those settings) →
  `vercel deploy --prebuilt` (upload the build).
- **main** deploys with `--prod`, which promotes the build to the production
  domain automatically.
- **dev** deploys a preview build, then `vercel alias set <url>
  beta.carolinacreampups.com` pins it to the stable staging domain.
- `vercel.json` disables Vercel's native Git auto-deploy for `main`/`dev`, so
  GitHub Actions is the single source of deploys (no double-deploys).

## Rollback

Vercel dashboard → project → **Deployments** → pick a previous production
deployment → **Promote to Production**. (Or `vercel rollback <url>` /
`vercel promote <url>` with the CLI.)

## Verifying after setup

```bash
# Staging should be blocked from indexing:
curl https://beta.carolinacreampups.com/robots.txt      # -> Disallow: /

# Production should be crawlable:
curl https://carolinacreampups.com/robots.txt           # -> Allow: /  + Sitemap
```

Also confirm a failing CI run blocks the `deploy` job (push a deliberately broken
commit to `dev` and watch the workflow stop at `verify`).
