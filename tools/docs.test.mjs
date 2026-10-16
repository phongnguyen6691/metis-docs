// Tests of the checks and generators of tools/docs.mjs, run with node --test.
import assert from 'node:assert/strict'
import { test } from 'node:test'

import {
  anchorsOf,
  BANNER_END,
  BANNER_START,
  bannerOf,
  COMPONENTS,
  dashProblems,
  FENCE,
  filesOf,
  generated,
  headerOf,
  headerProblems,
  idProblems,
  isPage,
  jsonOf,
  LETTER,
  languageProblems,
  linkProblems,
  linksOf,
  LLMS,
  LLMS_NOTE,
  LLMS_SUMMARY,
  LLMS_TITLE,
  llmsOf,
  NOTATION,
  PLAIN,
  RECORDS,
  recordsOf,
  repositoryOf,
  STATUSES,
  textOf,
  TYPES,
  withBanner
} from './docs.mjs'
import {
  ACCENTED,
  CLAUDE,
  dashProblem,
  EM_DASH,
  EN_DASH,
  HEAD,
  headerText,
  idProblem,
  itemOf,
  JSON_NULL,
  LINK_MESSAGES,
  letterProblem,
  linkProblem,
  NO_ENTRY,
  NO_HEADER,
  NONE,
  noBrdId,
  noEntry,
  NOT_READABLE,
  NOT_TEXT,
  NOT_UTF8,
  notJson,
  OUTSIDE_HISTORY,
  OVERVIEW,
  PASSAGES,
  page,
  printed,
  README,
  RECORD,
  RECORD_HEAD,
  recordProblem,
  REFERENCE,
  REPLACING,
  summaryOf,
  TOOLS,
  tree,
  VIETNAMESE,
  WHOLE,
  WITH_NUL,
  WRITTEN,
  write
} from './fixtures.mjs'

// Fixture values that more than one test names, each named once.
const BODY = '# Title\n'
const HEAD_LINES = 8 // the two --- lines and the six fields of HEAD
const GENERATOR = 'tools/gen.mjs'
const NO_SUCH_FILE = 'none.md'
const GONE = 'history/plans/gone.md'
const HISTORY_PAGE = 'history/a.md'
const BUSINESS_PAGE = 'business/a.md'
const ROOT_PAGE = 'a.md'
const BROKEN = 'broken.md'
const MESSAGE_LIMIT = 100
const OPTIONAL = 'Optional' // the llms.txt section of records and replaced pages
const DRAFT_STATUS = 'draft'
const SUPERSEDED_STATUS = 'superseded'
const CODE_FENCE = '```'
const TILDE_FENCE = '~~~'
const [FIRST_ID, SECOND_ID] = HEAD.ids

const TOP_FILE = 'top.md'
const NESTED_FILE = 'a/c.md'

test('filesOf lists every file with / separators, sorted, without .git and node_modules', () => {
  const root = tree({ [TOP_FILE]: '', [NESTED_FILE]: '', '.git/HEAD': '', 'x/node_modules/y.js': '' })
  assert.deepEqual(filesOf(root), [NESTED_FILE, TOP_FILE])
})

test('textOf reads UTF-8 text and gives null for a NUL byte or bytes that are not UTF-8', () => {
  const text = `# ${ACCENTED}\n`
  assert.equal(textOf(Buffer.from(text)), text)
  assert.equal(textOf(WITH_NUL), null)
  assert.equal(textOf(NOT_UTF8), null)
})

test('a page is a Markdown file, but not a BRD part and not the root CLAUDE.md', () => {
  const cases = [
    [OVERVIEW, true],
    [`components/app/${CLAUDE}`, true],
    [CLAUDE, false],
    ['business/requirements/source/parts/01-front.md', false],
    ['business/requirements/source/addendum-onboarding/parts/02-a.md', false],
    ['business/requirements/source/README.md', true],
    ['design/wireframes/index.html', false]
  ]
  for (const [path, expected] of cases) assert.equal(isPage(path), expected, path)
})

const COLON_TITLE = 'Decision: one app'

test('headerOf reads the six fields in order and an optional generated_from', () => {
  assert.deepEqual(headerOf(page(HEAD, BODY)), { header: HEAD, lines: HEAD_LINES })
  const withSource = { ...HEAD, ids: [], generated_from: 'metis-app/src/a.ts@0a1b2c3' }
  assert.deepEqual(headerOf(page(withSource, BODY)), { header: withSource, lines: HEAD_LINES + 1 })
  const quoted = { ...HEAD, title: JSON.stringify(COLON_TITLE) }
  assert.equal(headerOf(page(quoted, BODY)).header.title, COLON_TITLE)
})

// A page whose header holds a value that is not valid for its field, and the problem named for it.
const invalid = (field, value, line) => [
  page({ ...HEAD, [field]: value }, BODY),
  `${field} is not valid: ${value}`,
  line
]

test('headerOf names the first problem and its line', () => {
  const cases = [
    [BODY, NO_HEADER, 1],
    [page({ summary: 'x', title: 'y' }, BODY), 'line 2 must hold the field title', 2],
    invalid('component', 'web', 4),
    invalid('type', 'guide', 5),
    invalid('status', 'old', 6),
    ...[COLON_TITLE, '- a list', 'a #comment', 'ends with a space '].map((title) => invalid('title', title, 2)),
    ...['Ends with:', '"unclosed', '"  "', '"4" "2"'].map((summary) => invalid('summary', summary, 3)),
    invalid('ids', `[${HEAD.ids.join(',')}]`, 7),
    [page({ ...HEAD, owner: 'me' }, BODY), 'the header must end with --- after its fields', 8]
  ]
  for (const [text, problem, line] of cases) assert.deepEqual(headerOf(text), { problem, line }, problem)
})

// The values the header allows for the three fields that take one of a list, typed here once, apart from
// docs.mjs, so that a slip in its lists shows. The values the fixtures already name are read from them.
const SPEC_VALUES = {
  component: ['app', 'core', 'mcp-gateway', 'agent', 'keycloak', 'sandbox', 'infra', HEAD.component],
  type: [
    'overview',
    'module',
    HEAD.type,
    'how-to',
    REFERENCE,
    'runbook',
    'decision',
    'incident',
    'proposal',
    RECORD_HEAD.type
  ],
  status: [HEAD.status, DRAFT_STATUS, SUPERSEDED_STATUS, RECORD_HEAD.status]
}

test('the components, types and statuses are the values the header allows, and a header takes each of them', () => {
  assert.deepEqual({ component: COMPONENTS, type: TYPES, status: STATUSES }, SPEC_VALUES)
  for (const [field, values] of Object.entries(SPEC_VALUES)) {
    for (const value of values) {
      assert.equal(headerOf(page({ ...HEAD, [field]: value }, BODY)).header?.[field], value, `${field}: ${value}`)
    }
  }
})

const IN_HISTORY = 'a page under history/ has type record and status record'
// Across repositories a page names <repository>/<path>@<commit>, the commit being 7 to 40 hexadecimal digits.
const HASH = '0123456789abcdef'.repeat(3)
const commit = (length) => HASH.slice(0, length)
const REPO_FILE = 'metis-app/a.ts'
const BARE_FILE = 'openapi.json'
const NOT_HEX = 'z'.repeat(7)

test('headerProblems keeps records in history/ and checks where generated_from points', () => {
  const exists = (path) => path === GENERATOR
  const { type, status } = RECORD_HEAD
  assert.deepEqual(headerProblems(HISTORY_PAGE, RECORD_HEAD, exists), [])
  assert.deepEqual(headerProblems(HISTORY_PAGE, HEAD, exists), [IN_HISTORY])
  assert.deepEqual(headerProblems(HISTORY_PAGE, { ...HEAD, type }, exists), [IN_HISTORY])
  assert.deepEqual(headerProblems(BUSINESS_PAGE, { ...HEAD, status }, exists), [OUTSIDE_HISTORY])
  assert.deepEqual(headerProblems(BUSINESS_PAGE, { ...HEAD, type }, exists), [OUTSIDE_HISTORY])
  const from = (generated_from) => headerProblems(ROOT_PAGE, { ...HEAD, generated_from }, exists)
  const elsewhere = `metis-backend/contract/${BARE_FILE}@${commit(16)}`
  const missing = 'tools/none.mjs'
  const refusal = (value) => [
    `generated_from names no file of this repository and no <repository>/<path>@<commit>: ${value}`
  ]
  assert.deepEqual(from(GENERATOR), [])
  for (const value of [elsewhere, `${REPO_FILE}@${commit(7)}`, `${REPO_FILE}@${commit(40)}`]) {
    assert.deepEqual(from(value), [], value)
  }
  const refused = [
    missing,
    REPO_FILE,
    `${BARE_FILE}@${commit(7)}`,
    `${REPO_FILE}@${NOT_HEX}`,
    `${REPO_FILE}@${commit(6)}`,
    `${REPO_FILE}@${commit(41)}`
  ]
  for (const value of refused) assert.deepEqual(from(value), refusal(value), value)
})

const LINKED = 'linked.md'
const IMAGE = 'img/b.png'
const SPACED = 'c d.md'
const DEFINED = 'refs/r.md'
const IN_CODE = 'x.md'
const FENCED = 'y.md'
const TILDE_FENCED = 'z.md'

test('linksOf finds links, images and definitions outside code, with their lines', () => {
  const text = [
    `[a](${LINKED}) and ![b](${IMAGE} "title") and [c](<${SPACED}>)`,
    `inline \`[x](${IN_CODE})\` is code`,
    CODE_FENCE,
    `[y](${FENCED})`,
    CODE_FENCE,
    TILDE_FENCE,
    `[z](${TILDE_FENCED})`,
    TILDE_FENCE,
    `[ref]: ${DEFINED}`
  ].join('\n')
  assert.deepEqual(linksOf(text), [
    { line: 1, target: LINKED },
    { line: 1, target: IMAGE },
    { line: 1, target: SPACED },
    { line: 9, target: DEFINED }
  ])
})

const NOTES = '## Notes' // a heading that appears twice

test('anchorsOf follows GitHub: lower case, punctuation dropped, spaces to hyphens, repeats numbered', () => {
  const text = [
    '# 3. Business Context & Problem Statement',
    '## Use `pnpm verify` ##',
    '## A [linked](x.md) heading',
    NOTES,
    NOTES,
    CODE_FENCE,
    '# not a heading',
    CODE_FENCE,
    `### ${ACCENTED} au lait_2`
  ].join('\n')
  assert.deepEqual(anchorsOf(text), [
    '3-business-context--problem-statement',
    'use-pnpm-verify',
    'a-linked-heading',
    'notes',
    'notes-1',
    `${ACCENTED.toLowerCase()}-au-lait_2`
  ])
})

const LINK_FOLDER = 'guides'
const LINK_PAGE = `${LINK_FOLDER}/index.md`
const SIBLING = 'sibling.md'
const SIBLING_HEADING = 'Tokens'
const PICTURE = 'picture.png'
const ABOVE = 'above.md'
const UP = '../'
const OUTSIDE = '../../x.md'
const BAD_ESCAPE = '%E0%A4%A'
const ANCHOR = 'top'

test('linkProblems reports missing files, links out of the repository, bad anchors and bad addresses', () => {
  const pages = {
    [`${LINK_FOLDER}/${SIBLING}`]: `# Top\n## ${SIBLING_HEADING}\n`,
    [`${LINK_FOLDER}/${BROKEN}`]: null
  }
  const known = new Set([LINK_PAGE, LINK_FOLDER, `${LINK_FOLDER}/${PICTURE}`, ABOVE, ...Object.keys(pages)])
  const context = { exists: (path) => known.has(path), readPage: (path) => pages[path] }
  // Each link with how linkProblems words its problem, or null when it is fine.
  const links = [
    [`${SIBLING}#${SIBLING_HEADING.toLowerCase()}`, null],
    ['https://x.test/a', null],
    ['mailto:a@x.test', null],
    ['//x.test', null],
    [`${UP}${ABOVE}`, null],
    [`/${LINK_FOLDER}/${PICTURE}`, null],
    [`${UP}${LINK_FOLDER}`, null],
    [`${UP}${LINK_FOLDER}/`, null],
    ['#mine', null],
    [`${PICTURE}#x`, null],
    ['#nothing', LINK_MESSAGES.anchor],
    [NO_SUCH_FILE, LINK_MESSAGES.missing],
    [OUTSIDE, LINK_MESSAGES.outside],
    [`${SIBLING}#colours`, LINK_MESSAGES.anchor],
    [`${BAD_ESCAPE}.md`, LINK_MESSAGES.address],
    [`${SIBLING}#${BAD_ESCAPE}`, LINK_MESSAGES.address],
    [`${BROKEN}#${ANCHOR}`, LINK_MESSAGES.anchor]
  ]
  const text = [...links.map(([target]) => `[link](${target})`), '# Mine'].join('\n')
  const expected = links.flatMap(([target, wording], i) => (wording === null ? [] : [linkProblem(i + 1, wording(target))]))
  assert.deepEqual(linkProblems(LINK_PAGE, text, context), expected)
  const top = '..'
  assert.deepEqual(linkProblems(ROOT_PAGE, `[top](${top})`, context), [linkProblem(1, LINK_MESSAGES.outside(top))])
})

test('languageProblems flags letters outside ASCII, composed or not, except after a lang-exception', () => {
  assert.deepEqual(languageProblems(`ok\n${VIETNAMESE}\n`), [letterProblem(2, VIETNAMESE)])
  assert.deepEqual(languageProblems(VIETNAMESE.normalize('NFD')), [letterProblem(1, VIETNAMESE)])
  const excused = `<!-- lang-exception: a sample -->\n${ACCENTED}\n${ACCENTED}`
  assert.deepEqual(languageProblems(excused), [letterProblem(3, ACCENTED)])
  assert.deepEqual(languageProblems('arrows \u2192 and dots \u00b7 are no letters'), [])
})

test('languageProblems shows the line without its outer spaces, cut at the message limit', () => {
  assert.deepEqual(languageProblems(`  ${ACCENTED}  `), [letterProblem(1, ACCENTED)])
  const long = `${ACCENTED} ${'x'.repeat(MESSAGE_LIMIT)}`
  assert.deepEqual(languageProblems(long), [letterProblem(1, long.slice(0, MESSAGE_LIMIT))])
})

const EM_LINE = `a ${EM_DASH} b`
const EN_LINE = `1${EN_DASH}2`

test('dashProblems flags every line with an em dash or an en dash', () => {
  assert.deepEqual(dashProblems(`${EM_LINE}\nc - d\n${EN_LINE}`), [dashProblem(1, EM_LINE), dashProblem(3, EN_LINE)])
})

test('dashProblems shows the line without its outer spaces, cut at the message limit', () => {
  assert.deepEqual(dashProblems(`  ${EM_DASH}  `), [dashProblem(1, EM_DASH)])
  const long = `${EN_DASH} ${'x'.repeat(MESSAGE_LIMIT)}`
  assert.deepEqual(dashProblems(long), [dashProblem(1, long.slice(0, MESSAGE_LIMIT))])
})

const THIRD_ID = 'D-19'
const UNKNOWN_HEADER_ID = 'CHG-99'
const UNKNOWN_TEXT_ID = 'CHG-02'
// Not ids: RD-01 only ends like an id of the prefix D, and D-1 has one digit.
const LONGER_PREFIX = 'RD-01'
const ONE_DIGIT = 'D-1'
const KNOWN_SCREEN = 24
const [MISSING_SCREEN, OTHER_MISSING_SCREEN] = [25, 3]

test('idProblems checks header ids, ids named in the text and screen numbers', () => {
  const known = { brd: new Set([...HEAD.ids, THIRD_ID]), screens: new Set([KNOWN_SCREEN]) }
  const header = { ...HEAD, ids: [FIRST_ID, UNKNOWN_HEADER_ID] }
  const body = [
    `${UNKNOWN_TEXT_ID} and ${SECOND_ID} and ${LONGER_PREFIX} and ${ONE_DIGIT}`,
    `Screen ${KNOWN_SCREEN}, screens ${MISSING_SCREEN} and screen ${OTHER_MISSING_SCREEN}`
  ].join('\n')
  // The page is the header, a blank line and the body, so the body starts on the line after them.
  const text = page(header, body)
  const bodyLine = HEAD_LINES + 2
  const noScreen = (number) => idProblem(bodyLine + 1, `screen ${number} is not in the wireframe manifest`)
  const textIds = [idProblem(bodyLine, noBrdId(UNKNOWN_TEXT_ID))]
  const headerOnly = [idProblem(1, noBrdId(UNKNOWN_HEADER_ID))]
  // The ids line of the header names the unknown id again, and is not searched.
  assert.deepEqual(idProblems(OVERVIEW, text, header, known, HEAD_LINES), [
    ...headerOnly,
    ...textIds,
    noScreen(MISSING_SCREEN),
    noScreen(OTHER_MISSING_SCREEN)
  ])
  assert.deepEqual(idProblems(RECORD, text, header, known, HEAD_LINES), headerOnly)
  const withSource = { ...header, generated_from: GENERATOR }
  assert.deepEqual(idProblems(OVERVIEW, text, withSource, known, HEAD_LINES), headerOnly)
  const empty = { brd: new Set(), screens: new Set() }
  assert.deepEqual(idProblems(OVERVIEW, text, { ...HEAD, ids: [] }, empty, HEAD_LINES), [])
  // A line directly under the header, with no blank line between, is part of the text.
  const crowded = `${headerText(header)}\n${UNKNOWN_TEXT_ID}`
  assert.deepEqual(idProblems(OVERVIEW, crowded, header, known, HEAD_LINES), [
    ...headerOnly,
    idProblem(HEAD_LINES + 1, noBrdId(UNKNOWN_TEXT_ID))
  ])
  // With no manifest to read, screen numbers are not judged.
  const noManifest = { brd: known.brd, screens: null }
  assert.deepEqual(idProblems(OVERVIEW, text, header, noManifest, HEAD_LINES), [...headerOnly, ...textIds])
})

const SUPERSEDED = 'architecture/decisions/old.md'
const DRAFT = 'architecture/overview.md'
// The folders that come before all others in llms.txt, in their order, and two others whose names sort
// the other way round from their paths: 'alpha-two/p.md' sorts before 'alpha/p.md'.
const FIXED_SECTIONS = ['business', 'design', 'architecture', 'components', 'operations', 'proposals', TOOLS]
const DRAFT_FOLDER = DRAFT.split('/')[0]
const OTHER_FOLDERS = ['alpha', 'alpha-two', 'zeta']
const inFolder = (folder) => `${folder}/p.md`

test('llmsOf writes one section per top folder, drafts marked, records and replaced pages under Optional', () => {
  const at = (path, status = HEAD.status) => ({
    path,
    header: { ...HEAD, title: path, summary: summaryOf(path), status }
  })
  // Handed over in descending path order, the opposite of the order llmsOf writes them in.
  const pages = [
    at(RECORD, RECORD_HEAD.status),
    ...OTHER_FOLDERS.map((folder) => at(inFolder(folder))),
    ...FIXED_SECTIONS.map((folder) => at(inFolder(folder))),
    at(README),
    at(SUPERSEDED, SUPERSEDED_STATUS),
    at(DRAFT, DRAFT_STATUS)
  ].sort((a, b) => (a.path < b.path) - (a.path > b.path))
  const line = (path, note = summaryOf(path)) => itemOf(path, path, note)
  const section = (name, ...lines) => `## ${name}\n\n${lines.join('\n')}\n`
  const draft = line(DRAFT, `Draft. ${summaryOf(DRAFT)}`)
  assert.equal(
    llmsOf(pages),
    [
      LLMS_TITLE,
      '',
      LLMS_SUMMARY,
      '',
      LLMS_NOTE,
      '',
      section('Start', line(README)),
      ...FIXED_SECTIONS.map((folder) =>
        folder === DRAFT_FOLDER
          ? section(folder, draft, line(inFolder(folder)))
          : section(folder, line(inFolder(folder)))
      ),
      ...OTHER_FOLDERS.map((folder) => section(folder, line(inFolder(folder)))),
      section(OPTIONAL, line(SUPERSEDED), line(RECORD))
    ].join('\n')
  )
})

test('llms.txt opens with a title, a one-paragraph summary and a note', () => {
  const [title, afterTitle, summary, afterSummary, note, end] = llmsOf([]).split('\n')
  assert.match(title, /^# \S/)
  assert.match(summary, /^> \S.*\.$/)
  assert.match(note, /^\S.*\.$/)
  // The two pointers the note exists for: the file to read first, and the section that is never current.
  assert.ok(note.includes('AGENTS.md') && note.includes(OPTIONAL), note)
  assert.deepEqual([afterTitle, afterSummary, end], ['', '', ''])
})

const titleOf = (path) => `Title of ${path}`
const TWO_UP = '../../' // from history/plans/ to the root

test('bannerOf says when a record was written, what replaced it and where a translated original is', () => {
  const translated = { written: WRITTEN, replacedBy: [REPLACING], translation: WHOLE }
  assert.equal(
    bannerOf(RECORD, translated, titleOf),
    [
      BANNER_START,
      `> **Record, written 5 Oct 2026.** It is never current truth. Replaced by [${titleOf(REPLACING)}](${TWO_UP}${REPLACING}). This is a machine translation of a Vietnamese record; the original is kept in the owner's private store.${NOTATION}`,
      BANNER_END
    ].join('\n')
  )
  const alone = { written: '2026-01-31', replacedBy: [], translation: NONE }
  assert.equal(
    bannerOf(HISTORY_PAGE, alone, titleOf).split('\n')[1],
    '> **Record, written 31 Jan 2026.** It is never current truth. No current page replaces it.'
  )
  const passages = { ...alone, translation: PASSAGES }
  assert.match(bannerOf(HISTORY_PAGE, passages, titleOf), /Its Vietnamese passages are machine translations;/)
  // Both kinds of translation end their sentence with the notation; a record that is not translated has none.
  const sentenceOf = (record) => bannerOf(HISTORY_PAGE, record, titleOf).split('\n')[1]
  assert.ok(sentenceOf(translated).endsWith(NOTATION))
  assert.ok(sentenceOf(passages).endsWith(NOTATION))
  assert.ok(!sentenceOf(alone).includes(NOTATION))
})

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

test('bannerOf writes the day, the name of the month and the year of the date a record was written', () => {
  MONTHS.forEach((name, i) => {
    const written = `2026-${String(i + 1).padStart(2, '0')}-05`
    const banner = bannerOf(RECORD, { written, replacedBy: [], translation: NONE }, titleOf)
    assert.ok(banner.includes(`Record, written 5 ${name} 2026.`), banner)
  })
})

test('the banner is held between two different HTML comments', () => {
  assert.match(BANNER_START, /^<!-- .+ -->$/)
  assert.match(BANNER_END, /^<!-- .+ -->$/)
  assert.notEqual(BANNER_START, BANNER_END)
})

// A banner as bannerOf makes it: its text between the two marker lines.
const bannerWith = (text) => [BANNER_START, text, BANNER_END].join('\n')
const [BANNER_ONE, BANNER_TWO, BANNER_THREE] = ['banner one', 'banner two', 'banner three'].map(bannerWith)

test('withBanner puts the banner after the header and replaces an older one', () => {
  const body = '# Body\n'
  const text = page(HEAD, `\n\n${body}`)
  const once = withBanner(text, HEAD_LINES, BANNER_ONE)
  assert.equal(once, `${headerText(HEAD)}\n\n${BANNER_ONE}\n\n${body}`)
  assert.equal(withBanner(once, HEAD_LINES, BANNER_ONE), once)
  assert.equal(withBanner(once, HEAD_LINES, BANNER_TWO), `${headerText(HEAD)}\n\n${BANNER_TWO}\n\n${body}`)
  const touching = `${headerText(HEAD)}\n\n${BANNER_ONE}\n${body}`
  assert.equal(withBanner(touching, HEAD_LINES, BANNER_TWO), `${headerText(HEAD)}\n\n${BANNER_TWO}\n\n${body}`)
  const broken = `${headerText(HEAD)}\n${BANNER_START}\n${body}`
  assert.equal(withBanner(broken, HEAD_LINES, BANNER_THREE), `${headerText(HEAD)}\n\n${BANNER_THREE}\n\n${body}`)
})

const BARE = 'bare.md'
const BINARY = 'c/e/d.png'
const DEEP_FOLDER = 'c/e'
const SHALLOW_FOLDER = 'c'
const ABSENT = 'f'
const CHANGED = 'changed on disk\n'

test('repositoryOf reads pages with their headers and gives null for a missing file', () => {
  const root = tree({
    [ROOT_PAGE]: page(HEAD, BODY),
    [BARE]: BODY,
    [BROKEN]: NOT_UTF8,
    [BINARY]: WITH_NUL
  })
  const repo = repositoryOf(root)
  assert.deepEqual(repo.files, [ROOT_PAGE, BARE, BROKEN, BINARY])
  assert.equal(repo.exists(SHALLOW_FOLDER), true)
  assert.equal(repo.exists(DEEP_FOLDER), true)
  assert.equal(repo.exists(ABSENT), false)
  assert.equal(repo.read(BINARY), null)
  assert.equal(repo.read(NO_SUCH_FILE), null)
  assert.deepEqual(
    repo.pages.map(({ path, header, problem }) => [path, header?.title, problem]),
    [
      [ROOT_PAGE, HEAD.title, undefined],
      [BARE, undefined, NO_HEADER],
      [BROKEN, undefined, NOT_TEXT]
    ]
  )
  assert.deepEqual(repo.pages[2], { path: BROKEN, text: null, problem: NOT_TEXT, line: 1 })
})

test('repositoryOf reads a file once: a change on disk is not seen by the same repository', () => {
  const root = tree({ [ROOT_PAGE]: page(HEAD, BODY) })
  const repo = repositoryOf(root)
  const first = repo.read(ROOT_PAGE)
  write(root, ROOT_PAGE, CHANGED)
  assert.equal(repo.read(ROOT_PAGE), first)
  assert.equal(repositoryOf(root).read(ROOT_PAGE), CHANGED)
})

const REPLACING_TITLE = 'Develop the app'
const UNKNOWN_TRANSLATION = 'french'
const HISTORY_BROKEN = 'history/plans/broken.md'

// A repository whose table and pages disagree in the ways recordsOf reports.
const disagreeing = () =>
  tree({
    [REPLACING]: page({ ...HEAD, title: REPLACING_TITLE }, BODY),
    [RECORD]: page(RECORD_HEAD, BODY),
    [NO_ENTRY]: page(RECORD_HEAD, BODY),
    [HISTORY_BROKEN]: NOT_UTF8,
    [RECORDS]: JSON.stringify({
      [RECORD]: { written: WRITTEN, replacedBy: [REPLACING, NO_SUCH_FILE], translation: NONE },
      [GONE]: { written: WRITTEN, replacedBy: [NO_ENTRY], translation: UNKNOWN_TRANSLATION }
    })
  })

// A problem of history/records.json as recordsOf words it, and the two ways a page can fail to be the
// current page that replaced a record.
const found = (message) => printed(RECORDS, recordProblem(1, message))
const replacedLine = (path, target, which) => found(`${path} is replaced by ${target}, which ${which}`)
const noCurrentPage = (path, target) => replacedLine(path, target, 'is no current page')
const notCurrent = (path, target, status) => replacedLine(path, target, `has status ${status}, not current`)
const wrongTranslation = (path, value) => `${path} has translation ${value}, not whole, passages or none`

test('recordsOf builds each banner from the table and reports where table and pages disagree', () => {
  const { expected, problems } = recordsOf(repositoryOf(disagreeing()))
  assert.deepEqual([...expected.keys()], [RECORD])
  // A replacing page that does not exist keeps its path as its title, and is reported.
  const replacedBy = `[${REPLACING_TITLE}](${TWO_UP}${REPLACING}), [${NO_SUCH_FILE}](${TWO_UP}${NO_SUCH_FILE})`
  assert.ok(expected.get(RECORD).includes(`Replaced by ${replacedBy}.`), expected.get(RECORD))
  assert.deepEqual(problems, [
    noEntry(NO_ENTRY),
    noCurrentPage(RECORD, NO_SUCH_FILE),
    found(`${GONE} is no record page`),
    found(wrongTranslation(GONE, UNKNOWN_TRANSLATION)),
    notCurrent(GONE, NO_ENTRY, RECORD_HEAD.status)
  ])
  const plain = repositoryOf(tree({ [ROOT_PAGE]: page(HEAD, BODY) }))
  assert.deepEqual(recordsOf(plain), { expected: new Map(), problems: [] })
})

// An entry of history/records.json that is right, and entries with one thing wrong each, with how
// recordsOf words what is wrong.
const GOOD_ENTRY = { written: WRITTEN, replacedBy: [REPLACING], translation: NONE }
const BAD_DATE = '9 Oct 2026'
const NO_SUCH_MONTH = '2026-13-01'
const NO_SUCH_DAY = '2026-02-31'
const NUMBER = 20261005
const entryWith = (fields) => ({ ...GOOD_ENTRY, ...fields })
// An entry with one thing wrong, and how recordsOf words it for the entry at a path.
const notAnEntry = (value) => [
  value,
  (path) => `${path} is not an object with written, replacedBy and translation`
]
const badWritten = (value) => [
  entryWith({ written: value }),
  (path) => `${path} has written ${value}, not a date YYYY-MM-DD`
]
const badList = (value) => [
  entryWith({ replacedBy: value }),
  (path) => `${path} has a replacedBy that is not a list of page paths`
]
const badTranslation = (value) => [entryWith({ translation: value }), (path) => wrongTranslation(path, value)]
const BAD_ENTRIES = [
  ...[null, [], NUMBER, NO_SUCH_FILE].map(notAnEntry),
  ...[BAD_DATE, NO_SUCH_MONTH, NO_SUCH_DAY, NUMBER, undefined].map(badWritten),
  ...[undefined, REPLACING, [NUMBER]].map(badList),
  ...[UNKNOWN_TRANSLATION, undefined].map(badTranslation)
]
const badPath = (i) => `history/plans/bad-${i}.md`
const GOOD_PATH = 'history/plans/good.md'

test('recordsOf reports each entry that cannot make a banner, and makes none from it', () => {
  const root = tree({
    [REPLACING]: page(HEAD, BODY),
    [GOOD_PATH]: page(RECORD_HEAD, BODY),
    ...Object.fromEntries(BAD_ENTRIES.map((_, i) => [badPath(i), page(RECORD_HEAD, BODY)])),
    [RECORDS]: JSON.stringify({
      ...Object.fromEntries(BAD_ENTRIES.map(([entry], i) => [badPath(i), entry])),
      // A record the owner voided has no page that replaced it, and still has its banner.
      [GOOD_PATH]: entryWith({ replacedBy: [] })
    })
  })
  const { expected, problems } = recordsOf(repositoryOf(root))
  assert.deepEqual([...expected.keys()], [GOOD_PATH])
  assert.deepEqual(problems, BAD_ENTRIES.map(([, wording], i) => found(wording(badPath(i)))))
})

test('recordsOf wants each page that replaced a record to be current, and names the status when it is not', () => {
  const root = tree({
    [REPLACING]: page(HEAD, BODY),
    [SUPERSEDED]: page({ ...HEAD, status: SUPERSEDED_STATUS }, BODY),
    [DRAFT]: page({ ...HEAD, status: DRAFT_STATUS }, BODY),
    [RECORD]: page(RECORD_HEAD, BODY),
    [HISTORY_PAGE]: page(RECORD_HEAD, BODY),
    [RECORDS]: JSON.stringify({
      [RECORD]: entryWith({ replacedBy: [REPLACING, SUPERSEDED, DRAFT, HISTORY_PAGE, NO_SUCH_FILE] }),
      [HISTORY_PAGE]: GOOD_ENTRY
    })
  })
  const { expected, problems } = recordsOf(repositoryOf(root))
  // The banner is still made: the problem is what keeps the tree from passing.
  assert.deepEqual([...expected.keys()], [HISTORY_PAGE, RECORD])
  assert.deepEqual(problems, [
    notCurrent(RECORD, SUPERSEDED, SUPERSEDED_STATUS),
    notCurrent(RECORD, DRAFT, DRAFT_STATUS),
    notCurrent(RECORD, HISTORY_PAGE, RECORD_HEAD.status),
    noCurrentPage(RECORD, NO_SUCH_FILE)
  ])
})

const DATA_FILE = 'data/valid.json'
const DATA = { a: 1 }
const CUT_DATA = '{"a":1,'
const CUT_FILE = 'data/cut.json'
const BINARY_FILE = 'data/binary.json'

test('jsonOf gives the value of a JSON file, or why the file cannot be used', () => {
  const root = tree({ [DATA_FILE]: JSON.stringify(DATA), [CUT_FILE]: CUT_DATA, [BINARY_FILE]: NOT_UTF8 })
  const { read } = repositoryOf(root)
  assert.deepEqual(jsonOf(read, DATA_FILE), { value: DATA })
  assert.deepEqual(jsonOf(read, CUT_FILE), { problem: notJson(CUT_DATA) })
  assert.deepEqual(jsonOf(read, BINARY_FILE), { problem: NOT_READABLE })
  assert.deepEqual(jsonOf(read, NO_SUCH_FILE), { problem: NOT_READABLE })
})

const NOT_A_TABLE = 'is not an object with one entry per record page'
// Contents of history/records.json that no banner can be made from, and the problem each gives.
const UNUSABLE_TABLES = [
  [CUT_DATA, notJson(CUT_DATA)],
  [NOT_UTF8, NOT_READABLE],
  ...[JSON_NULL, '[]', '5', JSON.stringify(NO_SUCH_FILE)].map((text) => [text, NOT_A_TABLE])
]

test('recordsOf and generated make no banner and no file from a table that cannot be read', () => {
  for (const [content, message] of UNUSABLE_TABLES) {
    const repo = repositoryOf(tree({ [RECORD]: page(RECORD_HEAD, BODY), [RECORDS]: content }))
    const problems = [printed(RECORDS, recordProblem(1, message))]
    assert.deepEqual(recordsOf(repo), { expected: null, problems }, message)
    assert.deepEqual(generated(repo), { files: new Map(), banners: 0, problems }, message)
  }
})

test('generated gives llms.txt and the banner of every record, with the problems of the table', () => {
  const repo = repositoryOf(disagreeing())
  const { files, banners, problems } = generated(repo)
  const { expected } = recordsOf(repo)
  assert.deepEqual([...files.keys()], [LLMS, RECORD])
  assert.equal(files.get(RECORD), expected.get(RECORD))
  assert.equal(banners, expected.size)
  assert.deepEqual(problems, recordsOf(repo).problems)
  const small = repositoryOf(tree({ [README]: page(HEAD, BODY), [RECORD]: page(RECORD_HEAD, BODY) }))
  assert.equal(
    generated(small).files.get(LLMS),
    [
      `${LLMS_TITLE}\n\n${LLMS_SUMMARY}\n\n${LLMS_NOTE}\n`,
      `## Start\n\n${itemOf(HEAD.title, README, HEAD.summary)}\n`,
      `## ${OPTIONAL}\n\n${itemOf(RECORD_HEAD.title, RECORD, RECORD_HEAD.summary)}\n`
    ].join('\n')
  )
})

test('the letter, fence and plain-text expressions are exported for the migration tools', () => {
  assert.equal(LETTER.test(ACCENTED), true)
  assert.equal(LETTER.test('plain ASCII 123'), false)
  assert.equal(FENCE.test(`  ${CODE_FENCE}js`), true)
  assert.equal(FENCE.test(TILDE_FENCE), true)
  assert.equal(FENCE.test(`code ${CODE_FENCE} inline`), false)
  assert.equal(PLAIN.test(HEAD.title), true)
  assert.equal(PLAIN.test(COLON_TITLE), false)
})
