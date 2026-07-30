# Cloudflare Pages Setup

This site is prepared for Cloudflare Pages using the current Encapsulate static-site workflow.

## Project

- Cloudflare Pages project name: `crossleys-catering-rebuild26`
- Repository: `EncapsulateGroup/crossleys-catering-rebuild26`
- Production domain: `https://crossleyscatering.co.uk/`
- Preview hostname: `https://crossleys-catering.pages.dev/`
- Build command: `npm run build`
- Build output directory: `public`
- Functions directory: `functions/`

## Public Variables

These are safe to store as Cloudflare Pages environment variables and are mirrored in `wrangler.jsonc` for local/reference use.

- `TURNSTILE_SITE_KEY`: `0x4AAAAAADPM-GErWOrsbJ5V`
- `BREVO_FROM_EMAIL`: `no-reply@crossleyscatering.co.uk`
- `ENQUIRY_NOTIFICATION_TO`: `crossleyscatering@gmail.com`
- `ENQUIRY_SITE_NAME`: `Crossleys Catering`
- `ENQUIRY_REPLY_TO_MODE`: `submitter`

## Secret Variables

Set these as Cloudflare Pages secrets, not committed files.

- `BREVO_API_KEY`
- `TURNSTILE_SECRET_KEY`

## Local Testing Notes

For Cloudflare Pages Functions testing, copy `.dev.vars.example` to `.dev.vars`, then replace secret placeholders locally. Do not commit `.dev.vars`.

```bash
npm run dev
```

For static-only preview:

```bash
python3 preview-server.py
```

Then open `http://127.0.0.1:8010/`.

## Included Cloudflare Files

- `wrangler.jsonc`
- `.dev.vars.example`
- `functions/`
- `public/thank-you/`
- `public/_headers`
- `public/_redirects`
- `public/sitemap.xml`
- `public/robots.txt`
- `public/404.html`
- `public/favicon.png`

## Included Go-Live Prep

- Static site output lives in `public/`.
- Forms post to `/api/enquiry` through Cloudflare Pages Functions.
- Public form config is served from `/api/form-config`.
- Turnstile is loaded only when `TURNSTILE_SITE_KEY` is available.
- Brevo delivery is handled server-side with `BREVO_API_KEY`.
- Cookie consent is global and gates the Google Maps embed until optional cookies are accepted.
- `sitemap.xml` and `robots.txt` use `https://crossleyscatering.co.uk/`.
- `robots.txt` includes the scoped `/cdn-cgi/` crawler fix.
- Public `mailto:` links include `rel="nofollow"`.
- `_redirects` keeps the apex domain canonical and redirects legacy `/index.php` to home.
- `_headers` adds conservative security headers, asset caching, noindex/no-store rules and a noindex rule for the Pages preview hostname only.
- `404.html` is a branded noindex page for Cloudflare Pages.

## Final Deployment Notes

Before launch, the deployment developer should:

- Add the real Brevo API key in Cloudflare.
- Add the real Turnstile secret key in Cloudflare.
- Confirm the Brevo sender email is verified, or replace `BREVO_FROM_EMAIL` with a verified sender.
- Configure Turnstile allowed domains for `crossleyscatering.co.uk` and preview domains.
- Deploy a Cloudflare Pages preview from `staging`.
- Test form submissions end to end.
- Confirm Brevo email delivery lands in `crossleyscatering@gmail.com`.
- Test cookie consent, Google Maps loading, redirects, 404 handling, `sitemap.xml`, and `robots.txt` on the Cloudflare preview/live domain.
- Replace holding policy copy with approved legal wording.
- Consider adding a strict Content Security Policy only after Turnstile, Google Maps, and form submissions are confirmed on Cloudflare preview.
