# Cloudflare Pages Setup

This site is prepared for Cloudflare Pages using the current Encapsulate static-site workflow.

## Project

- Cloudflare Pages project name: `crossleys-catering`
- Repository: `EncapsulateGroup/crossleys-catering-rebuild26`
- Production domain: `https://crossleyscatering.co.uk/`
- Preview hostname: `https://crossleys-catering.pages.dev/`
- Build command: `npm run build`
- Build output directory: `public`
- Functions directory: `functions/`

## Normal Variables

Add these directly in Cloudflare Pages under **Settings → Variables and Secrets**. This Git-connected Pages project intentionally has no deployment `wrangler.jsonc`, so the dashboard remains the source of truth.

- `TURNSTILE_SITE_KEY`: `0x4AAAAAADPM-GErWOrsbJ5V`
- `BREVO_FROM_EMAIL`: `no-reply@crossleyscatering.co.uk`
- `ENQUIRY_NOTIFICATION_TO`: `crossleyscatering@gmail.com`
- `ENQUIRY_SITE_NAME`: `Crossleys Catering`
- `ENQUIRY_REPLY_TO_MODE`: `submitter`

## Encrypted Secrets

Set these as encrypted Cloudflare Pages secrets, not committed files.

- `BREVO_API_KEY`
- `TURNSTILE_SECRET_KEY`

## Preview And Production

Production keeps the complete set of normal variables and encrypted secrets.

- Preview keeps `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` and `BREVO_API_KEY` only while end-to-end Preview form testing is required.
- During testing, authorise `crossleys-catering.pages.dev` in the Turnstile widget; this also covers its staging and deployment subdomains.
- At go-live, authorise `crossleyscatering.co.uk`, confirm the live form, then remove `crossleys-catering.pages.dev` if its widget capacity is needed elsewhere.
- After live sign-off, remove the three Preview values above when Preview submissions are no longer needed.
- Keep preview notification routing clearly distinguishable from production where practical.
- Redeploy Preview or Production after changing its configuration.
- Do not add a deployment `wrangler.jsonc` while the dashboard is the configuration source of truth.

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
- `_redirects` redirects legacy `/index.php` to home.
- The `www` to apex canonical redirect must be configured as a Cloudflare zone Redirect Rule because Pages `_redirects` accepts relative paths only.
- `_headers` adds conservative security headers, asset caching, noindex/no-store rules and a noindex rule for the Pages preview hostname only.
- `404.html` is a branded noindex page for Cloudflare Pages.

## Final Deployment Notes

Before launch, the deployment developer should:

- Confirm all normal form variables and encrypted secrets exist in Cloudflare Production.
- Keep Turnstile and Brevo values in Preview only while Preview form testing is required.
- Confirm the Brevo sender email is verified, or replace `BREVO_FROM_EMAIL` in Cloudflare with a verified sender.
- Configure `crossleys-catering.pages.dev` during Preview testing and `crossleyscatering.co.uk` for live use.
- After live sign-off, remove the `pages.dev` hostname and the Preview Turnstile/Brevo delivery values if Preview submissions are no longer required.
- Confirm the Cloudflare zone redirects `www.crossleyscatering.co.uk` to the apex domain while preserving the path and query string.
- Redeploy each affected environment after its configuration changes.
- Deploy a Cloudflare Pages preview from `staging`.
- Test form submissions end to end.
- Confirm Brevo email delivery lands in `crossleyscatering@gmail.com`.
- Test cookie consent, Google Maps loading, redirects, 404 handling, `sitemap.xml`, and `robots.txt` on the Cloudflare preview/live domain.
- Replace holding policy copy with approved legal wording.
- Consider adding a strict Content Security Policy only after Turnstile, Google Maps, and form submissions are confirmed on Cloudflare preview.
