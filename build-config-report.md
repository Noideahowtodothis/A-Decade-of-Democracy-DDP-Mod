# Build Configuration Report

## Build command

The existing project documentation says to run `dendrynexus make-html` from the repository root to build the game. The npm scripts previously exposed the Dendry Nexus CLI as `npm run dendrynexus`, but did not define a conventional `build` script.

A minimal npm build script has been added:

```sh
npm run build
```

It runs:

```sh
dendrynexus make-html --force
```

The `--force` flag asks Dendry Nexus to recompile from `source/` even when existing generated output appears up to date.

## out/html tracking status

`out/html` is currently tracked in git. At the time of this report, git lists 8 tracked files under `out/html`.

Because `out/html` is already tracked, this change does not add it to `.gitignore` and does not remove any generated files automatically.

## Vercel rebuild behavior

`vercel.json` now configures Vercel to run `npm run build` and serve `out/html` as the deployment output directory. This means Vercel will regenerate the playable HTML from the source files during deployment rather than depending only on the committed `out/html` contents.
