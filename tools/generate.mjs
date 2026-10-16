// node tools/generate.mjs: writes llms.txt from the page headers, the banner of every record from
// history/records.json, and business/requirements/ids.txt from build.py --ids. The BRD has its own
// builder (business/requirements/source/build.py), and so do the wireframe outputs
// (design/wireframes/tools/build-index.mjs).
import { realpathSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { BUILD, failed, IDS, spawn } from './check.mjs'
import { generated, LLMS, repositoryOf } from './docs.mjs'

// Writes the generated files of the repository at root and returns whether it wrote them, how many
// record banners that is and the problems that kept a record from getting its banner. When an input
// cannot be read, or build.py cannot list the ids, it writes nothing at all, so a tree is never half
// generated.
export function generate(root, run = spawn) {
  const { files, banners, problems } = generated(repositoryOf(root))
  const listed = run('python3', [BUILD, '--ids'], { cwd: root })
  if (listed.status !== 0) {
    const problem = `${BUILD}:1: generated: build.py --ids failed, ${failed(listed)}`
    return { wrote: false, banners: 0, problems: [...problems, problem] }
  }
  if (files.size === 0) return { wrote: false, banners, problems }
  files.set(IDS, listed.stdout)
  for (const [path, text] of files) writeFileSync(join(root, path), text)
  return { wrote: true, banners, problems }
}

/* node:coverage disable */
// Command line only: people and the docs agent run it; check.test.mjs runs generate() itself and this
// command line.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { wrote, banners, problems } = generate(process.argv[2] ?? join(import.meta.dirname, '..'))
  for (const line of problems) console.log(line)
  console.log(
    wrote ? `generate: wrote ${LLMS}, ${IDS} and ${banners} record banners` : 'generate: wrote nothing'
  )
  process.exitCode = problems.length ? 1 : 0
}
/* node:coverage enable */
