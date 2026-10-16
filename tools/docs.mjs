// The checks every pull request of metis-docs runs, and the generators of llms.txt and the record
// banners. tools/check.mjs and tools/generate.mjs run them over the repository.
import { readdirSync, readFileSync } from 'node:fs'
import { join, posix, relative, sep } from 'node:path'

export const COMPONENTS = ['app', 'core', 'mcp-gateway', 'agent', 'keycloak', 'sandbox', 'infra', 'all']
export const TYPES = [
  'overview',
  'module',
  'journey',
  'how-to',
  'reference',
  'runbook',
  'decision',
  'incident',
  'proposal',
  'record'
]
export const STATUSES = ['current', 'draft', 'superseded', 'record']
const FIELDS = ['title', 'summary', 'component', 'type', 'status', 'ids']
const CHOICES = { component: COMPONENTS, type: TYPES, status: STATUSES }
const SKIP_DIRS = new Set(['.git', 'node_modules'])

// Every file under root, as sorted paths with / separators.
export function filesOf(root) {
  return readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => relative(root, join(entry.parentPath, entry.name)).split(sep).join('/'))
    .filter((path) => !path.split('/').some((part) => SKIP_DIRS.has(part)))
    .sort()
}

const UTF8 = new TextDecoder('utf-8', { fatal: true })
// The text of a file, or null for a binary one: a NUL byte, or bytes that are not UTF-8.
export function textOf(bytes) {
  if (bytes.includes(0)) return null
  try {
    return UTF8.decode(bytes)
  } catch {
    return null
  }
}

// A page is a Markdown file, but the BRD parts are fragments of the generated BRD, and CLAUDE.md is the
// one import line that hands Claude Code to AGENTS.md.
export const isPage = (path) =>
  path.endsWith('.md') &&
  path !== 'CLAUDE.md' &&
  !/^business\/requirements\/source\/(?:.+\/)?parts\//.test(path)

// Plain YAML text that stays valid YAML: no indicator first, no ": " or " #" inside, no ":" last. The
// migration tools write a value as a JSON string when it is not plain.
export const PLAIN = /^(?![-?:,[\]{}#&*!|>'"%@`])(?!.*(?:: | #))(?!.*:$)\S(?:.*\S)?$/
const ID_LIST = /^\[(?:[A-Za-z0-9][\w.-]*(?:, [A-Za-z0-9][\w.-]*)*)?\]$/
// A page generated in another repository names <repository>/<path>@<commit>: the repository part is
// required, and the commit is 7 to 40 hexadecimal digits.
const OTHER_REPOSITORY = /^[\w.-]+\/[^@\s]+@[0-9a-f]{7,40}$/

// The value of a text field: plain text, or a JSON string in double quotes for text with a colon.
const textValue = (raw) => {
  if (!raw.startsWith('"')) return PLAIN.test(raw) ? raw : null
  try {
    const value = JSON.parse(raw)
    return typeof value === 'string' && value.trim() ? value : null
  } catch {
    return null
  }
}

const valueOf = (field, raw) => {
  if (CHOICES[field]) return CHOICES[field].includes(raw) ? raw : null
  if (field === 'ids') return ID_LIST.test(raw) ? raw.slice(1, -1).split(', ').filter(Boolean) : null
  return textValue(raw)
}

// The header of a page: its fields in order, between two --- lines; generated_from may follow ids.
export function headerOf(text) {
  const lines = text.split('\n')
  if (lines[0] !== '---') return { problem: 'no header: the first line must be ---', line: 1 }
  const header = {}
  const names = [...FIELDS, 'generated_from']
  let at = 1
  for (const name of names) {
    const match = lines[at]?.match(/^([a-z_]+): (.+)$/)
    if (name === 'generated_from' && match?.[1] !== name) break
    if (match?.[1] !== name) return { problem: `line ${at + 1} must hold the field ${name}`, line: at + 1 }
    const value = valueOf(name, match[2])
    if (value === null) return { problem: `${name} is not valid: ${match[2]}`, line: at + 1 }
    header[name] = value
    at += 1
  }
  if (lines[at] !== '---') return { problem: 'the header must end with --- after its fields', line: at + 1 }
  return { header, lines: at + 1 }
}

// The rules a header must keep beyond its own syntax.
export function headerProblems(path, header, exists) {
  const problems = []
  const inHistory = path.startsWith('history/')
  const record = header.type === 'record' || header.status === 'record'
  if (inHistory && !(header.type === 'record' && header.status === 'record')) {
    problems.push('a page under history/ has type record and status record')
  }
  if (!inHistory && record) problems.push('only a page under history/ is a record')
  const from = header.generated_from
  if (from !== undefined && !OTHER_REPOSITORY.test(from) && !exists(from)) {
    problems.push(`generated_from names no file of this repository and no <repository>/<path>@<commit>: ${from}`)
  }
  return problems
}

// The opening and closing line of a fenced code block; the migration tools read code the same way.
export const FENCE = /^\s*(```|~~~)/
// The lines of a text outside fenced code blocks, as [line number, text] pairs.
const proseOf = (text) => {
  let fenced = false
  return text.split('\n').flatMap((line, i) => {
    if (FENCE.test(line)) {
      fenced = !fenced
      return []
    }
    return fenced ? [] : [[i + 1, line]]
  })
}

const INLINE_CODE = /`+[^`]*`+/g
const LINK = /!?\[[^\]]*\]\(\s*(?:<([^>\n]+)>|([^)\s]+))(?:\s+"[^"]*")?\s*\)/g
const DEFINITION = /^\s{0,3}\[[^\]]+\]:\s*<?([^\s>]+)>?/

// The link and image targets of a Markdown page outside code, each with its line.
export function linksOf(text) {
  return proseOf(text).flatMap(([line, raw]) => {
    const prose = raw.replace(INLINE_CODE, '')
    const targets = [...prose.matchAll(LINK)].map((match) => match[1] ?? match[2])
    const definition = prose.match(DEFINITION)
    if (definition) targets.push(definition[1])
    return targets.map((target) => ({ line, target }))
  })
}

// GitHub's anchor of each heading: lower case; letters, digits, spaces, hyphens and underscores kept;
// each space a hyphen; a repeated anchor numbered -1, -2.
export function anchorsOf(text) {
  const seen = new Map()
  return proseOf(text).flatMap(([, line]) => {
    const heading = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/)
    if (!heading) return []
    const words = heading[1]
      .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
      .replace(/<[^>]+>/g, '')
      .toLowerCase()
      .replace(/[^\p{L}\p{N}\p{M}_ -]/gu, '')
      .replace(/ /g, '-')
    const count = seen.get(words) ?? 0
    seen.set(words, count + 1)
    return [count === 0 ? words : `${words}-${count}`]
  })
}

const SCHEME = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i
const decoded = (text, decode) => {
  try {
    return decode(text)
  } catch {
    return null
  }
}

// Each link of a page whose file does not exist, leaves the repository, or names a missing heading.
// exists(path) and readPage(path) see the repository; a folder exists when it holds a file.
export function linkProblems(path, text, { exists, readPage }) {
  return linksOf(text).flatMap(({ line, target }) => {
    if (SCHEME.test(target)) return []
    const [file, fragment = ''] = target.split('#')
    const named = decoded(file, decodeURI)
    const anchor = decoded(fragment, decodeURIComponent)
    if (named === null || anchor === null) {
      return [{ line, rule: 'link', message: `${target} is not a valid address` }]
    }
    // A folder link may end with a slash; the folder is what must exist.
    const resolved = file
      ? posix
          .normalize(named.startsWith('/') ? named.slice(1) : posix.join(posix.dirname(path), named))
          .replace(/(.)\/$/, '$1')
      : path
    if (resolved === '..' || resolved.startsWith('../')) {
      return [{ line, rule: 'link', message: `${target} leaves the repository` }]
    }
    if (!exists(resolved)) return [{ line, rule: 'link', message: `${target}: no such file` }]
    if (!fragment || !resolved.endsWith('.md')) return []
    // A Markdown file that is not UTF-8 has no readable headings.
    const anchors = anchorsOf(resolved === path ? text : (readPage(resolved) ?? ''))
    return anchors.includes(anchor)
      ? []
      : [{ line, rule: 'link', message: `${target}: no heading with the anchor #${anchor}` }]
  })
}

// A letter outside ASCII, which the migration tools look for in the same way.
export const LETTER = /(?![\x00-\x7F])\p{L}/u
// English only, with the method of the app's check-language.mjs: a letter outside ASCII is a problem,
// except on the line after one that holds lang-exception: and a reason.
export function languageProblems(text) {
  const lines = text.normalize('NFC').split('\n')
  return lines.flatMap((line, i) => {
    const excused = i > 0 && lines[i - 1].includes('lang-exception:')
    return !excused && LETTER.test(line)
      ? [{ line: i + 1, rule: 'non-ascii-letter', message: line.trim().slice(0, 100) }]
      : []
  })
}

// No em dash and no en dash anywhere.
export function dashProblems(text) {
  return text.split('\n').flatMap((line, i) =>
    /[\u2013\u2014]/.test(line)
      ? [{ line: i + 1, rule: 'dash', message: line.trim().slice(0, 100) }]
      : []
  )
}

// Each id a page names that the BRD does not define, and each screen number the manifest lacks. The
// header ids are BRD ids, each reported once, at line 1; the search of the text starts after the
// headerLines lines of the header. screens is null when the manifest could not be read, and then screen
// numbers are not judged. Records and generated pages are not searched for ids in their text: a record
// may name an id of an older BRD, and a generator checks its own output.
export function idProblems(path, text, header, { brd, screens }, headerLines) {
  const unknown = header.ids.filter((id) => !brd.has(id))
  const problems = unknown.map((id) => ({ line: 1, rule: 'id', message: `${id} is no BRD id` }))
  if (path.startsWith('history/') || header.generated_from !== undefined || brd.size === 0) {
    return problems
  }
  // The order of the alternatives cannot change a match: each one must be followed by a hyphen.
  const prefixes = [...new Set([...brd].map((id) => id.split('-')[0]))].join('|')
  const named = new RegExp(`\\b(?:${prefixes})-\\d{2}\\b`, 'g')
  text.split('\n').forEach((line, i) => {
    if (i < headerLines) return
    for (const [id] of line.matchAll(named)) {
      if (!brd.has(id)) problems.push({ line: i + 1, rule: 'id', message: `${id} is no BRD id` })
    }
    for (const [, number] of line.matchAll(/\b[Ss]creens? (\d{1,3})\b/g)) {
      if (screens !== null && !screens.has(Number(number))) {
        problems.push({ line: i + 1, rule: 'id', message: `screen ${number} is not in the wireframe manifest` })
      }
    }
  })
  return problems
}

// The order of the sections of llms.txt; other top folders follow in name order.
const SECTIONS = ['business', 'design', 'architecture', 'components', 'operations', 'proposals', 'tools']
export const LLMS = 'llms.txt'
export const LLMS_TITLE = '# Metis documentation'
export const LLMS_SUMMARY =
  '> The single source of truth about Metis for the team building it and its AI agents: what the ' +
  'product does today and for whom, its design, its architecture, each component, and how to run it.'
export const LLMS_NOTE =
  'Generated from the page headers by tools/generate.mjs; never edit it by hand. Read AGENTS.md first. ' +
  'A draft page describes a part that is planned, not built. The Optional section lists records and ' +
  'replaced pages, which are never current truth.'

// llms.txt in the llmstxt.org format: one section per top folder, records and replaced pages under Optional.
export function llmsOf(pages) {
  const item = ({ path, header }) => {
    const note = header.status === 'draft' ? `Draft. ${header.summary}` : header.summary
    return `- [${header.title}](${path}): ${note}`
  }
  const optional = (page) => page.path.startsWith('history/') || page.header.status === 'superseded'
  const sectionOf = (path) => (path.includes('/') ? path.split('/')[0] : 'Start')
  const groups = new Map()
  // Code point order, the same on every machine.
  for (const page of [...pages].sort((a, b) => (a.path > b.path) - (a.path < b.path))) {
    const name = optional(page) ? 'Optional' : sectionOf(page.path)
    groups.set(name, [...(groups.get(name) ?? []), item(page)])
  }
  const rest = [...groups.keys()].filter((name) => !['Start', 'Optional', ...SECTIONS].includes(name))
  const order = ['Start', ...SECTIONS, ...rest.sort(), 'Optional'].filter((name) => groups.has(name))
  const sections = order.map((name) => [`## ${name}`, '', ...groups.get(name), ''].join('\n'))
  return [LLMS_TITLE, '', LLMS_SUMMARY, '', LLMS_NOTE, '', ...sections].join('\n')
}

export const BANNER_START = '<!-- record banner: generated by tools/generate.mjs from history/records.json -->'
export const BANNER_END = '<!-- end of record banner -->'
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const dateOf = (iso) => {
  const [year, month, day] = iso.split('-').map(Number)
  return `${day} ${MONTHS[month - 1]} ${year}`
}

// What the banner says of a record's language: translation is whole, passages or none. A translation
// keeps the numbers and dates of its original as written, so the banner says how Vietnamese writes them.
export const NOTATION =
  ' Numbers and dates are kept as written: in a passage translated from Vietnamese, a dot groups thousands, a comma marks decimals and a date is day/month/year.'
const TRANSLATIONS = {
  whole: ` This is a machine translation of a Vietnamese record; the original is kept in the owner's private store.${NOTATION}`,
  passages: ` Its Vietnamese passages are machine translations; the original is kept in the owner's private store.${NOTATION}`,
  none: ''
}

// The banner of a record: when it was written, the current pages that replaced it and, for a
// translation, where the original is. titleOf(path) reads a page's title.
export function bannerOf(path, record, titleOf) {
  const links = record.replacedBy.map(
    (page) => `[${titleOf(page)}](${posix.relative(posix.dirname(path), page)})`
  )
  const replaced = links.length
    ? `Replaced by ${links.join(', ')}.`
    : 'No current page replaces it.'
  const text = `> **Record, written ${dateOf(record.written)}.** It is never current truth. ${replaced}${TRANSLATIONS[record.translation]}`
  return [BANNER_START, text, BANNER_END].join('\n')
}

// The page with its banner right after the header, in place of an older banner.
export function withBanner(text, lines, banner) {
  const all = text.split('\n')
  const head = all.slice(0, lines)
  let body = all.slice(lines)
  const start = body.findIndex((line) => line === BANNER_START)
  if (start >= 0) {
    const end = body.indexOf(BANNER_END, start)
    body.splice(start, end < 0 ? 1 : end - start + 1)
  }
  while (body[0] === '') body = body.slice(1)
  return [...head, '', banner, '', ...body].join('\n')
}

export const RECORDS = 'history/records.json'
const NOT_TEXT = 'no header: the file is not UTF-8 text'

// The files of a repository, whether a path exists (a folder exists when it holds a file), a cached
// reader of text files, and its pages with their headers parsed.
export function repositoryOf(root) {
  const files = filesOf(root)
  const known = new Set(files.flatMap((file) => file.split('/').map((_, i, parts) => parts.slice(0, i + 1).join('/'))))
  const texts = new Map()
  const listed = new Set(files)
  // A missing file reads as null, like a binary one.
  const read = (path) => {
    if (!listed.has(path)) return null
    if (!texts.has(path)) texts.set(path, textOf(readFileSync(join(root, path))))
    return texts.get(path)
  }
  // A page that is not UTF-8 text has no header to read: it is reported, never thrown at.
  const pageOf = (path) => {
    const text = read(path)
    return text === null ? { path, text, problem: NOT_TEXT, line: 1 } : { path, text, ...headerOf(text) }
  }
  const pages = files.filter(isPage).map(pageOf)
  return { files, exists: (path) => known.has(path), read, pages }
}

// The value of a JSON file of the repository, or why the file cannot be used: it is missing or not
// UTF-8 text, or its text is not JSON. read(path) gives null for a missing file, like a binary one.
export function jsonOf(read, path) {
  const text = read(path)
  if (text === null) return { problem: 'missing or not UTF-8 text' }
  try {
    return { value: JSON.parse(text) }
  } catch (error) {
    return { problem: `not valid JSON: ${error.message}` }
  }
}

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value)

// The table of history/records.json: empty while the file does not exist, or why it cannot be used.
function tableOf({ exists, read }) {
  if (!exists(RECORDS)) return { table: {} }
  const { value, problem } = jsonOf(read, RECORDS)
  if (problem) return { problem }
  return isObject(value) ? { table: value } : { problem: 'is not an object with one entry per record page' }
}

// A date as YYYY-MM-DD that exists on the calendar: only such a string is equal to the date it parses to,
// so a day that rolls over (31 February), another shape or a value of another type is not.
function isDate(value) {
  const date = new Date(value)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

const isList = (value) => Array.isArray(value) && value.every((page) => typeof page === 'string')

// What is wrong with an entry of the table, so that no banner is made from it. A record the owner voided
// has an empty replacedBy: no current page replaced it.
function entryProblems(path, entry) {
  if (!isObject(entry)) return [`${path} is not an object with written, replacedBy and translation`]
  const problems = []
  if (!isDate(entry.written)) problems.push(`${path} has written ${entry.written}, not a date YYYY-MM-DD`)
  if (!isList(entry.replacedBy)) problems.push(`${path} has a replacedBy that is not a list of page paths`)
  if (!Object.hasOwn(TRANSLATIONS, entry.translation)) {
    problems.push(`${path} has translation ${entry.translation}, not whole, passages or none`)
  }
  return problems
}

// What is wrong with a page named as the one that replaced a record: it must be a page whose header
// says status current.
function targetProblems(path, target, headers) {
  const header = headers.get(target)
  if (header === undefined) return [`${path} is replaced by ${target}, which is no current page`]
  if (header.status !== 'current') {
    return [`${path} is replaced by ${target}, which has status ${header.status}, not current`]
  }
  return []
}

// The text each record page should have, its banner made from history/records.json, and every place
// where that table and the pages disagree. When the table cannot be read, expected is null and the one
// problem says why: no banner can be made. A banner is made from an entry that is right in itself; a
// page that replaced the record without being current is a problem, and the banner still names it.
export function recordsOf({ exists, read, pages }) {
  const { table, problem } = tableOf({ exists, read })
  if (problem) return { expected: null, problems: [`${RECORDS}:1: record: ${problem}`] }
  const records = pages.filter((page) => page.path.startsWith('history/') && page.header)
  const headers = new Map(pages.filter((page) => page.header).map((page) => [page.path, page.header]))
  const titleOf = (path) => headers.get(path)?.title ?? path
  const wrong = new Map(Object.entries(table).map(([path, entry]) => [path, entryProblems(path, entry)]))
  const problems = []
  const expected = new Map()
  for (const page of records) {
    if (!Object.hasOwn(table, page.path)) {
      problems.push(`${page.path}:1: record: no entry in ${RECORDS}`)
    } else if (wrong.get(page.path).length === 0) {
      expected.set(page.path, withBanner(page.text, page.lines, bannerOf(page.path, table[page.path], titleOf)))
    }
  }
  for (const [path, entry] of Object.entries(table)) {
    const noPage = records.some((page) => page.path === path) ? [] : [`${path} is no record page`]
    const targets = isObject(entry) && isList(entry.replacedBy) ? entry.replacedBy : []
    const found = [...noPage, ...wrong.get(path), ...targets.flatMap((t) => targetProblems(path, t, headers))]
    problems.push(...found.map((message) => `${RECORDS}:1: record: ${message}`))
  }
  return { expected, problems }
}

// Every generated file of the repository as it should read now, by path (llms.txt, then each record
// with its banner), how many banners that is, and the problems that keep a record from its banner.
// tools/generate.mjs writes these files and tools/check.mjs compares them. A table of records that
// cannot be read leaves no file at all: nothing is written and nothing is compared.
export function generated(repo) {
  const { expected, problems } = recordsOf(repo)
  if (expected === null) return { files: new Map(), banners: 0, problems }
  const llms = llmsOf(repo.pages.filter((page) => page.header))
  return { files: new Map([[LLMS, llms], ...expected]), banners: expected.size, problems }
}
