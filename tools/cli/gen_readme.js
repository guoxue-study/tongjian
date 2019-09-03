#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')

async function read(filename) {
  const content = JSON.parse(await fs.readFile(filename, 'utf8'))
  const name = path.basename(filename, '.json')
  return `* [${content[0].text.replace('# ', '')}](docs/${name}.html)`
}


async function processFile(outFile, content) {
  try {
    let data = await fs.readFile(outFile, 'utf8')
    await fs.writeFile(outFile, `${data.split('---')[0]}---\n\n${content}`)
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

  const results = Array(294)
    .fill()
    .map((x, i) => {
      const filename = path.join(argv.i, `${(i + 1).toString().padStart(3, '0')}.json`)
      return read(filename)
    })


  const content = (await Promise.all(results)).join('\n')

  await processFile(argv.o, content)
}

main()
