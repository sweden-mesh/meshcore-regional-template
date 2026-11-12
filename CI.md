# Building and deploying a region site on any CI

The site is Hugo (≥ 0.146) plus Go (to fetch the template module). The output in `public/` is
static files. Everything below runs the same three steps: install Hugo and Go, `hugo --gc
--minify`, upload `public/`.

Staging: set `HUGO_PARAMS_NOINDEX=true` so the build is not indexed (and has no statistics).

## GitHub Actions + Cloudflare Pages

See `.github/workflows/deploy.yml` in meshcore-jkp.se: `wrangler pages deploy` with a Pages-only
API token; branch `dev` → staging, `main` → production, plus a cron rebuild for fresh Beacon data.

## GitLab CI

```yaml
image: golang:1.24
variables: { HUGO_VERSION: "0.169.0" }
build:
  script:
    - curl -sSL "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz" | tar -xz hugo
    - ./hugo --gc --minify
  artifacts: { paths: [public] }
pages:            # GitLab Pages serves the job named "pages" from public/
  needs: [build]
  script: ["true"]
  artifacts: { paths: [public] }
  rules: [{ if: '$CI_COMMIT_BRANCH == "main"' }]
```

## Codeberg (Forgejo Actions) / Woodpecker

Forgejo Actions reads the same workflow syntax as GitHub Actions: copy `deploy.yml`, change the
runner label (`runs-on: docker`), and replace the Cloudflare step with your host's upload, or push
`public/` to a `pages` branch for Codeberg Pages.

Woodpecker:

```yaml
steps:
  build:
    image: golang:1.24
    environment: { HUGO_VERSION: "0.169.0" }
    commands:
      - curl -sSL "https://github.com/gohugoio/hugo/releases/download/v$${HUGO_VERSION}/hugo_extended_$${HUGO_VERSION}_linux-amd64.tar.gz" | tar -xz hugo
      - ./hugo --gc --minify
```

## Any web host

```sh
hugo --gc --minify
rsync -a --delete public/ user@host:/var/www/meshcore/
```

Serve `404.html` for missing paths. Without a Pages Function, leave `params.analytics` off (or
point it at a same-origin proxy your server provides).
