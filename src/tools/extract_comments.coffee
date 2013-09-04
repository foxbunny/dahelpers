# # Script to extract comments from coffeescript sources
#
# This script runs on NodeJS

{readFileSync, writeFileSync} = require 'fs'
dahelpers = require '../dahelpers'

commentRe = /^ *(?:#|# (.*))$/

filename = process.argv[2]
contents = readFileSync filename, encoding: 'utf-8'
lines = contents.split '\n'  # yes, we don't care about CRLF

paragraphs = []  # Comment paragraphs

# Iterate all lines, and only collect those that represent a standard comment.
# As we iterate the lines, we also group paragraphs together. We assume that
# each paragraph will be separated from another by a single blank line.

((block) ->
  lines.forEach (line, idx) ->
    match = line.match commentRe
    if match
      if match[1]?
        block.push match[1]
      else
        paragraphs.push block
        block = []
    return
) []

# Now we go over paragraphs (that are currently represented by an array of
# strings, and we either word-wrap them, or we keep them as they are. Rule is
# simple. If there is at least one space at the beginning of the first line of
# a paragraph, we leave the paragraph as is (we simply concatenate it leaving
# one newline at the end of each line). Otherwise we first merge the paragraph
# into a single string, and then we word-wrap it to 79-character lines.

paragraphs = paragraphs.map (paragraph) ->
  if paragraph[0][0] is ' '
    # We have space at beginning of line 1
    paragraph.join('\n') + '\n'
  else
    dahelpers.wrap(paragraph.join(' '))

# We will also add anchor tags for all headers and build the ToC

toc = ''

paragraphs = paragraphs.map (paragraph) ->
  if paragraph[0] is '#'

    # Calculate the ToC level
    m = paragraph.match /^(#+) (.*)$/
    tocLevel = m[1].length
    title = m[2]
    tocSymbol = if tocLevel % 2 then '-' else '+'
    tocIndent = new Array(2 + ((tocLevel - 2) * 2)).join ' '

    # Calcualte the anchor hash
    hash = dahelpers.slug paragraph

    # Add item to ToC
    if tocLevel > 1
      toc += tocIndent + tocSymbol + ' [' + title + '](#' + hash + ')\n'

    # Add the anchor to the actual heading
    paragraph + ' ' + dahelpers.a '', name: hash
  else
    paragraph

# Output the results to STDOUT
mkd = paragraphs.join '\n\n'
mkd = mkd.replace '::TOC::', toc
console.log mkd

