import { div, TextProps } from "flinker-dom"
import { md, MDGrammar, MDLineGrammarRule, MDMultilineGrammarRule, MDParser } from "flinker-markdown"

interface MarkdownProps extends TextProps {
  absolutePathPrefix?: string
  mark?: string
  mode: 'md' | 'rawText' | 'rawHtml'
}

const g = new MDGrammar()

// noteParagraph
const noteParagraph = new MDLineGrammarRule()
noteParagraph.matcher = [/^\* (.*)$/, '<p class="md-note">$1</p>']
noteParagraph.childrenInlineRules = g.globalRule.childrenInlineRules
noteParagraph.preProccessing = g.defLinePreproccessing

g.globalRule.childrenLineRules.unshift(noteParagraph)
g.quoteMultiline.childrenLineRules.unshift(noteParagraph)
g.ol.childrenLineRules.unshift(noteParagraph)
g.ul.childrenLineRules.unshift(noteParagraph)
g.div.childrenLineRules.unshift(noteParagraph)

// noteMultiline
const noteMultiline = new MDMultilineGrammarRule()
noteMultiline.startMatcher = [/^\*\* *$/, '<div class="md-note">']
noteMultiline.endMatcher = [/^\*\* *$/, '</div>']
noteMultiline.childrenInlineRules = g.globalRule.childrenInlineRules
noteMultiline.childrenLineRules = g.div.childrenLineRules
noteMultiline.childrenMultilineRules = g.div.childrenMultilineRules
g.globalRule.childrenMultilineRules.unshift(noteMultiline)

// warnParagraph
const warnParagraph = new MDLineGrammarRule()
warnParagraph.matcher = [/^! (.*)$/, '<p class="md-warn">$1</p>']
warnParagraph.childrenInlineRules = g.globalRule.childrenInlineRules
warnParagraph.preProccessing = g.defLinePreproccessing

g.globalRule.childrenLineRules.unshift(warnParagraph)
g.quoteMultiline.childrenLineRules.unshift(warnParagraph)
g.ol.childrenLineRules.unshift(warnParagraph)
g.ul.childrenLineRules.unshift(warnParagraph)
g.div.childrenLineRules.unshift(warnParagraph)

//g.audio.matcher[1] = g.audio.matcher[1].replace('controls', '')
const parser = new MDParser(g)

export const Markdown = () => {
  return div<MarkdownProps>()
    .map(s => {
      if (s.mode === 'md') {
        s.htmlText = s.text ? md(parser, s.text, s.absolutePathPrefix, s.mark) : ''
        s.text = ''
      } else if (s.mode === 'rawHtml') {
        s.text = s.text ? md(parser, s.text, s.absolutePathPrefix, s.mark) : ''
      }
    })
}