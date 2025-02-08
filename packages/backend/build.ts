import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';

// 递归获取所有依赖
function getAllDependencies(pkgPath: string, deps = new Set<string>()) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));

  const allDeps = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.devDependencies || {}),
  ];

  for (const dep of allDeps) {
    if (deps.has(dep)) continue;

    deps.add(dep);

    // 如果是@repo开头的依赖,递归处理其package.json
    if (dep.startsWith('@repo/')) {
      try {
        const depPkgPath = path.resolve(
          __dirname,
          '../../packages',
          dep.split('/')[1],
          'package.json',
        );
        getAllDependencies(depPkgPath, deps);
      } catch (err) {
        console.warn(`Warning: Could not find package.json for ${dep}`);
      }
    }
  }

  return deps;
}

// 获取所有依赖但排除@repo开头的
const external = Array.from(
  getAllDependencies(path.resolve(__dirname, 'package.json')),
).filter((dep) => !dep.startsWith('@repo/'));

// console.log('External dependencies:', external);

build({
  entryPoints: [path.resolve(__dirname, 'src/server.ts')],
  outfile: path.resolve(__dirname, 'dist/server.js'),
  bundle: true,
  platform: 'node',
  external: [...external, 'dotenv'],
  target: 'node20',
  format: 'esm',
});

console.log('Build completed');
