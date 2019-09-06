#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')
const md = require('markdown-it')();

async function read(filename) {
  const content = JSON.parse(await fs.readFile(filename, 'utf8'))
  const name = path.basename(filename, '.json')
  return `* ${name}: [${content[0].text.replace('# ', '')}](${name}.html)`
}


async function processFile(templateFile, outFile, content) {
  try {
    let data = await fs.readFile(templateFile, 'utf8')
    let result = md.render(`${data.split('---')[0]}---\n\n${content}`);
    await fs.writeFile(outFile, result);
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
    .option('template', {
      alias: 't',
      describe: 'template filename'
    })
    .option('output', {
      alias: 'o',
      describe: 'output path to put generated md files'
    })
    .demandOption(['input', 'template', 'output'], 'Please provide input path, template file and output file')
    .help()
    .argv

  const results = Array(294)
    .fill()
    .map((x, i) => {
      const filename = path.join(argv.i, `${(i + 1).toString().padStart(3, '0')}.json`)
      return read(filename)
    })


  const content = (await Promise.all(results)).join('\n')

  await processFile(argv.t, argv.o, content)
}

main()
