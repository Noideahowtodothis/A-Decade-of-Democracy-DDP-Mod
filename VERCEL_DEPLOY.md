# Vercel deployment

This repository now builds the playable static site from the DendryNexus source
files during deployment instead of treating committed `out/html` files as the
source of truth.

## Vercel settings

| Setting | Value |
| --- | --- |
| Build Command | `npm run build` |
| Output Directory | `out/html` |

The committed `vercel.json` sets these same values, so Vercel should pick them
up automatically unless the project dashboard overrides them.

## Exact build command

Vercel runs:

```sh
npm run build
```

The `build` script expands to:

```sh
dendrynexus make-html --force --pretty && cp out/game.json out/html/game.json
```

`dendrynexus make-html --force --pretty` recompiles the project from the
`source/*.dry` tree and writes the generated browser files under `out/html`.
The copy step places the freshly compiled `out/game.json` beside the HTML files,
matching the existing GitHub Actions build artifact layout and the browser
runtime's `game.json` fetch path.

## Where DendryNexus comes from

DendryNexus is not a local script and is not vendored in this repository. It is
an npm dependency installed from the GitHub source archive for
`https://github.com/aucchen/dendrynexus` at commit
`aa4287ed2c03940c52b190c0a8c102b795ac1c79`.

The dependency exposes a `dendrynexus` binary through its package `bin` entry
(`lib/cli/main.js`). npm automatically adds local dependency binaries to `PATH`
when running package scripts, so `npm run build` uses `node_modules/.bin/dendrynexus`
and does not require a globally installed `dendrynexus` command.

The package is named `dendrynexus`; there is no separate npm registry package
name used by this project.

## Fresh clone deployment behavior

A fresh clone should be able to run:

```sh
npm install
npm run build
```

Vercel performs dependency installation before the build command, then runs
`npm run build`, then serves `out/html`.

Because DendryNexus is sourced from a pinned GitHub archive rather than a
registry package, the build environment must be able to fetch public GitHub
archive URLs over HTTPS.
If that fetch is unavailable, dependency installation will fail before the build
script runs. In that case, the manual/local build requirement is:

```sh
npm install
npm run build
```

from a networked environment that can fetch
`https://codeload.github.com/aucchen/dendrynexus/tar.gz/aa4287ed2c03940c52b190c0a8c102b795ac1c79`, followed by deploying the resulting
`out/html` directory.
