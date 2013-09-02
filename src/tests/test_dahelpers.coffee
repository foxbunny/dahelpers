# # Tests for DaHelper methods

if require?
  dahelpers = require '../dahelpers'
  chai = require 'chai'

assert = chai.assert
h = dahelpers

describe '#objAttrs()', () ->
  it 'converts objects to HTML attributes', () ->
    s = h.objAttrs
      'class': 'active'
      href: 'http://www.example.com/'
    assert.equal s, 'class="active" href="http://www.example.com/"'

  it 'returns empty string if object is empty', () ->
    s = h.objAttrs {}
    assert.equal s, ''

  it 'returns empty string if there are no arguments', () ->
    s = h.objAttrs()
    assert.equal s, ''

describe '#tag()', () ->
  it 'returns HTML for a tag', () ->
    s = h.tag 'a'
    assert.equal s, '<a></a>'

  it 'returns a tag with content if we specify it', () ->
    s = h.tag 'a', 'click here'
    assert.equal s, '<a>click here</a>'

  it 'returns a tag with attributes if specified', () ->
    s = h.tag 'a', null, {href: 'http://example.com/'}
    assert.equal s, '<a href="http://example.com/"></a>'

  it 'will suppress output if `silent` argument is passed', () ->
    s = h.tag 'a', null, {href: 'http://example.com/'}, true
    assert.equal s, ''

  it 'will return empty string if no arguments', () ->
    s = h.tag()
    assert.equal s, ''

describe '#plural()', () ->
  it 'will return plural with number greater than 1', () ->
    s = h.plural 'foo', 2
    assert.equal s, 'foos'

  it 'will return a singular when count 1', () ->
    s = h.plural 'foo', 1
    assert.equal s, 'foo'

  it 'will return different plural if specified', () ->
    s = h.plural 'foo', 'bar', 2
    assert.equal s, 'bar'

  it 'will not return the plural form if count is 1', () ->
    s = h.plural 'foo', 'bar', 1
    assert.equal s, 'foo'

  it 'will return an empty string if there are no arguments', () ->
    s = h.plural()
    assert.equal s, ''

describe '#capitalize()', () ->
  it 'will capitalize the first letter', () ->
    s = h.capitalize 'foo'
    assert.equal s, 'Foo'

  it 'will do nothing when text is all caps', () ->
    s = h.capitalize 'FOO'
    assert.equal s, 'FOO'

  it 'will return an empty string if no arguments are passed', () ->
    s = h.capitalize()
    assert.equal s, ''

describe '#titleCase()', () ->
  it 'will Title Case a string', () ->
    s = h.titleCase 'foo bar'
    assert.equal s, 'Foo Bar'

  it 'will do nothing if all-caps', () ->
    s = h.titleCase 'FOO BAR'
    assert.equal s, 'FOO BAR'

  it 'will capitalize words even if mixed case', () ->
    s = h.titleCase 'fOO bAR'
    assert.equal s, 'FOO BAR'

  it 'will return an empty string if no arguments are passed', () ->
    s = h.titleCase()
    assert.equal s, ''

describe '#format()', () ->
  it 'will reformat a string or number using format string', () ->
    s = h.format 123456, '## ## ##'
    assert.equal s, '12 34 56'

  it "will retain pound characters if source hasn't enough characters", () ->
    s = h.format 12, '###'
    assert.equal s, '12#'

  it 'will omit characters if not enough pound characters', () ->
    s = h.format 123, '##'
    assert.equal s, '12'

  it 'will return original value if no format is specified', () ->
    s = h.format 123
    assert.equal s, '123'

  it 'will output an empty string if there are no arguments', () ->
    s = h.format()
    assert.equal s, ''

describe '#reverse()', () ->
  it 'will reverse a string', () ->
    s = h.reverse 'esrever'
    assert.equal s, 'reverse'

  it 'will return an empty string if no arguments', () ->
    s = h.reverse()
    assert.equal s, ''

describe '#sgroup()', () ->
  it 'will group characters into strings of given length', () ->
    a = h.sgroup '123456', 2
    assert.deepEqual a, ['12', '34', '56']

  it 'will return a partial last group if not enough characters', () ->
    a = h.sgroup '12345', 2
    assert.deepEqual a, ['12', '34', '5']

  it 'will return the original string as one group if no length', () ->
    a = h.sgroup '12345'
    assert.deepEqual a, ['12345']

  it 'will return original string as one group if too short', () ->
    a = h.sgroup '1', 2
    assert.deepEqual a, ['1']

  it 'will return empty array given no arguments', () ->
    a = h.sgroup()
    assert.deepEqual a, []

describe '#thousands()', () ->
  it 'will add thousands separator to a number', () ->
    s = h.thousands 1000
    assert.equal s, '1,000'

  it 'should handle situation where first digit is on thousand boundary', () ->
    s = h.thousands 100000
    assert.equal s, '100,000'

  it 'should work with many zeros', () ->
    s = h.thousands 100000000000
    assert.equal s, '100,000,000,000'

  it 'should handle floats', () ->
    s = h.thousands 100000.12
    assert.equal s, '100,000.12'

  it 'should handle floats with many digits', () ->
    s = h.thousands 100000.123456
    assert.equal s, '100,000.123456'

  it 'strips non-digit charracters', () ->
    s = h.thousands 'A hundred thousands is 100000'
    assert.equal s, '100,000'

  it 'will use a different separator if one is given', () ->
    s = h.thousands 1000, "'"
    assert.equal s, "1'000"

  it 'will use a different decimal separator if one is given', () ->
    s = h.thousands 1000.123, '.', ','
    assert.equal s, '1.000,123'

describe '#si()', () ->
  it 'will suffix k for thousands', () ->
    s = h.si 1000
    assert.equal s, '1k'

  it 'will suffix M for millions', () ->
    s = h.si 1000000
    assert.equal s, '1M'

  it 'will suffix G for billions', () ->
    s = h.si 1000000000
    assert.equal s, '1G'

  it 'will suffix T for trillions', () ->
    s = h.si 1000000000000
    assert.equal s, '1T'

  it 'will suffix P for quadrillions', () ->
    s = h.si 1000000000000000
    assert.equal s, '1P'

  it 'will suffix E for quintillions', () ->
    s = h.si 1000000000000000000
    assert.equal s, '1E'

  it 'will suffix Z for sextillions', () ->
    s = h.si 1000000000000000000000
    assert.equal s, '1Z'

  it 'will degrade to lower thousand if not a whole thousand', () ->
    s = h.si 1100
    assert.equal s, '1100'

    s = h.si 1100000
    assert.equal s, '1100k'

    s = h.si 1100000000
    assert.equal s, '1100M'

  it 'will provide a float if number of decimal places are specified', () ->
    s = h.si 1100, 1
    assert.equal s, '1.1k'

  it 'will still go down a thousand if not enough decimal places', () ->
    s = h.si 1110, 1
    assert.equal s, '1110'

    s = h.si 1110, 2
    assert.equal s, '1.11k'

  it 'supports unlimited decimal places', () ->
    s = h.si 1234560000
    assert.equal s, '1234560k'

    s = h.si 1234560000, 5
    assert.equal s, '1.23456G'

  it 'will return an empty string if provided no arguments', () ->
    s = h.si()
    assert.equal s, ''

describe '#digits()', () ->
  it 'will return only the digits from a string', () ->
    s = h.digits 'a1b2c3d4 5-6#7'
    assert.equal s, '1234567'

  it 'will return an empty string if given no arguments', () ->
    s = h.digits()
    assert.equal s, ''

describe 'tag aliases', () ->
  it 'will render appropriate tags', () ->
    tags = 'a p strong em ul ol li div span'.split ' '

    for tag in tags
      assert.equal h[tag](), "<#{tag}></#{tag}>"

  it 'accepts the same arguments as #tag()', () ->
    tags = 'a p strong em ul ol li div span'.split ' '

    for tag in tags
      assert.equal h[tag]('foo', foo: 'bar'),
        "<#{tag} foo=\"bar\">foo</#{tag}>"
