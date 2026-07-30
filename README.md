# Crossleys Catering static rebuild

Static HTML, CSS and JavaScript rebuild for Crossleys Catering, prepared for Cloudflare Pages.

## Local development

```bash
npm run dev
```

This runs `wrangler pages dev public`, which mirrors the Cloudflare Pages output directory and keeps Pages Functions available locally when `.dev.vars` is configured.

For a quick static-only preview:

```bash
python3 preview-server.py
```

Then open `http://127.0.0.1:8010/`.

## Checks and build

```bash
npm run check
npm run build
```

`npm run build` intentionally runs the static site checks. There is no bundled frontend build step because this is a static site.

## Cloudflare Pages settings

- Framework preset: None
- Build command: `npm run build`
- Build output directory: `public`
- Production branch: `main`
- Preview branch: `staging`
- Functions directory: `functions/`

## Required Cloudflare variables

Wrangler contains project/runtime settings only and sets `keep_vars: true` so deployments preserve dashboard-managed variables. Add the following normal variables directly in Cloudflare Pages under **Settings → Variables and Secrets** for both Preview and Production:

- `TURNSTILE_SITE_KEY`: `0x4AAAAAADPM-GErWOrsbJ5V`
- `BREVO_FROM_EMAIL`: `no-reply@crossleyscatering.co.uk`
- `ENQUIRY_NOTIFICATION_TO`: `crossleyscatering@gmail.com`
- `ENQUIRY_SITE_NAME`: `Crossleys Catering`
- `ENQUIRY_REPLY_TO_MODE`: `submitter`

Add the following as encrypted secrets in both environments:

- `BREVO_API_KEY`
- `TURNSTILE_SECRET_KEY`

Preview may use Cloudflare's universal Turnstile test credentials. Production must use the live widget credentials. Redeploy the relevant environment after adding or changing any value.

Do not commit real API keys, secret keys, `.dev.vars`, `.env`, `.wrangler/`, WordPress backups or `node_modules/`.

## Included go-live files

- `public/` static site output
- `functions/api/enquiry.js`
- `functions/api/form-config.js`
- `public/thank-you/`
- `public/_headers`
- `public/_redirects`
- `public/sitemap.xml`
- `public/robots.txt`
- `public/404.html`
- `public/favicon.png`
- `scripts/check-site.mjs`
- `wrangler.jsonc`
- `.dev.vars.example`

## Form notes

- Forms submit to `/api/enquiry`.
- Safe public form config is served from `/api/form-config`.
- Turnstile is rendered only when `TURNSTILE_SITE_KEY` is available.
- Turnstile validation is server-side and requires `TURNSTILE_SECRET_KEY`.
- Brevo delivery is server-side and requires `BREVO_API_KEY`.
- Enquiry notifications are sent to `crossleyscatering@gmail.com`.

## Handover note

Client: Crossleys Catering
Repository: `https://github.com/EncapsulateGroup/crossleys-catering-rebuild26`
Cloudflare Pages project: `crossleys-catering`
Staging URL: `https://crossleys-catering.pages.dev/`
Production URL, if connected: `https://crossleyscatering.co.uk/`
Live reference URL: `https://crossleyscatering.co.uk/`
Branch currently ready for review: `staging`
Forms included: General enquiry forms on the contact page and footer site-wide
Notification recipient: `crossleyscatering@gmail.com`
Brevo sender email: `no-reply@crossleyscatering.co.uk` must be verified in Brevo, or replaced with a verified sender
Required Cloudflare variables: `TURNSTILE_SITE_KEY`, `BREVO_FROM_EMAIL`, `ENQUIRY_NOTIFICATION_TO`, `ENQUIRY_SITE_NAME`, `ENQUIRY_REPLY_TO_MODE`
Required Cloudflare secrets: `BREVO_API_KEY`, `TURNSTILE_SECRET_KEY`
Known issues / differences from live site: Policy pages are holding copy and need approved legal text before launch
Favicon status: `public/favicon.png` generated from the site logo and linked from rendered pages
Cloudflare /cdn-cgi crawler fix status: `public/robots.txt` includes `Disallow: /cdn-cgi/`; public `mailto:` links include `rel="nofollow"`
Recommended next action: Confirm all normal variables and encrypted secrets in Cloudflare Preview and Production, redeploy, then test forms end to end
