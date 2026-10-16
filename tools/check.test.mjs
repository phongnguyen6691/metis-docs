// Tests of tools/check.mjs and tools/generate.mjs on a small repository, run with node --test. Its
// build.py and build-index.mjs are stand-ins that write fixed outputs, so the tests need no BRD.
import assert from 'node:assert/strict'
import { readdirSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, join } from 'node:path'
import { test } from 'node:test'

import { BRD_DOCS, BUILD, check, IDS, spawn, WIREFRAMES } from './check.mjs'
import { LLMS, RECORDS } from './docs.mjs'
import { generate } from './generate.mjs'
import {
  CLAUDE,
  dashProblem,
  EM_DASH,
  generatedProblem,
  HEAD,
  headerProblem,
  idProblem,
  itemOf,
  JSON_NULL,
  LINK_MESSAGES,
  letterProblem,
  linkProblem,
  NO_ENTRY,
  NO_HEADER,
  noBrdId,
  noEntry,
  NOT_READABLE,
  NOT_TEXT,
  NOT_UTF8,
  notJson,
  OUTSIDE_HISTORY,
  OVERVIEW,
  page,
  printed,
  README,
  RECORD,
  RECORD_HEAD,
  recordProblem,
  REFERENCE,
  summaryOf,
  TOOLS,
  tree,
  VIETNAMESE,
  WHOLE,
  WITH_NUL,
  WRITTEN,
  write
} from './fixtures.mjs'

// Fixture values, each named once.
const BRD_IDS = HEAD.ids // the ids the stand-in build.py lists
const IDS_TEXT = `${BRD_IDS.join('\n')}\n` // what the stand-in prints for them, a line each
const [OVERVIEW_ID, OTHER_ID] = BRD_IDS
const UNKNOWN_ID = 'CHG-09'
const MISSING_LINK = 'gone.md'
const SCREEN = 24
const DATE = '2026-10-03'
const RECORD_COUNT = 1 // the record pages of the repository below
const PLAIN_PAGE = 'business/plain.md'
const UNKNOWN_IDS_PAGE = 'business/unknown-id.md'
const MISPLACED_RECORD = 'business/old.md'
const BROKEN = 'business/broken.md'
const ANCHOR = 'intro'
const CUT_JSON = '{"screens": ['
const NO_SCREENS = 'has no list of screens, each with an order number'
const FAIL = 'FAIL' // a file beside build.py or build-index.mjs that makes it fail
const FAIL_IDS = 'FAIL_IDS' // the same for build.py --ids
const IDS_FAILED = 'ids failed'
const BUILD_FAILED = 'build failed'
const QUOTE_LIMIT = 300 // how much of a failed builder's output check quotes
const NOT_AN_ID = 'week-12' // a hyphen and two digits, like an id, but no BRD id has the prefix week
const NO_PYTHON = 'spawnSync python3 ENOENT'
const EDITIONS = 'business/requirements'
const [DOCS_MJS, CHECK_MJS, GENERATE_MJS] = ['docs.mjs', 'check.mjs', 'generate.mjs']
const OVERVIEW_TITLE = 'Overview'
const README_TITLE = 'Readme'
const FAILED = 'failed'
const GENERATE = `${TOOLS}/${GENERATE_MJS}`
const OUTPUTS = ['manifest.json', 'index.html', 'wireframes-digest.md'] // what build-index.mjs writes
const [MANIFEST, GALLERY, DIGEST_FILE] = OUTPUTS
const BUILDER = `${WIREFRAMES}/tools/build-index.mjs`

// A page of the repository: HEAD with this title and the given fields, then its body.
const pageOf = (title, fields = {}, body = `# ${title}\n`) =>
  page({ ...HEAD, title, summary: summaryOf(title), ids: [], ...fields }, body)
const generatedPage = (title, from) => pageOf(title, { type: REFERENCE, generated_from: from })
const recordPage = (title) => pageOf(title, { type: RECORD_HEAD.type, status: RECORD_HEAD.status })
const BRD_PAGE = generatedPage('BRD', BUILD)
const NO_ENTRY_PAGE = recordPage('Plan Q')
const edition = (doc) => `${EDITIONS}/${doc}.md`
const wireframe = (name) => `${WIREFRAMES}/${name}`
const MANIFEST_PATH = wireframe(MANIFEST)

// The lines check prints for the problems the tests expect.
const exited = (output) => `exit 1: ${output}` // every stand-in fails with status 1
const stale = (path, generator) => printed(path, generatedProblem(1, `not what ${generator} writes now`))
const idsFailed = (reason) => printed(BUILD, idProblem(1, `build.py --ids failed, ${reason}`))
const buildFailed = (doc, reason) => printed(BUILD, generatedProblem(1, `build.py ${doc} failed, ${reason}`))
const cleanLine = (pages, files) => `check: clean (${pages} pages, ${files} files)\n`
const wrote = (banners) => `generate: wrote ${LLMS}, ${IDS} and ${banners} record banners\n`
const NOTHING = 'generate: wrote nothing\n'
// What generate() gives back when it wrote the files, with the problems it found on the way.
const written = (problems) => ({ wrote: true, banners: RECORD_COUNT, problems })

// The stand-in build.py: --ids lists the ids; '<doc> --md-only --out <folder>' writes <doc>.md there and
// anything else is refused. A file named FAIL beside it makes a document fail, and FAIL_IDS makes --ids
// fail, each with the text of the file as its message.
const BUILD_PY = `import pathlib, sys
here = pathlib.Path(__file__).parent
args = sys.argv[1:]
if args == ["--ids"]:
    if (here / ${JSON.stringify(FAIL_IDS)}).exists():
        sys.exit((here / ${JSON.stringify(FAIL_IDS)}).read_text())
    print("\\n".join(${JSON.stringify(BRD_IDS)}))
    sys.exit(0)
if len(args) != 4 or args[1:3] != ["--md-only", "--out"]:
    sys.exit("unexpected arguments: " + " ".join(args))
if (here / ${JSON.stringify(FAIL)}).exists():
    sys.exit((here / ${JSON.stringify(FAIL)}).read_text())
out = pathlib.Path(args[3])
out.mkdir(parents=True, exist_ok=True)
(out / (args[0] + ".md")).write_text(${JSON.stringify(BRD_PAGE)})
`
const DIGEST = generatedPage('Digest', BUILDER)
// The stand-in build-index.mjs writes its three outputs with the date it is given.
const BUILD_INDEX = `import { existsSync, writeFileSync } from 'node:fs'
if (existsSync(${JSON.stringify(FAIL)})) process.exit(1)
const date = process.env.WIREFRAMES_DATE
writeFileSync(${JSON.stringify(MANIFEST)}, JSON.stringify({ generated: date, screens: [{ order: ${SCREEN} }] }) + '\\n')
writeFileSync(${JSON.stringify(GALLERY)}, '<p>' + date + '</p>\\n')
writeFileSync(${JSON.stringify(DIGEST_FILE)}, ${JSON.stringify(DIGEST)})
`

const FILES = {
  [CLAUDE]: '@AGENTS.md\n',
  [README]: pageOf(README_TITLE),
  [OVERVIEW]: pageOf(
    OVERVIEW_TITLE,
    { ids: [OVERVIEW_ID] },
    `# ${OVERVIEW_TITLE}\n\n${OTHER_ID} on screen ${SCREEN}, ${NOT_AN_ID}, see [the readme](../${README}).\n`
  ),
  [RECORD]: recordPage(RECORD_HEAD.title),
  [RECORDS]: JSON.stringify({ [RECORD]: { written: WRITTEN, replacedBy: [OVERVIEW], translation: WHOLE } }),
  [BUILD]: BUILD_PY,
  ...Object.fromEntries(BRD_DOCS.map((doc) => [edition(doc), BRD_PAGE])),
  [MANIFEST_PATH]: `${JSON.stringify({ generated: DATE, screens: [{ order: SCREEN }] })}\n`,
  [wireframe(GALLERY)]: `<p>${DATE}</p>\n`,
  [wireframe(DIGEST_FILE)]: DIGEST,
  [BUILDER]: BUILD_INDEX,
  'design/brand/logo.png': WITH_NUL
}

// A small repository of these files, with llms.txt and the record banner generated.
const repositoryFrom = (files) => {
  const root = tree(files)
  assert.deepEqual(generate(root), written([]))
  return { root, paths: Object.keys(files) }
}
const repository = () => repositoryFrom(FILES)
const read = (root, path) => readFileSync(join(root, path), 'utf8')
const edit = (root, path, change) => write(root, path, change(read(root, path)))
// Appends one line to a file and returns its line number.
const append = (root, path, line) => {
  const at = read(root, path).split('\n').length
  edit(root, path, (text) => `${text}${line}\n`)
  return at
}

test('a complete repository is clean, and generate wrote llms.txt, the BRD ids and the banner of each record', () => {
  const { root, paths } = repository()
  // Every file of the repository plus the generated llms.txt and ids file; every Markdown file but
  // CLAUDE.md is a page.
  const pages = paths.filter((path) => path.endsWith('.md') && path !== CLAUDE).length
  assert.deepEqual(check(root), { problems: [], files: paths.length + 2, pages })
  assert.equal(read(root, IDS), IDS_TEXT)
  const lines = read(root, LLMS).split('\n')
  const item = itemOf(RECORD_HEAD.title, RECORD, summaryOf(RECORD_HEAD.title))
  assert.ok(lines.includes(item), lines.join('\n'))
  assert.match(read(root, RECORD), /machine translation of a Vietnamese record/)
})

test('generate writes llms.txt and the BRD ids alone when no page is a record', () => {
  const root = tree({ [README]: pageOf(README_TITLE), [BUILD]: BUILD_PY })
  assert.deepEqual(generate(root), { wrote: true, banners: 0, problems: [] })
  assert.ok(read(root, LLMS).split('\n').includes(itemOf(README_TITLE, README, summaryOf(README_TITLE))))
  assert.equal(read(root, IDS), IDS_TEXT)
})

test('generate gives the same files when it runs again', () => {
  const { root } = repository()
  const generatedFiles = () => [LLMS, RECORD].map((path) => read(root, path))
  const before = generatedFiles()
  assert.deepEqual(generate(root), written([]))
  assert.deepEqual(generatedFiles(), before)
})

test('each rule names the file, the line and what is wrong', () => {
  const { root } = repository()
  const offending = `${VIETNAMESE} ${EM_DASH}`
  const readme = append(root, README, offending)
  const overview = append(root, OVERVIEW, `${UNKNOWN_ID} and [gone](${MISSING_LINK})`)
  write(root, PLAIN_PAGE, '# No header\n')
  write(root, MISPLACED_RECORD, recordPage('Old'))
  const expected = [
    printed(README, letterProblem(readme, offending)),
    printed(README, dashProblem(readme, offending)),
    printed(OVERVIEW, idProblem(overview, noBrdId(UNKNOWN_ID))),
    printed(OVERVIEW, linkProblem(overview, LINK_MESSAGES.missing(MISSING_LINK))),
    printed(MISPLACED_RECORD, headerProblem(1, OUTSIDE_HISTORY)),
    printed(PLAIN_PAGE, headerProblem(1, NO_HEADER)),
    stale(LLMS, GENERATE)
  ]
  assert.deepEqual([...check(root).problems].sort(), [...expected].sort())
})

test('an unknown header id is reported once', () => {
  const { root } = repository()
  write(root, UNKNOWN_IDS_PAGE, pageOf('Unknown id', { ids: [UNKNOWN_ID] }))
  generate(root)
  assert.deepEqual(check(root).problems, [printed(UNKNOWN_IDS_PAGE, idProblem(1, noBrdId(UNKNOWN_ID)))])
})

test('a generated file that differs from what its generator writes now is a problem', () => {
  const { root } = repository()
  const changed = (path) => edit(root, path, (text) => `${text}\n`)
  changed(LLMS)
  changed(IDS)
  edit(root, RECORD, (text) => text.replace('It is never current truth.', 'It is the truth.'))
  BRD_DOCS.forEach((doc) => changed(edition(doc)))
  OUTPUTS.forEach((name) => changed(wireframe(name)))
  const expected = [
    stale(LLMS, GENERATE),
    stale(IDS, `${BUILD} --ids`),
    stale(RECORD, GENERATE),
    ...BRD_DOCS.map((doc) => stale(edition(doc), `${BUILD} ${doc}`)),
    ...OUTPUTS.map((name) => stale(wireframe(name), BUILDER))
  ]
  assert.deepEqual([...check(root).problems].sort(), [...expected].sort())
})

test('a builder that fails is a problem that quotes its output', () => {
  const { root } = repository()
  write(root, join(dirname(BUILD), FAIL), BUILD_FAILED)
  write(root, join(dirname(BUILD), FAIL_IDS), IDS_FAILED)
  write(root, wireframe(FAIL), '')
  const { problems } = check(root)
  assert.deepEqual(
    problems.filter((line) => line.includes(FAILED)),
    [
      idsFailed(exited(IDS_FAILED)),
      ...BRD_DOCS.map((doc) => buildFailed(doc, exited(BUILD_FAILED))),
      printed(BUILDER, generatedProblem(1, `failed, ${exited('')}`))
    ]
  )
  // With no BRD ids known, the header id of the overview is unknown too.
  assert.ok(problems.includes(printed(OVERVIEW, idProblem(1, noBrdId(OVERVIEW_ID)))), problems.join('\n'))
})

test('a builder that fails with a long output has only the end of it quoted', () => {
  const { root } = repository()
  const output = `${'a'.repeat(QUOTE_LIMIT / 2)}${'b'.repeat(QUOTE_LIMIT)}`
  write(root, join(dirname(BUILD), FAIL), output)
  const { problems } = check(root)
  assert.deepEqual(
    problems.filter((line) => line.includes(FAILED)),
    BRD_DOCS.map((doc) => buildFailed(doc, exited('b'.repeat(QUOTE_LIMIT))))
  )
})

test('generate writes nothing when build.py --ids fails, and quotes its output', () => {
  const { root } = repository()
  write(root, join(dirname(BUILD), FAIL_IDS), IDS_FAILED)
  // Changed, so a write of llms.txt would show.
  edit(root, LLMS, (text) => `${text}\n`)
  const before = read(root, LLMS)
  assert.deepEqual(generate(root), {
    wrote: false,
    banners: 0,
    problems: [printed(BUILD, generatedProblem(1, `build.py --ids failed, ${exited(IDS_FAILED)}`))]
  })
  assert.equal(read(root, LLMS), before)
})

test('check builds the documents build.py takes: the main BRD and the onboarding addendum', () => {
  assert.deepEqual(BRD_DOCS, ['main', 'addendum-onboarding'])
})

test('check leaves no temporary file behind', () => {
  const { root } = repository()
  const scratch = tree({})
  const before = process.env.TMPDIR
  process.env.TMPDIR = scratch
  try {
    check(root)
  } finally {
    if (before === undefined) delete process.env.TMPDIR
    else process.env.TMPDIR = before
  }
  assert.deepEqual(readdirSync(scratch), [])
})

test('a builder that cannot start is a problem that gives the reason', () => {
  const { root } = repository()
  const withoutPython = (command, args, options) =>
    command === 'python3' ? { status: null, error: new Error(NO_PYTHON) } : spawn(command, args, options)
  const { problems } = check(root, withoutPython)
  assert.deepEqual(
    problems.filter((line) => line.includes(NO_PYTHON)),
    [idsFailed(NO_PYTHON), ...BRD_DOCS.map((doc) => buildFailed(doc, NO_PYTHON))]
  )
})

test('a Markdown file that is not UTF-8 is a problem, not a crash', () => {
  const { root } = repository()
  write(root, BROKEN, NOT_UTF8)
  const link = `${basename(BROKEN)}#${ANCHOR}`
  const at = append(root, OVERVIEW, `[broken](${link})`)
  assert.deepEqual(check(root).problems, [
    printed(BROKEN, headerProblem(1, NOT_TEXT)),
    printed(OVERVIEW, linkProblem(at, LINK_MESSAGES.anchor(link)))
  ])
})

test('a manifest that cannot be used is one problem: no screen is judged and no wireframe is built', () => {
  const variants = [
    [CUT_JSON, notJson(CUT_JSON)],
    [NOT_UTF8, NOT_READABLE],
    ...[JSON_NULL, '{}', '{"screens": 5}', '{"screens": [null]}'].map((text) => [text, NO_SCREENS])
  ]
  for (const [content, message] of variants) {
    const { root } = repository()
    write(root, MANIFEST_PATH, content)
    assert.deepEqual(check(root).problems, [printed(MANIFEST_PATH, idProblem(1, message))], message)
  }
  const withoutManifest = Object.fromEntries(Object.entries(FILES).filter(([path]) => path !== MANIFEST_PATH))
  const { root } = repositoryFrom(withoutManifest)
  assert.deepEqual(check(root).problems, [printed(MANIFEST_PATH, idProblem(1, NOT_READABLE))])
})

test('a records table that cannot be used is one problem: check compares nothing and generate writes nothing', () => {
  for (const [content, message] of [[CUT_JSON, notJson(CUT_JSON)], [NOT_UTF8, NOT_READABLE]]) {
    const { root } = repository()
    write(root, RECORDS, content)
    // Both files differ from what the generators write, so each would be reported if it were compared.
    edit(root, LLMS, (text) => `${text}\n`)
    edit(root, RECORD, (text) => `${text}\n`)
    const before = [LLMS, RECORD].map((path) => read(root, path))
    const problems = [printed(RECORDS, recordProblem(1, message))]
    assert.deepEqual(check(root).problems, problems, message)
    assert.deepEqual(generate(root), { wrote: false, banners: 0, problems }, message)
    assert.deepEqual([LLMS, RECORD].map((path) => read(root, path)), before, message)
  }
})

test('generate reports a record that has no entry in history/records.json', () => {
  const { root } = repository()
  write(root, NO_ENTRY, NO_ENTRY_PAGE)
  assert.deepEqual(generate(root), written([noEntry(NO_ENTRY)]))
})

// Runs a command line of tools/ the way people and CI do, as a process of its own.
const run = (script, args, options) => spawn(process.execPath, [join(import.meta.dirname, script), ...args], options)
const outcome = ({ status, stdout, stderr }) => ({ status, stdout, stderr })
// What a command line should have done: its exit status, its output and nothing on stderr.
const ends = (status, stdout) => ({ status, stdout, stderr: '' })

test('check on the command line prints each problem and a count, and exits 1 when there is one', () => {
  const { root } = repository()
  const { pages, files } = check(root)
  assert.deepEqual(outcome(run(CHECK_MJS, [root])), ends(0, cleanLine(pages, files)))
  const offending = `a ${EM_DASH} b`
  const at = append(root, README, offending)
  assert.deepEqual(
    outcome(run(CHECK_MJS, [root])),
    ends(1, `${printed(README, dashProblem(at, offending))}\ncheck: 1 problems\n`)
  )
})

test('generate on the command line prints each problem and a count, and exits 1 when there is one', () => {
  const { root } = repository()
  assert.deepEqual(outcome(run(GENERATE_MJS, [root])), ends(0, wrote(RECORD_COUNT)))
  write(root, NO_ENTRY, NO_ENTRY_PAGE)
  assert.deepEqual(outcome(run(GENERATE_MJS, [root])), ends(1, `${noEntry(NO_ENTRY)}\n${wrote(RECORD_COUNT)}`))
  write(root, RECORDS, CUT_JSON)
  const problem = printed(RECORDS, recordProblem(1, notJson(CUT_JSON)))
  assert.deepEqual(outcome(run(GENERATE_MJS, [root])), ends(1, `${problem}\n${NOTHING}`))
})

test('with no path the command lines work on the repository that holds their tools/ folder', () => {
  const { root } = repository()
  for (const name of [DOCS_MJS, CHECK_MJS, GENERATE_MJS]) {
    write(root, `${TOOLS}/${name}`, readFileSync(join(import.meta.dirname, name), 'utf8'))
  }
  const { pages, files } = check(root)
  const inRoot = (script) => outcome(spawn(process.execPath, [join(root, TOOLS, script)], { cwd: tmpdir() }))
  assert.deepEqual(inRoot(CHECK_MJS), ends(0, cleanLine(pages, files)))
  assert.deepEqual(inRoot(GENERATE_MJS), ends(0, wrote(RECORD_COUNT)))
})
