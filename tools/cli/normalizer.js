#!/usr/bin/env node
const fs = require('fs').promises

const BREAKER = '\n\n---\n\n'

async function read(filename) {
  const content = await fs.readFile(filename, 'utf8')
  return content.split(BREAKER)
}





async function main() {
  const argv = require('yargs')
    .demandCommand(1)
    .argv

  const filename = argv._[0]

  console.log()
  try {
    let data = await read(filename)
    console.log(data)
  } catch (error) {
    console.error(error)
  }
}

main()
