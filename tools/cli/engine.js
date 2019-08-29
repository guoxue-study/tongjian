const { Marp } = require('@marp-team/marp-core');
const markdownItMark = require('markdown-it-mark');
// const markdownItFootnote = require('../plugins/footnote');
const markdownItAbbr = require('../plugins/abbr');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItContainer = require('markdown-it-container');
const markdownItSup = require('markdown-it-sup');
const markdownItSub = require('markdown-it-sub');
const { html5Media } = require('markdown-it-html5-media');

module.exports = opts => {
  return new Marp(opts)
    .use(markdownItMark)
    // .use(markdownItFootnote)
    .use(markdownItAbbr)
    .use(markdownItSup)
    .use(markdownItSub)
    .use(markdownItEmoji)
    .use(html5Media)
    .use(markdownItContainer, 'note');

}
