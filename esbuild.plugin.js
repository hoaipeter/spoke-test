const path = require('path');
const fs = require('fs');

const pathAliasPlugin = {
  name: 'path-alias',
  setup(build) {
    build.onResolve({ filter: /^#\// }, (args) => {
      const resolvedPath = args.path.replace(/^#\//, 'src/');
      const fullPath = path.resolve(resolvedPath);

      // If it's a directory, try index.ts
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory()) {
        return { path: path.join(fullPath, 'index.ts') };
      }

      // Otherwise return the path (esbuild will handle .ts extension)
      return { path: fullPath };
    });
  },
};

module.exports = { pathAliasPlugin };
