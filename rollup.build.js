const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const { uglify } = require('rollup-plugin-uglify');
const license = require('rollup-plugin-license');

const browserBuildOptions = {
  file: 'lib/browser/hugerte-vue.js',
  format: 'iife',
  name: 'Editor',
  globals: {
    vue: 'Vue'
  }
};

const build = async (input, output)  => {
  const bundle = await rollup.rollup(input);
  await bundle.write(output);
};

[
  browserBuildOptions,
  { ...browserBuildOptions,
    file: 'lib/browser/hugerte-vue.min.js'
  }
].forEach((opts) => build({
  input: './src/main/ts/index.ts',
  plugins: [
    typescript({
      tsconfig: './tsconfig.browser.json'
    }),
    license({
      banner: [
        '/**',
        ' * <%= pkg.description %> version <%= pkg.version %> (<%= moment().format("YYYY-MM-DD") %>)',
        ' * Copyright (c) 2022 Ephox Corporation DBA Tiny Technologies, Inc.',
        ' * Copyright (c) 2024 HugeRTE contributors',
        ' * Licensed under the MIT license (https://github.com/hugerte/hugerte-vue/blob/main/LICENSE.TXT)',
        ' */'
      ].join('\n'),
    }),
    opts.file.endsWith('min.js') ? uglify({
      output: {
        comments: function (node, comment) {
          // TODO: does this work cleaner so we don't manually have to check for `/*!`?
          const text = comment.value;
          const type = comment.type;
          if (type === 'comment2') {
            // Preserve comments starting with `/*!`
            return /^!/.test(text);
          }
        }
      }
    }) : {}
  ]
}, opts).then(
  () => console.log(`bundled: ${opts.file}`))
);
