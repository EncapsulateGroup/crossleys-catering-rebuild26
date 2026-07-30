# Pre-Go-Live Checklist

## Completed Prep

- Static output moved into `public/` for Cloudflare Pages.
- Cloudflare Pages build output and runtime configuration are managed in the dashboard.
- `package.json` added so `npm run build` runs the local site checks.
- Placeholder local secrets file updated as `.dev.vars.example`.
- Enquiry forms wired to Cloudflare Pages Functions at `/api/enquiry`.
- Safe public form config endpoint added at `/api/form-config`.
- Brevo email delivery function updated to the current environment variable names.
- No deployment `wrangler.jsonc` is committed, so dashboard-managed Pages variables remain authoritative.
- Enquiry notification recipient remains `crossleyscatering@gmail.com`.
- Thank-you page is included and marked `noindex`.
- Cookie consent is included with accept/reject controls and a persistent Cookie Settings button.
- Google Maps embed is blocked until optional cookies are accepted.
- Holding Privacy Policy, Cookie Policy and Terms & Conditions pages are in place.
- `sitemap.xml` and `robots.txt` are included in `public/` for `https://crossleyscatering.co.uk/`.
- `robots.txt` includes `Disallow: /cdn-cgi/`.
- Public `mailto:` links include `rel="nofollow"`.
- Branded `404.html` is included and marked `noindex`.
- `_redirects` includes the legacy `/index.php` redirect.
- The `www` to apex canonical redirect is a Cloudflare zone Redirect Rule because Pages `_redirects` accepts relative paths only.
- `_headers` is included for security defaults, asset caching, preview noindex and noindex/no-store rules.
- `public/favicon.png` is generated from the site logo and linked from rendered HTML pages.

## Local Checks To Run

```bash
git diff --check
npm run build
node --check functions/api/enquiry.js
node --check functions/api/form-config.js
node --check public/assets/js/main.js
python3 - <<'PY'
import xml.etree.ElementTree as ET
ET.parse('public/sitemap.xml')
print('sitemap: valid xml')
PY
```

If Wrangler is installed:

```bash
wrangler pages functions build functions --outdir /tmp/crossleys-functions-check --compatibility-date 2026-05-25
```

## Deployment-Only Tasks

- Add the complete set of normal form variables and encrypted secrets to Cloudflare Production.
- Keep `TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` and `BREVO_API_KEY` in Preview only while Preview form testing is required.
- During testing, authorise `crossleys-catering.pages.dev` in the Turnstile widget.
- Confirm Production `TURNSTILE_SITE_KEY` is set to `0x4AAAAAADPM-GErWOrsbJ5V`.
- Confirm `BREVO_FROM_EMAIL` is a Brevo-verified sender, or replace it in Cloudflare with one.
- Authorise `crossleyscatering.co.uk` for live use, confirm the live form, then remove `crossleys-catering.pages.dev` and the three Preview values above after sign-off if Preview submissions are no longer required.
- Confirm the Cloudflare zone redirects `www.crossleyscatering.co.uk` to the apex domain while preserving the path and query string.
- Redeploy each environment after adding or changing its variables or secrets.
- Deploy `staging` to Cloudflare Pages preview and test forms end to end.
- Confirm Brevo email delivery lands in `crossleyscatering@gmail.com`.
- Test cookie consent and Google Maps loading on Cloudflare preview.
- Test redirects and the custom 404 page on Cloudflare preview.
- Replace holding policy copy with approved legal wording.
- Consider adding a strict Content Security Policy after all third-party services are confirmed.
