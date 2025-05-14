import { mkdir } from 'fs/promises';

await mkdir('dist', {recursive: true});

const pkg = require('package');

const opts = {
  outdir: './dist',
  external: ['vue'],
  banner: `
/*!
 * ${pkg.description} version ${pkg.version} (${new Date().toISOString().slice(0, 10)})
 * Copyright (c) 2022 Ephox Corporation DBA Tiny Technologies, Inc.
 * Copyright (c) 2024 HugeRTE contributors
 * Licensed under the MIT license
 * Parts licensed under the Apache License, Version 2.0 (https://www.apache.org/licenses/LICENSE-2.0)
 * See https://github.com/hugerte/hugerte-vue/blob/9c2b09f/LICENSE.txt for more info.
 */`.trimStart()
};

await Bun.build({
  ...opts,
  entrypoints: ['./src/main/ts/index.ts'],
  naming: {
    entry: 'bundle.mjs',
  },
  format: 'esm'
});

await Bun.build({
  ...opts,
  entrypoints: ['./src/main/ts/index.ts'],
  naming: {
    entry: 'bundle.cjs',
  },
  format: 'cjs'
});

await Bun.build({
  ...opts,
  entrypoints: ['./src/main/ts/components/Vue2Editor.ts'],
  naming: {
    entry: 'vue2bundle.mjs',
  },
  format: 'esm'
});

await Bun.build({
  ...opts,
  entrypoints: ['./src/main/ts/components/Vue2Editor.ts'],
  naming: {
    entry: 'vue2bundle.cjs',
  },
  format: 'cjs'
});
