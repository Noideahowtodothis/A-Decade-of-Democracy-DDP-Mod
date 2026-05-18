# Vercel Deployment

This repository deploys the already-committed static site in `out/html`.
Do **not** run Dendry/DendryNexus during Vercel deployment: the generated HTML is
already committed and Vercel should serve it directly.

## Vercel project settings

Use these settings in **Settings → Build & Development Settings**:

| Setting | Value |
| --- | --- |
| Framework Preset | `Other` |
| Build Command | Leave blank, or use `echo "No build needed"` if Vercel requires a value |
| Output Directory | `out/html` |

The committed `vercel.json` also disables the build command and points Vercel at
`out/html`.

## Static output workflow

Vercel will only deploy the files that are already present in `out/html`. If you
change files under `source/` or otherwise change game content, you must manually
regenerate `out/html` locally and commit the regenerated output before deploying.

Until a working Dendry/DendryNexus build tool is added to this repository, Vercel
should not be responsible for generating HTML from source files.

## Short report

The previous deployment path invoked `npx dendrynexus make-html --force`, which
can fail on Vercel because `dendrynexus` is not available from npm through that
command. The deployment configuration now treats `out/html` as the source of
truth for hosting and skips the build step. Future source changes require a
manual rebuild and committed `out/html` update unless this repository gains a
working, reproducible Dendry/DendryNexus build tool.
