// What the test files of tools/ share: the fixture values both use, how the checks word a problem, a
// page built from a header, and temporary repositories. Letters and dashes the checks reject are
// escapes, so that these files pass the checks they test.
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { after } from 'node:test'

import { RECORDS } from './docs.mjs'

export const ACCENTED = 'Caf\u00e9'
export const VIETNAMESE = 'Ti\u1ebfng Vi\u1ec7t'
export const EN_DASH = '\u2013'
export const EM_DASH = '\u2014'

// Bytes of a file that is not text: a NUL byte inside valid UTF-8, and bytes that are not UTF-8.
export const WITH_NUL = Buffer.from('ok\0ok')
export const NOT_UTF8 = Buffer.from([0xff, 0xfe, 0x41])

// The problem a page without a valid header, or without readable text, is given.
export const NO_HEADER = 'no header: the first line must be ---'
export const NOT_TEXT = 'no header: the file is not UTF-8 text'

// Pages and records that more than one test names.
export const README = 'README.md'
export const CLAUDE = 'CLAUDE.md'
export const OVERVIEW = 'business/overview.md'
export const REPLACING = 'components/app/develop.md'
export const RECORD = 'history/plans/p.md'
export const NO_ENTRY = 'history/plans/q.md' // a record page that history/records.json does not list
export const WRITTEN = '2026-10-05'
export const WHOLE = 'whole'
export const PASSAGES = 'passages'
export const NONE = 'none'
export const REFERENCE = 'reference'
export const TOOLS = 'tools' // the folder of these modules, which is also the llms.txt section of its pages
export const JSON_NULL = JSON.stringify(null)

// A valid header, and the header of a record.
export const HEAD = {
  title: 'Change request',
  summary: 'How a change request goes from logged to applied.',
  component: 'all',
  type: 'journey',
  status: 'current',
  ids: ['CHG-01', 'BR-42']
}
export const RECORD_HEAD = { ...HEAD, title: 'Old plan', type: 'record', status: 'record' }
export const headerText = (header) =>
  [
    '---',
    ...Object.entries(header).map(([key, value]) =>
      Array.isArray(value) ? `${key}: [${value.join(', ')}]` : `${key}: ${value}`
    ),
    '---'
  ].join('\n')
export const page = (header, body) => `${headerText(header)}\n\n${body}`

// How the checks word things, written once for the tests that expect them.
export const summaryOf = (title) => `About ${title}.`
export const itemOf = (title, path, note) => `- [${title}](${path}): ${note}`
export const OUTSIDE_HISTORY = 'only a page under history/ is a record'
export const noBrdId = (id) => `${id} is no BRD id`
// A problem the way docs.mjs gives it, and the line check.mjs prints for it.
const problemOf = (rule) => (line, message) => ({ line, rule, message })
export const letterProblem = problemOf('non-ascii-letter')
export const dashProblem = problemOf('dash')
export const idProblem = problemOf('id')
export const linkProblem = problemOf('link')
export const headerProblem = problemOf('header')
export const generatedProblem = problemOf('generated')
export const recordProblem = problemOf('record')
export const printed = (path, { line, rule, message }) => `${path}:${line}: ${rule}: ${message}`
export const noEntry = (path) => printed(path, recordProblem(1, `no entry in ${RECORDS}`))
// Why a JSON file of the repository cannot be used: it is missing or not text, or its text is not JSON.
export const NOT_READABLE = 'missing or not UTF-8 text'
// The message this Node gives for text that is not JSON.
export function syntaxMessage(text) {
  let message
  try {
    JSON.parse(text)
  } catch (error) {
    message = error.message
  }
  return message
}
export const notJson = (text) => `not valid JSON: ${syntaxMessage(text)}`
// What linkProblems says of a link, by kind of problem.
export const LINK_MESSAGES = {
  missing: (target) => `${target}: no such file`,
  outside: (target) => `${target} leaves the repository`,
  address: (target) => `${target} is not a valid address`,
  anchor: (target) => `${target}: no heading with the anchor #${target.split('#')[1]}`
}

const roots = []
after(() => roots.forEach((root) => rmSync(root, { recursive: true, force: true })))

// Writes a file under root, with the folders it needs.
export function write(root, path, text) {
  mkdirSync(dirname(join(root, path)), { recursive: true })
  writeFileSync(join(root, path), text)
}

// A temporary repository holding the given files, removed when the tests of this process end.
export function tree(files) {
  const root = mkdtempSync(join(tmpdir(), 'docs-tools-'))
  roots.push(root)
  for (const [path, text] of Object.entries(files)) write(root, path, text)
  return root
}
