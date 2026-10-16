// node tools/check.mjs: every check of metis-docs over the repository, one line per problem as
// path:line: rule: message, and exit 1 when there is any. The secret scan runs apart, with gitleaks.
import { spawnSync } from 'node:child_process'
import { cpSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  dashProblems,
  generated,
  headerProblems,
  idProblems,
  jsonOf,
  languageProblems,
  linkProblems,
  repositoryOf
} from './docs.mjs'

// The documents build.py writes: the main BRD and each addendum, by the name build.py takes.
export const BRD_DOCS = ['main', 'addendum-onboarding']
export const BUILD = 'business/requirements/source/build.py'
const REQUIREMENTS = 'business/requirements'
// The BRD ids build.py --ids prints, kept as a file so that the code repositories can pin a copy.
export const IDS = `${REQUIREMENTS}/ids.txt`
export const WIREFRAMES = 'design/wireframes'
const MANIFEST = `${WIREFRAMES}/manifest.json`
const WIREFRAME_OUTPUTS = ['manifest.json', 'index.html', 'wireframes-digest.md']

export const spawn = (command, args, options) =>
  spawnSync(command, args, { encoding: 'utf8', ...options })
// Why a run failed: the reason it could not start, or its exit status and the end of its output.
export const failed = (result) =>
  result.error
    ? result.error.message
    : `exit ${result.status}: ${`${result.stdout}${result.stderr}`.trim().slice(-300)}`

// The screens the wireframe manifest lists and the date it was built, or why it cannot be used; screens
// is null then.
function manifestOf(read) {
  const { value, problem } = jsonOf(read, MANIFEST)
  if (problem) return { screens: null, problem }
  const screens = value?.screens
  if (!Array.isArray(screens) || !screens.every((screen) => Number.isInteger(screen?.order))) {
    return { screens: null, problem: 'has no list of screens, each with an order number' }
  }
  return { screens: new Set(screens.map((screen) => screen.order)), date: value.generated }
}

// A generated file is what its generator writes now: build.py for the BRD and the list of its ids,
// build-index.mjs for the wireframes (with the date the committed manifest carries), and
// tools/generate.mjs for the rest.
function generatedProblems(root, repo, run, manifest, listed) {
  const { read } = repo
  const { files, problems: table } = generated(repo)
  const problems = [...table]
  const stale = (path, generator) =>
    problems.push(`${path}:1: generated: not what ${generator} writes now`)
  for (const [path, text] of files) {
    if (read(path) !== text) stale(path, 'tools/generate.mjs')
  }
  // A listing that failed is reported by the id rule, so only a listing that ran is compared.
  if (listed.status === 0 && read(IDS) !== listed.stdout) stale(IDS, `${BUILD} --ids`)
  const out = mkdtempSync(join(tmpdir(), 'metis-docs-check-'))
  try {
    for (const doc of BRD_DOCS) {
      const target = join(out, doc)
      const result = run('python3', [BUILD, doc, '--md-only', '--out', target], { cwd: root })
      if (result.status !== 0) {
        problems.push(`${BUILD}:1: generated: build.py ${doc} failed, ${failed(result)}`)
        continue
      }
      for (const name of readdirSync(target)) {
        const path = `${REQUIREMENTS}/${name}`
        if (read(path) !== readFileSync(join(target, name), 'utf8')) stale(path, `${BUILD} ${doc}`)
      }
    }
    // Without a manifest there is no date to build the wireframes with, and check has reported why.
    if (!manifest.problem) {
      const copy = join(out, 'wireframes')
      cpSync(join(root, WIREFRAMES), copy, { recursive: true })
      const env = { ...process.env, WIREFRAMES_DATE: manifest.date }
      const result = run('node', ['tools/build-index.mjs'], { cwd: copy, env })
      const builder = `${WIREFRAMES}/tools/build-index.mjs`
      if (result.status !== 0) problems.push(`${builder}:1: generated: failed, ${failed(result)}`)
      else {
        for (const name of WIREFRAME_OUTPUTS) {
          const path = `${WIREFRAMES}/${name}`
          if (read(path) !== readFileSync(join(copy, name), 'utf8')) stale(path, builder)
        }
      }
    }
  } finally {
    rmSync(out, { recursive: true, force: true })
  }
  return problems
}

// Every problem of the repository at root, and how many files and pages it read.
export function check(root, run = spawn) {
  const repo = repositoryOf(root)
  const { files, exists, read, pages } = repo
  const problems = []
  const add = (path, found) =>
    found.forEach(({ line, rule, message }) => problems.push(`${path}:${line}: ${rule}: ${message}`))
  for (const path of files) {
    const text = read(path)
    if (text === null) continue
    add(path, languageProblems(text))
    add(path, dashProblems(text))
  }
  const listed = run('python3', [BUILD, '--ids'], { cwd: root })
  if (listed.status !== 0) problems.push(`${BUILD}:1: id: build.py --ids failed, ${failed(listed)}`)
  const brd = new Set(listed.status === 0 ? listed.stdout.split('\n').filter(Boolean) : [])
  const manifest = manifestOf(read)
  if (manifest.problem) problems.push(`${MANIFEST}:1: id: ${manifest.problem}`)
  for (const { path, text, header, problem, line, lines } of pages) {
    if (problem) {
      add(path, [{ line, rule: 'header', message: problem }])
      continue
    }
    const rules = headerProblems(path, header, exists)
    add(path, rules.map((message) => ({ line: 1, rule: 'header', message })))
    add(path, idProblems(path, text, header, { brd, screens: manifest.screens }, lines))
    add(path, linkProblems(path, text, { exists, readPage: read }))
  }
  problems.push(...generatedProblems(root, repo, run, manifest, listed))
  return { problems, files: files.length, pages: pages.length }
}

/* node:coverage disable */
// Command line only: CI and people run it; check.test.mjs runs check() itself and this command line.
if (process.argv[1] && realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const root = process.argv[2] ?? join(import.meta.dirname, '..')
  const { problems, files, pages } = check(root)
  for (const line of problems) console.log(line)
  console.log(
    problems.length
      ? `check: ${problems.length} problems`
      : `check: clean (${pages} pages, ${files} files)`
  )
  process.exitCode = problems.length ? 1 : 0
}
/* node:coverage enable */
