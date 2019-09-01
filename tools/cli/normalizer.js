#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')

const BREAKER = '\n\n'
const MAX_BYTES = 1000
const SENTENCE_BREAKER = '。'

async function read(filename) {
  console.log(`process ${filename}`)
  const content = await fs.readFile(filename, 'utf8')

  return content
    .split(BREAKER)
    .map(c => split_sentence(c, MAX_BYTES))
    .flat(100)
    .map((c, idx) => normalize(c, idx))
}

function split_sentence(text, max_len) {

  if (Buffer.byteLength(text) <= max_len) return text
  let idx = text.lastIndexOf(SENTENCE_BREAKER, 330)
  if (idx < 0) console.log(text)
  if (text.substr(idx + 1, 1) === '”') idx = idx + 1;
  return [text.substr(0, idx + 1), split_sentence(text.substr(idx + 1), max_len)]
}

function normalize(text, idx) {
  if (text.startsWith('#')) return { text: text }
  if (text.endsWith('）')) return { text: `## ${text}` }
  if (text.length < 8 && /皇帝|王/.test(text)) return { text: `# ${text}` }
  return { text: text, audio: `${idx}.mp3` }
}

async function process_file(in_file, out_file) {
  try {
    let data = await read(in_file)
    await fs.writeFile(out_file, JSON.stringify(data, null, 2))
  } catch (e) {
    console.log(e)
  }
}

async function main() {
  const argv = require('yargs')
    .option('input', {
      alias: 'i',
      describe: 'input path containing all md files'
    })
    .option('output', {
      alias: 'o',
      describe: 'output path to put generated json files'
    })
    .demandOption(['input', 'output'], 'Please provide both input path and output path')
    .help()
    .argv


  const files = await fs.readdir(argv.i)

  results = files
    .filter(name => name.endsWith('.md'))
    .map(name => {
      const in_file = path.join(argv.i, name)
      const out_file = path.join(argv.o, `${path.basename(name, '.md')}.json`)
      return process_file(in_file, out_file)
    })
  return await Promise.all(results)
}

main()
