#!/usr/local/bin/node

const existsSync = require('fs').existsSync
const fs = require('fs').promises
const path = require('path')

const TTS = require('xf-tts')
let tts = new TTS(process.env.XF_TTS_ID, process.env.XF_TTS_KEY, { voice_name: 'x_nannan', volume: '70' })

async function gen_mp3(text, filename) {
  console.log(text)
  if (existsSync(filename)) return console.log('already exists: ', filename)

  try {
    let data = await tts.start({
      text: text
    })
    let file = await data.file(filename)
    console.log('generated: ', filename)
  } catch (error) {
    console.error(error)
  }
}

async function main() {
  const argv = require('yargs')
  .option('input', {
    alias: 'i',
    describe: 'input file containing json metadata'
  })
  .demandOption(['input'], 'Please provide input file')
  .help()
  .argv

  const content = JSON.parse(await fs.readFile(argv.i, 'utf8'))
  const name = path.basename(argv.i, '.json')
  const results = content.filter(item => item.audio && item.text !== '')

  for (const item of results) {
    await gen_mp3(item.text, path.join('slides/assets/audios', name, item.audio))
  }
}

main()
