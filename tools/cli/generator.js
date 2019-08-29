#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')

function gen_header(title) {
  return `---
marp: true
title: ${title.replace('# ', '')}
theme: uncover
paginate: true
---

`
}

async function read(filename) {
  const content = JSON.parse(await fs.readFile(filename, 'utf8'))
  const name = path.basename(filename, '.json')
  const audio_path = path.join('assets/audios', name)
  await fs.mkdir(audio_path, { recursive: true })

  return gen_header(content[0].text) + content
    .map(item => normalize(item, audio_path))
    .join('\n\n---\n\n')
}


function normalize(content, audio_path) {
  let audio = ''
  let bg = ''

  if (content.audio) {
    const filename = path.join(audio_path, content.audio)
    audio = `![](${filename})\n\n`
  }

  const text = content.text.replace(/“/g, '__「').replace(/”/g, '」__ ')

  if (content.text.startsWith('臣光曰')) {
    bg = '![bg left](assets/images/simaguang.jpg)\n\n'
  } else if (content.text.startsWith('太史公曰')) {
    bg = '![bg left](assets/images/simaqian.webp)\n\n'
  }

  return `${bg}${audio}${text}`
}

async function process_file(in_file, out_file) {
  try {
    let data = await read(in_file)
    await fs.writeFile(out_file, data)
  } catch (e) {
    console.log(e)
  }
}

async function main() {
  const argv = require('yargs')
  .option('input', {
    alias: 'i',
    describe: 'input path containing all json files'
  })
  .option('output', {
    alias: 'o',
    describe: 'output path to put generated md files'
  })
  .demandOption(['input', 'output'], 'Please provide both input path and output path')
  .help()
  .argv


  const files = await fs.readdir(argv.i)

  results = files
    .filter(name => name.endsWith('.json'))
    .map(name => {
      const in_file = path.join(argv.i, name)
      const out_file = path.join(argv.o, `${path.basename(name, '.json')}.md`)
      return process_file(in_file, out_file)
    })
  return await Promise.all(results)
}

main()
