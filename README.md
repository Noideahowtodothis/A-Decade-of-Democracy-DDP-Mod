# Social Democracy: An Alternate History

## Included Libraries

[jquery v1.11.1](https://releases.jquery.com/)

[d3.js v7](https://d3js.org)

[d3-parliament](https://github.com/geoffreybr/d3-parliament)

## Building the game

Install dependencies and run the project build script:

```sh
npm install
npm run build
```

`npm run build` uses the local `dendrynexus` dependency to regenerate the
playable HTML output in `out/html` from the DendryNexus source files under
`source/`. A globally installed `dendrynexus` command is not required.

See `VERCEL_DEPLOY.md` for deployment details and the pinned DendryNexus source.
