# Vercel Deployment

Use Vercel's project settings for a static build from the Dendry/Dry source.

## Required settings

- **Framework Preset:** Other
- **Build Command:** `npm run build`
- **Output Directory:** `out/html`

The repository includes `vercel.json` with the same build command and output directory so Vercel rebuilds the playable HTML during deployment instead of relying on committed generated files.
