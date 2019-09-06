#!/usr/bin/env node
const fs = require('fs').promises
const path = require('path')
const md = require('markdown-it')()
const R = require('ramda')

function gen_html(body) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>资治通鉴</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.7.5/css/bulma.min.css" />
    <style>
      * {font-size: 20px;}
      h1, h2 {
        color: #363636;
        font-weight: 600;
        line-height: 2;
      }
      h1 { font-size: 2rem; }
      h2 { font-size: 1.6rem;}
      ul {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        text-decoration: none;
      }
      li { padding: 10px; }
    </style>
  </head>
  <body>
  <div class="container">
  ${body}
  </div>
  </body>
</html>
`
}

async function read(filename) {
  const content = JSON.parse(await fs.readFile(filename, 'utf8'))
  const name = path.basename(filename, '.json')
  const [topic, chapter] = content[0].text.replace('# ', '').split(' ').slice(0, 2)
  return [topic, `* [${chapter}](${name}.html)`]
}


async function processFile(templateFile, outFile, content) {
  try {
    let data = await fs.readFile(templateFile, 'utf8')
    let result = md.render(`${data.split('---')[0]}---\n\n${content}`)
    await fs.writeFile(outFile, gen_html(result))
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


  const content = await Promise.all(results)
  const grouped = R.groupWith((a, b) => a[0] === b[0], content)
    .map(item => `# ${item[0][0]}\n\n${item.map(v => v[1]).join('\n')}`)
    .join('\n\n---\n\n')

  await processFile(argv.t, argv.o, grouped)
}

main()
