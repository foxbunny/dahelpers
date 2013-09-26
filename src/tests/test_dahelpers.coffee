# # Tests for DaHelper methods

if require?
  dahelpers = require '../dahelpers'
  chai = require 'chai'

assert = chai.assert
h = dahelpers

describe '#type()', () ->
  it 'reveals types of things', () ->
    assertType = (v, t) ->
      assert.equal dahelpers.type(v), t

    assertType null, 'null'
    assertType undefined, 'undefined'
    assertType 1, 'number'
    assertType 'foo', 'string'
    assertType new Date(), 'date'
    assertType /\d+/g, 'regexp'
    assertType true, 'boolean'
    assertType [1,2,3], 'array'
    assertType {foo: 'bar'}, 'object'
    assertType (() ->), 'function'
    ((somethingUndefined) ->
      assertType somethingUndefined, 'undefined'
    )()

  it 'returns boolean result of type test if second arg is supplied', () ->
    assertType = (v, t) ->
      assert.ok dahelpers.type v, t

    assertType null, 'null'
    assertType undefined, 'undefined'
    assertType 1, 'number'
    assertType 'foo', 'string'
    assertType new Date(), 'date'
    assertType /\d+/g, 'regexp'
    assertType true, 'boolean'
    assertType [1,2,3], 'array'
    assertType {foo: 'bar'}, 'object'
    assertType (() ->), 'function'
    ((somethingUndefined) ->
      assertType somethingUndefined, 'undefined'
    )()

describe '#klass()', () ->
  it 'reveals the object constructor', () ->
    assertKlass = (v, k) ->
      assert.equal dahelpers.klass(v), k

    class Foo
      constructor: () ->

    assertKlass {}, Object
    assertKlass new Date(), Date
    assertKlass new RegExp(), RegExp
    assertKlass new String(), String
    assertKlass new Foo(), Foo
    assertKlass new Array, Array
    assertKlass [], Array
    assertKlass null, false
    assertKlass undefined, false
    assertKlass 1, false
    assertKlass 'foo', false
    assertKlass true, false

  it 'returns boolean result of klass check if second arg is supplied', () ->
    assertKlass = (v, k) ->
      assert.ok dahelpers.klass v, k

    class Foo
      constructor: () ->

    assertKlass {}, Object
    assertKlass new Date(), Date
    assertKlass new RegExp(), RegExp
    assertKlass new String(), String
    assertKlass new Foo(), Foo
    assertKlass new Array, Array
    assertKlass [], Array

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

  it 'will correctly apply attribute with empty value', () ->
    s = h.tag('foo', '', {value: ''})
    assert.equal s, '<foo value=""></foo>', 'empty string'

    s = h.tag('foo', '', {value: null})
    assert.equal s, '<foo value=""></foo>', 'null'

    s = h.tag('foo', '', {value: undefined})
    assert.equal s, '<foo value=""></foo>', 'undefined'

describe '#escape()', () ->
  it 'should escape special HTML chars', () ->
    assert.equal dahelpers.escape('<&"\'/>'), '&lt;&amp;&quot;&#x27;&#x2F;&gt;'

  it 'should leave all other chars intact', () ->
    input = '<a href="#">not so malicious HTML</a>'
    out = '&lt;a href=&quot;#&quot;&gt;not so malicious HTML&lt;&#x2F;a&gt;'
    assert.equal dahelpers.escape(input), out

describe '#plural()', () ->
  it 'will return plural with number greater than 1', () ->
    s = h.plural 'foo', 'foos', 2
    assert.equal s, 'foos'

  it 'will return a singular when count 1', () ->
    s = h.plural 'foo', 'foos', 1
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

  it 'will lower-case everything if told to', () ->
    s = h.titleCase 'FOO BAR', true
    assert.equal s, 'Foo Bar'

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

  it 'can use a different format character', () ->
    s = h.format 123, '$$/$', '$'
    assert.equal s, '12/3'

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

  it 'will return original string as one group if n is 0', () ->
    a = h.sgroup '12345', 0
    assert.deepEqual a, ['12345']

  it 'will return original string as one group if too short', () ->
    a = h.sgroup '1', 2
    assert.deepEqual a, ['1']

  it 'will return empty array given no arguments', () ->
    a = h.sgroup()
    assert.deepEqual a, []

  it 'will return an empty array if string is empty', () ->
    a = h.sgroup ''
    assert.deepEqual a, []

describe '#pad()', () ->
  it 'should pad a number with leading characters', () ->
    s = h.pad 123, 4
    assert.equal s, '0123'

  it 'should not pad if length is 0', () ->
    s = h.pad 123, 0
    assert.equal s, '123'

  it 'should pad a number with different character if told to', () ->
    s = h.pad 123, 5, '%'
    assert.equal s, '%%123'

  it 'should keep the original string if given length is shorter', () ->
    s = h.pad 123, 1
    assert.equal s, '123'

  it 'should pad the tail if tail is specified', () ->
    s = h.pad 123.12, 5, null, 4
    assert.equal s, '00123.1200'

  it 'should use a different separator for tail if specified', () ->
    s = h.pad '123,12', 5, null, 4, ','
    assert.equal s, '00123,1200'

  it 'should pad the tail even if head length is 0', () ->
    s = h.pad 123.12, 0, null, 4
    assert.equal s, '123.1200'

  it 'should be able to pad anything really', () ->
    s = h.pad 'foo-bar', 6, '!', 6, '-'
    assert.equal s, '!!!foo-bar!!!'

  it 'should remove tail if tail is 0', () ->
    s = h.pad '123.12', 4, null, 0
    assert.equal s, '0123'

  it 'shold return an empty string if no arguments are passed', () ->
    s = h.pad()
    assert.equal s, ''

describe '#round()', () ->
  it 'should round numbers', () ->
    n = h.round 1.2345, 3
    assert.equal n, 1.235

  it 'should round to 0 digits by default', () ->
    n = h.round 1.2345
    assert.equal n, 1

  it 'should parse numbers from strings', () ->
    n = h.round '1.234', 2
    assert.equal n, 1.23

  it 'should return 0 if input is not numeric', () ->
    n = h.round 'foo'
    assert.equal n, 0

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

  it 'should play nice with negative numbers', () ->
    s = h.thousands -12000
    assert.equal s, '-12,000'

  it 'should return an empty string if passed no argument', () ->
    s = h.thousands()
    assert.equal s, ''

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

  it 'should play nice with negative numbers', () ->
    s = h.si -1200000, 1
    assert.equal s, '-1.2M'

  it 'should add thousands separators if told to', () ->
    s = h.si 12401000, 1, true
    assert.equal s, '12,401k'

  it 'should use a thousands separator specified', () ->
    s = h.si 12401000, 1, true, "'"
    assert.equal s, "12'401k"

  it 'should use a different decimal separator if told to', () ->
    s = h.si 12401200, 1, true, '.', ','
    assert.equal s, '12.401,2k'

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

describe '#prefix()', () ->
  it 'should add specified prefix to a number', () ->
    assert.equal h.prefix(12, '$'), '$12'

  it 'should add minus in front of prefix if number is negative', () ->
    assert.equal h.prefix(-12, '$'), '-$12'

  it 'should separate long prefix from number', () ->
    assert.equal h.prefix(12, 'USD', true), 'USD 12'
    assert.equal h.prefix(-12, 'USD', true), 'USD -12'

  it 'should not care if number is a number or not', () ->
    assert.equal h.prefix('abc', '$'), '$abc'
    assert.equal h.prefix('-abc', '$'), '-$abc'

describe '#currency()', () ->
  it 'should work fine with defaults', () ->
    s = h.currency 12
    assert.equal s, '$12.00'

  it 'should add thousands separators', () ->
    s = h.currency 1200
    assert.equal s, '$1,200.00'

  it 'should use any currency we tell it to', () ->
    s = h.currency 1200, 'USD'
    assert.equal s, 'USD 1,200.00'

  it 'should round to number of decimals', () ->
    s = h.currency 1200.55, null, 1
    assert.equal s, '$1,200.6'

  it 'should play nice with negative numbers', () ->
    s = h.currency -1200
    assert.equal s, '-$1,200.00'

  it 'should use different separators if told to', () ->
    s = h.currency 1200, null, null, "'", ';'
    assert.equal s, "$1'200;00"

  it 'should use SI suffixes if told to', () ->
    s = h.currency 1200, null, null, null, null, true
    assert.equal s, "$1.2k"

  it 'should play nice with string input', () ->
    s = h.currency '1200'
    assert.equal s, '$1,200.00'

  it 'should suffix the currency if we tell it to', () ->
    s = h.currency 1200, null, null, null, null, null, true
    assert.equal s, '1,200.00 $'

  it 'should only use the integer part if decimal digits is 0', () ->
    s = h.currency 123.12, null, 0
    assert.equal s, '$123'

  it 'should return 0 if no input', () ->
    s = h.currency()
    assert.equal s, '$0.00'

describe '#makeCurrency()', () ->
  it 'should create me a custom currency', () ->
    originalCurrency = h.currency
    currencyArgs = null
    h.currency = (args...) ->
      currencyArgs = args
    h.makeCurrency 'din', 'Din', 2, '.', ',', false, true
    h._din 1000
    assert.deepEqual currencyArgs, [1000, 'Din', 2, '.', ',', false, true]
    h.currency = originalCurrency

describe '#wrap()', () ->
  it 'should wrap long lines', () ->
    text = """This is a longer piece of text that needs to be wrapped. It
    contains no linebreaks, though.""".replace('\n', ' ')

    output = """This is a longer
    piece of text that
    needs to be wrapped.
    It contains no
    linebreaks, though."""

    s = h.wrap text, 20
    assert.equal s, output

  it 'returns empty string if no output is given', () ->
    s = h.wrap()
    assert.equal s, ''

describe '#slug()', () ->
  it 'should convert text to slug', () ->
    s = h.slug "This is some text, and it's got some non-word characters"
    assert.equal s, 'this-is-some-text-and-it-s-got-some-non-word-characters'

  it 'should keep numbers and underscores', () ->
    s = h.slug "This is text containing numbers 1, 2, and 3, and _ character"
    assert.equal s, 'this-is-text-containing-numbers-1-2-and-3-and-_-character'

  it 'strips leading and trailing underscores and dashes', () ->
    s = h.slug '### boo ###'
    assert.equal s, 'boo'
    s = h.slug '___ boo ___'
    assert.equal s, 'boo'

  it 'returns empty string if no argument is given', () ->
    s = h.slug()
    assert.equal s, ''

describe '#props()', () ->
  it 'should retrieve a property tree', () ->
    obj =
      a:
        b:
          c:
            d: 1

    v = h.props obj, 'a.b.c.d'
    assert.equal v, 1

  it 'should return undefined if at least one segment is undefined', () ->
    obj =
      a:
        b:
          c:
            d:
              1
    v = h.props obj, 'a.b.foo.d'
    assert.equal v, undefined

  it 'should return original object if `p` is not passed', () ->
    obj = 'foo'
    v = h.props obj
    assert.equal v, obj

  it 'should return undefined if object is not passed', () ->
    v = h.props()
    assert.equal v, undefined

describe '#propset()', () ->
  it 'should set a property tree and assign a value to the leaf', () ->
    obj = {}
    h.propset obj, 'foo.bar.baz', 1
    assert.deepEqual obj,
      foo:
        bar:
          baz: 1

  it 'should also accept funky property names', () ->
    obj = {}
    h.propset obj, 'foo.This is totally funky!.bar', 1
    assert.deepEqual obj,
      foo:
        'This is totally funky!':
          bar: 1

  it 'should overwrite existing properties', () ->
    obj = foo: bar: baz: 1
    h.propset obj, 'foo.bar.baz', 2
    assert.equal obj.foo.bar.baz, 2

  it 'should be chainable', () ->
    obj = {}
    h.propset h.propset(obj, 'foo.bar', 2), 'foo.baz', 3
    assert.deepEqual obj,
      foo:
        bar: 2
        baz: 3

  it 'should work with an array as well', () ->
    obj = {}
    h.propset obj, ['foo', 'bar.baz', 'fam'], 3
    assert.deepEqual obj,
      foo:
        'bar.baz':
          fam: 3

describe '#walk()', () ->
  it 'should access all properties of an object exactly once', () ->
    obj =
      a: 1
      b: 2
      c: 3
      d:
        e: 4
        f: 5

    walkArgs = []

    dahelpers.walk obj, (args...) ->
      walkArgs.push args

    assert.deepEqual walkArgs, [
      [1, 'a', ['a']]
      [2, 'b', ['b']]
      [3, 'c', ['c']]
      [obj.d, 'd', ['d']]
      [4, 'd.e', ['d', 'e']]
      [5, 'd.f', ['d', 'f']]
    ]

  it 'should treat arrays as simple values', () ->
    obj =
      a: 1
      b: [1, 2, 3]
      c: null

    walkArgs = []

    dahelpers.walk obj, (args...) ->
      walkArgs.push args

    assert.deepEqual walkArgs, [
      [1, 'a', ['a']]
      [[1, 2, 3], 'b', ['b']]
      [null, 'c', ['c']]
    ]

describe '#sweep()', () ->
  it 'should sweep over an object, and create a new one', () ->
    d = new Date(2013, 8, 1)

    obj =
      a: 1
      b: [1,2,3]
      c:
        d: null
        e: d

    obj1 = dahelpers.sweep obj, (args...) ->
      args[0]

    assert.deepEqual obj, obj1

  it 'should create a clone, not return same object', () ->
    obj =
      a: 1
      b:
        c:
          d: 2
          e: 3

    obj1 = dahelpers.sweep obj, (v) -> v
    obj1.b = 2

    assert.deepEqual obj1, {a: 1, b: 2}
    assert.notDeepEqual obj, obj1

  it 'shoud not set any properties that return undefined from cb', () ->
    obj =
      a: 1
      b: 2
      c: 3

    obj1 = dahelpers.sweep obj, () -> return
    assert.deepEqual obj1, {}

describe '#extend()', () ->
  it 'copies properties from other objects', () ->
    obj = a: 1
    obj2 = b: 2
    dahelpers.extend obj, obj2
    assert.equal obj.b, 2

  it 'overwrites existing properties', () ->
    obj = a: 1
    obj1 = a: 2
    dahelpers.extend obj, obj1
    assert.equal obj.a, 2

  it 'should really clone the mixin properties', () ->
    obj = a: 1
    obj1 = b: new Date(2013, 8, 1)
    dahelpers.extend obj, obj1
    obj.b.setFullYear 2020
    assert.notEqual obj.b.getTime(), obj1.b.getTime()

  it 'should be fine with properties with spaces', () ->
    obj =
      'foo .bar baz': 1
    assert.deepEqual dahelpers.extend({}, obj),
      'foo .bar baz': 1

  it 'shold be fine with deep-nested properties', () ->
    obj = a: 1
    obj1 = a: b: c: d: e: 2
    dahelpers.extend obj, obj1
    assert.deepEqual obj, obj1

describe '#clone()', () ->
  it 'should clone objects', () ->
    obj =
      a: 1
      b: true
      c: null
      d:
        e: new Date(2013, 8, 15)
        f: /\d+/g
        g: [1, 2, 3]

    obj1 = dahelpers.clone obj

    assert.equal obj.a, obj1.a
    assert.equal obj.b, obj1.b
    assert.equal obj.c, obj1.c

    assert.notEqual obj.d.e, obj1.d.e  # They are now different Date objects
    assert.equal obj.d.e.getTime(), obj1.d.e.getTime()  # but same time

    assert.notEqual obj.d.f, obj1.d.f  # They are now different RegExp objects
    assert.equal obj.d.f.toString(), obj1.d.f.toString()  # but same regexp

    assert.deepEqual obj.d.g, obj1.d.g

  it 'should make real clones, not just two identical copies', () ->
    obj =
      a: new Date(2013, 8, 15)
    obj1 = dahelpers.clone obj
    obj1.a.setFullYear 2020
    assert.notEqual obj.a.getTime(), obj1.a.getTime()

  it 'should return simple types as is', () ->
    vals = [1, 12.4, true, false, null, 'a', undefined]
    for v in vals
      assert.equal v, dahelpers.clone v

describe '#rekey()', () ->
  it 'should translate object keys', () ->
    obj =
      a: 1
      b: 2
      c:
        d: 3
        e: 4

    map =
      a: 'a.a'
      b: 'a.b'
      'c.d': 'b.a'
      'c.e': 'b.b'

    obj1 = dahelpers.rekey obj, map

    assert.deepEqual obj1,
      a:
        a: 1
        b: 2
      b:
        a: 3
        b: 4

  it 'returns undefined if no arguments are passed', () ->
    assert.equal dahelpers.rekey(), undefined

  it 'returns simple types as is', () ->
    assert.equal dahelpers.rekey(1, a: 'b'), 1

  it 'returns object clones if no map is specified', () ->
    obj =
      a: new Date(2013, 7, 10)

    obj1 = dahelpers.rekey(obj)

    assert.equal obj1.a.getTime(), obj.a.getTime()
    obj1.a.setFullYear 2020
    assert.notEqual obj1.a.getFullYear(), obj.a.getFullYear()

  it 'returns an empty object if map is an empty object', () ->
    assert.deepEqual dahelpers.rekey({a: 1}, {}), {}

describe '#toArray()', () ->
  it 'should convert to array the non-array values', () ->
    assert.deepEqual dahelpers.toArray('foo'), ['foo']
    assert.deepEqual dahelpers.toArray(1), [1]
    assert.deepEqual dahelpers.toArray(true), [true]

  it 'should return empty value for undefined or null', () ->
    assert.deepEqual dahelpers.toArray(), []
    assert.deepEqual dahelpers.toArray(null), []

  it 'should return original if already an array', () ->
    a = [1, 2, 3]
    assert.deepEqual dahelpers.toArray(a), a

describe '#empty()', () ->
  it 'should tell us if array is empty', () ->
    a1 = [1, 2, 3]
    a2 = []
    assert.equal dahelpers.empty(a1), false
    assert.equal dahelpers.empty(a2), true

  it 'should tell us if object is empty', () ->
    o1 = foo: 'bar'
    o2 = {}
    assert.equal dahelpers.empty(o1), false
    assert.equal dahelpers.empty(o2), true

  it 'should tell us if string is empty', () ->
    s1 = 'foo bar'
    s2 = ''
    assert.equal dahelpers.empty(s1), false
    assert.equal dahelpers.empty(s2), true

  it 'should treat anything else as empty', () ->
    assert.equal dahelpers.empty(1), undefined
    assert.equal dahelpers.empty(null), undefined
    assert.equal dahelpers.empty(undefined), undefined
    assert.equal dahelpers.empty(true), undefined
    assert.equal dahelpers.empty(false), undefined

describe '#truth()', () ->
  it 'should return true for values that we consider true', () ->
    assertTrue = (v) ->
      assert.equal dahelpers.truth(v), true, "#{v}, #{h.type(v)}"
    ((v) ->
      assertTrue v
    ) v for v in [1, 'foo', [1,2,3], {foo: 'bar'}, true, new Date(), (() ->)]

  it 'should return false for values that we consider false', () ->
    assertFalse = (v) ->
      assert.equal dahelpers.truth(v), false, "#{v}, #{h.type(v)}"
    ((v) ->
      assertFalse v
    ) v for v in [0, null, undefined, '', [], {}, false]


describe 'tag aliases', () ->
  it 'will render appropriate tags', () ->
    tags = 'a p strong em ul ol li div span button option'.split ' '

    for tag in tags
      s = h[tag]()
      assert.equal s, "<#{tag}></#{tag}>", tag
    return

  it 'accepts the same arguments as #tag()', () ->
    tags = 'a p strong em ul ol li div span button option'.split ' '

    for tag in tags
      s = h[tag]('foo', foo: 'bar')
      assert.equal s, "<#{tag} foo=\"bar\">foo</#{tag}>", tag
    return
