import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      syntax: ['chrome >= 60'],
      dts: {
        distPath:"./dist/types"
      },
    }
  ],
});
