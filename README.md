# PassportPhoto Pro - Global Passport & Visa Photo Platform

PassportPhoto Pro is an automated biometric photo maker platform with programmatic SEO landing pages for every country and document type.

## Architecture

1. **Next.js 16 (App Router)**:
   - Dynamic programmatic SEO routes: `/[country]/[docType]-photo`
   - Baby passport guides: `/[country]/baby-passport-photo`
   - Common rejection reasons: `/[country]/photo-rejected-reasons`
   - DIY guides: `/[country]/passport-photo-at-home`
   - Validated at build time via `npm run validate-specs`.

2. **In-Browser Client-Side Processing**:
   - Biometric face alignment, chin/crown proportion verification, and eye level guidelines.
   - Zero-server-cost background removal executed in-browser using HTML5 Canvas & WebAssembly.
   - Compliance with Illinois BIPA, GDPR, and CCPA (user photos are never transmitted to or saved on a backend GPU server).

3. **Payments & Subscriptions**:
   - International Payments: Stripe Checkout (`/api/checkout/stripe`) with webhook verification (`/api/webhooks/stripe`).
   - India Domestic Payments: Razorpay cryptographic HMAC-SHA256 signature verification (`/api/razorpay/verify-payment`).
   - Instant automated credit activation.

---

## Strict Government Verification Rule

> [!IMPORTANT]
> **NEVER invent numbers in specification files.**
> A spec may have `verified: true` **ONLY** if:
> 1. You read and confirmed every millimeter dimension directly from an official government immigration or foreign affairs website.
> 2. You populated the `sourceUrl` field with that official government webpage.
> 3. You populated `lastVerified` with the verification date (`YYYY-MM-DD`).
> 
> If a value cannot be officially verified, set `verified: false` and leave unconfirmed fields `null`. Pages for unverified specs display "Check official requirements" and never claim compliance.

---

## How to Add a New Country Specification

1. Create a new JSON file under `data/specs/`:
   ```bash
   data/specs/{country-slug}-{docType-slug}.json
   ```
   *Example: `data/specs/sweden-passport.json`*

2. Fill out the specification using the following schema:
   ```json
   {
     "country": "Sweden",
     "countryCode": "SE",
     "countrySlug": "sweden",
     "docType": "passport",
     "docTypeSlug": "passport",
     "docTitle": "Sweden Biometric Passport Photo",
     "widthMm": 35,
     "heightMm": 45,
     "dpi": 300,
     "minPx": { "width": 413, "height": 531 },
     "maxPx": { "width": 1200, "height": 1600 },
     "maxFileKB": 2048,
     "fileFormat": ["image/jpeg"],
     "headHeightMinMm": 31,
     "headHeightMaxMm": 36,
     "eyeLineFromBottomMm": 26,
     "backgroundColor": "#E5E7EB",
     "notes": {
       "glasses": "No reflections or dark frames obscuring eyes.",
       "smile": "Neutral facial expression with closed mouth.",
       "ears": "Face edges unobstructed.",
       "shadows": "Even lighting, no shadow on face or background.",
       "babyRules": "Infants under 1 do not need to face directly straight."
     },
     "sourceUrl": "https://polisen.se/en/laws-and-regulations/passport-and-national-id-card/photo-guidelines/",
     "lastVerified": "2026-10-18",
     "verified": true
   }
   ```

3. Run the validation script:
   ```bash
   npm run validate-specs
   ```
   If any required field is missing or an unverified source URL is used with `verified: true`, the script will fail and pinpoint the error.

4. Test the page locally:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:3000/sweden/passport-photo`.
