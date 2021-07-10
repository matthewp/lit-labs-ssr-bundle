#!/bin/bash

outfile=lib/mod.js

tgzfile=$(npm pack @lit-labs/ssr)

tar xvf $tgzfile

deno run --allow-read --allow-write scripts/replace-module.js

npx esbuild package/lib/lit-element-renderer.js \
  --bundle \
  --format=esm \
  --platform=node \
  --outfile=$outfile