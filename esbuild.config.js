const esbuild = require('esbuild');
const { pathAliasPlugin } = require('./esbuild.plugin');

async function build() {
  try {
    await esbuild.build({
      entryPoints: ['src/index.ts'],
      bundle: true,
      platform: 'node',
      target: 'node18',
      format: 'cjs',
      outfile: 'dist/bundle.js',
      minify: true,
      plugins: [pathAliasPlugin],
      external: ['*.test.ts', '*.spec.ts'],
    });

    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();
