const { Marp } = require('@marp-team/marp-core');
const markdownItMark = require('markdown-it-mark');
// const markdownItFootnote = require('./footnote');
const markdownItAbbr = require('./abbr');
const markdownItEmoji = require('markdown-it-emoji');
const markdownItContainer = require('markdown-it-container');
const markdownItSup = require('markdown-it-sup');
const markdownItSub = require('markdown-it-sub');

module.exports = opts =>
	new Marp(opts)
		.use(markdownItMark)
		// .use(markdownItFootnote)
		.use(markdownItAbbr)
		.use(markdownItSup)
		.use(markdownItSub)
		.use(markdownItEmoji)
		.use(markdownItContainer, 'note');
