// Generated by CoffeeScript 1.6.3
var assert, chai, dahelpers, h,
  __slice = [].slice;

if (typeof require !== "undefined" && require !== null) {
  dahelpers = require('../dahelpers');
  chai = require('chai');
}

assert = chai.assert;

h = dahelpers;

describe('#type()', function() {
  it('reveals types of things', function() {
    var assertType;
    assertType = function(v, t) {
      return assert.equal(dahelpers.type(v), t);
    };
    assertType(null, 'null');
    assertType(void 0, 'undefined');
    assertType(1, 'number');
    assertType('foo', 'string');
    assertType(new Date(), 'date');
    assertType(/\d+/g, 'regexp');
    assertType(true, 'boolean');
    assertType([1, 2, 3], 'array');
    assertType({
      foo: 'bar'
    }, 'object');
    assertType((function() {}), 'function');
    return (function(somethingUndefined) {
      return assertType(somethingUndefined, 'undefined');
    })();
  });
  return it('returns boolean result of type test if second arg is supplied', function() {
    var assertType;
    assertType = function(v, t) {
      return assert.ok(dahelpers.type(v, t));
    };
    assertType(null, 'null');
    assertType(void 0, 'undefined');
    assertType(1, 'number');
    assertType('foo', 'string');
    assertType(new Date(), 'date');
    assertType(/\d+/g, 'regexp');
    assertType(true, 'boolean');
    assertType([1, 2, 3], 'array');
    assertType({
      foo: 'bar'
    }, 'object');
    assertType((function() {}), 'function');
    return (function(somethingUndefined) {
      return assertType(somethingUndefined, 'undefined');
    })();
  });
});

describe('#klass()', function() {
  it('reveals the object constructor', function() {
    var Foo, assertKlass;
    assertKlass = function(v, k) {
      return assert.equal(dahelpers.klass(v), k);
    };
    Foo = (function() {
      function Foo() {}

      return Foo;

    })();
    assertKlass({}, Object);
    assertKlass(new Date(), Date);
    assertKlass(new RegExp(), RegExp);
    assertKlass(new String(), String);
    assertKlass(new Foo(), Foo);
    assertKlass(new Array, Array);
    assertKlass([], Array);
    assertKlass(null, false);
    assertKlass(void 0, false);
    assertKlass(1, false);
    assertKlass('foo', false);
    return assertKlass(true, false);
  });
  return it('returns boolean result of klass check if second arg is supplied', function() {
    var Foo, assertKlass;
    assertKlass = function(v, k) {
      return assert.ok(dahelpers.klass(v, k));
    };
    Foo = (function() {
      function Foo() {}

      return Foo;

    })();
    assertKlass({}, Object);
    assertKlass(new Date(), Date);
    assertKlass(new RegExp(), RegExp);
    assertKlass(new String(), String);
    assertKlass(new Foo(), Foo);
    assertKlass(new Array, Array);
    return assertKlass([], Array);
  });
});

describe('#objAttrs()', function() {
  it('converts objects to HTML attributes', function() {
    var s;
    s = h.objAttrs({
      'class': 'active',
      href: 'http://www.example.com/'
    });
    return assert.equal(s, 'class="active" href="http://www.example.com/"');
  });
  it('returns empty string if object is empty', function() {
    var s;
    s = h.objAttrs({});
    return assert.equal(s, '');
  });
  return it('returns empty string if there are no arguments', function() {
    var s;
    s = h.objAttrs();
    return assert.equal(s, '');
  });
});

describe('#tag()', function() {
  it('returns HTML for a tag', function() {
    var s;
    s = h.tag('a');
    return assert.equal(s, '<a></a>');
  });
  it('returns a tag with content if we specify it', function() {
    var s;
    s = h.tag('a', 'click here');
    return assert.equal(s, '<a>click here</a>');
  });
  it('returns a tag with attributes if specified', function() {
    var s;
    s = h.tag('a', null, {
      href: 'http://example.com/'
    });
    return assert.equal(s, '<a href="http://example.com/"></a>');
  });
  it('will suppress output if `silent` argument is passed', function() {
    var s;
    s = h.tag('a', null, {
      href: 'http://example.com/'
    }, true);
    return assert.equal(s, '');
  });
  return it('will return empty string if no arguments', function() {
    var s;
    s = h.tag();
    return assert.equal(s, '');
  });
});

describe('#escape()', function() {
  it('should escape special HTML chars', function() {
    return assert.equal(dahelpers.escape('<&"\'/>'), '&lt;&amp;&quot;&#x27;&#x2F;&gt;');
  });
  return it('should leave all other chars intact', function() {
    var input, out;
    input = '<a href="#">not so malicious HTML</a>';
    out = '&lt;a href=&quot;#&quot;&gt;not so malicious HTML&lt;&#x2F;a&gt;';
    return assert.equal(dahelpers.escape(input), out);
  });
});

describe('#plural()', function() {
  it('will return plural with number greater than 1', function() {
    var s;
    s = h.plural('foo', 'foos', 2);
    return assert.equal(s, 'foos');
  });
  it('will return a singular when count 1', function() {
    var s;
    s = h.plural('foo', 'foos', 1);
    return assert.equal(s, 'foo');
  });
  it('will return different plural if specified', function() {
    var s;
    s = h.plural('foo', 'bar', 2);
    return assert.equal(s, 'bar');
  });
  it('will not return the plural form if count is 1', function() {
    var s;
    s = h.plural('foo', 'bar', 1);
    return assert.equal(s, 'foo');
  });
  return it('will return an empty string if there are no arguments', function() {
    var s;
    s = h.plural();
    return assert.equal(s, '');
  });
});

describe('#capitalize()', function() {
  it('will capitalize the first letter', function() {
    var s;
    s = h.capitalize('foo');
    return assert.equal(s, 'Foo');
  });
  it('will do nothing when text is all caps', function() {
    var s;
    s = h.capitalize('FOO');
    return assert.equal(s, 'FOO');
  });
  return it('will return an empty string if no arguments are passed', function() {
    var s;
    s = h.capitalize();
    return assert.equal(s, '');
  });
});

describe('#titleCase()', function() {
  it('will Title Case a string', function() {
    var s;
    s = h.titleCase('foo bar');
    return assert.equal(s, 'Foo Bar');
  });
  it('will do nothing if all-caps', function() {
    var s;
    s = h.titleCase('FOO BAR');
    return assert.equal(s, 'FOO BAR');
  });
  it('will capitalize words even if mixed case', function() {
    var s;
    s = h.titleCase('fOO bAR');
    return assert.equal(s, 'FOO BAR');
  });
  it('will lower-case everything if told to', function() {
    var s;
    s = h.titleCase('FOO BAR', true);
    return assert.equal(s, 'Foo Bar');
  });
  return it('will return an empty string if no arguments are passed', function() {
    var s;
    s = h.titleCase();
    return assert.equal(s, '');
  });
});

describe('#format()', function() {
  it('will reformat a string or number using format string', function() {
    var s;
    s = h.format(123456, '## ## ##');
    return assert.equal(s, '12 34 56');
  });
  it("will retain pound characters if source hasn't enough characters", function() {
    var s;
    s = h.format(12, '###');
    return assert.equal(s, '12#');
  });
  it('will omit characters if not enough pound characters', function() {
    var s;
    s = h.format(123, '##');
    return assert.equal(s, '12');
  });
  it('will return original value if no format is specified', function() {
    var s;
    s = h.format(123);
    return assert.equal(s, '123');
  });
  it('can use a different format character', function() {
    var s;
    s = h.format(123, '$$/$', '$');
    return assert.equal(s, '12/3');
  });
  return it('will output an empty string if there are no arguments', function() {
    var s;
    s = h.format();
    return assert.equal(s, '');
  });
});

describe('#reverse()', function() {
  it('will reverse a string', function() {
    var s;
    s = h.reverse('esrever');
    return assert.equal(s, 'reverse');
  });
  return it('will return an empty string if no arguments', function() {
    var s;
    s = h.reverse();
    return assert.equal(s, '');
  });
});

describe('#sgroup()', function() {
  it('will group characters into strings of given length', function() {
    var a;
    a = h.sgroup('123456', 2);
    return assert.deepEqual(a, ['12', '34', '56']);
  });
  it('will return a partial last group if not enough characters', function() {
    var a;
    a = h.sgroup('12345', 2);
    return assert.deepEqual(a, ['12', '34', '5']);
  });
  it('will return the original string as one group if no length', function() {
    var a;
    a = h.sgroup('12345');
    return assert.deepEqual(a, ['12345']);
  });
  it('will return original string as one group if n is 0', function() {
    var a;
    a = h.sgroup('12345', 0);
    return assert.deepEqual(a, ['12345']);
  });
  it('will return original string as one group if too short', function() {
    var a;
    a = h.sgroup('1', 2);
    return assert.deepEqual(a, ['1']);
  });
  it('will return empty array given no arguments', function() {
    var a;
    a = h.sgroup();
    return assert.deepEqual(a, []);
  });
  return it('will return an empty array if string is empty', function() {
    var a;
    a = h.sgroup('');
    return assert.deepEqual(a, []);
  });
});

describe('#pad()', function() {
  it('should pad a number with leading characters', function() {
    var s;
    s = h.pad(123, 4);
    return assert.equal(s, '0123');
  });
  it('should not pad if length is 0', function() {
    var s;
    s = h.pad(123, 0);
    return assert.equal(s, '123');
  });
  it('should pad a number with different character if told to', function() {
    var s;
    s = h.pad(123, 5, '%');
    return assert.equal(s, '%%123');
  });
  it('should keep the original string if given length is shorter', function() {
    var s;
    s = h.pad(123, 1);
    return assert.equal(s, '123');
  });
  it('should pad the tail if tail is specified', function() {
    var s;
    s = h.pad(123.12, 5, null, 4);
    return assert.equal(s, '00123.1200');
  });
  it('should use a different separator for tail if specified', function() {
    var s;
    s = h.pad('123,12', 5, null, 4, ',');
    return assert.equal(s, '00123,1200');
  });
  it('should pad the tail even if head length is 0', function() {
    var s;
    s = h.pad(123.12, 0, null, 4);
    return assert.equal(s, '123.1200');
  });
  it('should be able to pad anything really', function() {
    var s;
    s = h.pad('foo-bar', 6, '!', 6, '-');
    return assert.equal(s, '!!!foo-bar!!!');
  });
  it('should remove tail if tail is 0', function() {
    var s;
    s = h.pad('123.12', 4, null, 0);
    return assert.equal(s, '0123');
  });
  return it('shold return an empty string if no arguments are passed', function() {
    var s;
    s = h.pad();
    return assert.equal(s, '');
  });
});

describe('#round()', function() {
  it('should round numbers', function() {
    var n;
    n = h.round(1.2345, 3);
    return assert.equal(n, 1.235);
  });
  it('should round to 0 digits by default', function() {
    var n;
    n = h.round(1.2345);
    return assert.equal(n, 1);
  });
  it('should parse numbers from strings', function() {
    var n;
    n = h.round('1.234', 2);
    return assert.equal(n, 1.23);
  });
  return it('should return 0 if input is not numeric', function() {
    var n;
    n = h.round('foo');
    return assert.equal(n, 0);
  });
});

describe('#thousands()', function() {
  it('will add thousands separator to a number', function() {
    var s;
    s = h.thousands(1000);
    return assert.equal(s, '1,000');
  });
  it('should handle situation where first digit is on thousand boundary', function() {
    var s;
    s = h.thousands(100000);
    return assert.equal(s, '100,000');
  });
  it('should work with many zeros', function() {
    var s;
    s = h.thousands(100000000000);
    return assert.equal(s, '100,000,000,000');
  });
  it('should handle floats', function() {
    var s;
    s = h.thousands(100000.12);
    return assert.equal(s, '100,000.12');
  });
  it('should handle floats with many digits', function() {
    var s;
    s = h.thousands(100000.123456);
    return assert.equal(s, '100,000.123456');
  });
  it('strips non-digit charracters', function() {
    var s;
    s = h.thousands('A hundred thousands is 100000');
    return assert.equal(s, '100,000');
  });
  it('will use a different separator if one is given', function() {
    var s;
    s = h.thousands(1000, "'");
    return assert.equal(s, "1'000");
  });
  it('will use a different decimal separator if one is given', function() {
    var s;
    s = h.thousands(1000.123, '.', ',');
    return assert.equal(s, '1.000,123');
  });
  it('should play nice with negative numbers', function() {
    var s;
    s = h.thousands(-12000);
    return assert.equal(s, '-12,000');
  });
  return it('should return an empty string if passed no argument', function() {
    var s;
    s = h.thousands();
    return assert.equal(s, '');
  });
});

describe('#si()', function() {
  it('will suffix k for thousands', function() {
    var s;
    s = h.si(1000);
    return assert.equal(s, '1k');
  });
  it('will suffix M for millions', function() {
    var s;
    s = h.si(1000000);
    return assert.equal(s, '1M');
  });
  it('will suffix G for billions', function() {
    var s;
    s = h.si(1000000000);
    return assert.equal(s, '1G');
  });
  it('will suffix T for trillions', function() {
    var s;
    s = h.si(1000000000000);
    return assert.equal(s, '1T');
  });
  it('will suffix P for quadrillions', function() {
    var s;
    s = h.si(1000000000000000);
    return assert.equal(s, '1P');
  });
  it('will suffix E for quintillions', function() {
    var s;
    s = h.si(1000000000000000000);
    return assert.equal(s, '1E');
  });
  it('will suffix Z for sextillions', function() {
    var s;
    s = h.si(1000000000000000000000);
    return assert.equal(s, '1Z');
  });
  it('will degrade to lower thousand if not a whole thousand', function() {
    var s;
    s = h.si(1100);
    assert.equal(s, '1100');
    s = h.si(1100000);
    assert.equal(s, '1100k');
    s = h.si(1100000000);
    return assert.equal(s, '1100M');
  });
  it('will provide a float if number of decimal places are specified', function() {
    var s;
    s = h.si(1100, 1);
    return assert.equal(s, '1.1k');
  });
  it('will still go down a thousand if not enough decimal places', function() {
    var s;
    s = h.si(1110, 1);
    assert.equal(s, '1110');
    s = h.si(1110, 2);
    return assert.equal(s, '1.11k');
  });
  it('supports unlimited decimal places', function() {
    var s;
    s = h.si(1234560000);
    assert.equal(s, '1234560k');
    s = h.si(1234560000, 5);
    return assert.equal(s, '1.23456G');
  });
  it('should play nice with negative numbers', function() {
    var s;
    s = h.si(-1200000, 1);
    return assert.equal(s, '-1.2M');
  });
  it('should add thousands separators if told to', function() {
    var s;
    s = h.si(12401000, 1, true);
    return assert.equal(s, '12,401k');
  });
  it('should use a thousands separator specified', function() {
    var s;
    s = h.si(12401000, 1, true, "'");
    return assert.equal(s, "12'401k");
  });
  it('should use a different decimal separator if told to', function() {
    var s;
    s = h.si(12401200, 1, true, '.', ',');
    return assert.equal(s, '12.401,2k');
  });
  return it('will return an empty string if provided no arguments', function() {
    var s;
    s = h.si();
    return assert.equal(s, '');
  });
});

describe('#digits()', function() {
  it('will return only the digits from a string', function() {
    var s;
    s = h.digits('a1b2c3d4 5-6#7');
    return assert.equal(s, '1234567');
  });
  return it('will return an empty string if given no arguments', function() {
    var s;
    s = h.digits();
    return assert.equal(s, '');
  });
});

describe('#prefix()', function() {
  it('should add specified prefix to a number', function() {
    return assert.equal(h.prefix(12, '$'), '$12');
  });
  it('should add minus in front of prefix if number is negative', function() {
    return assert.equal(h.prefix(-12, '$'), '-$12');
  });
  it('should separate long prefix from number', function() {
    assert.equal(h.prefix(12, 'USD', true), 'USD 12');
    return assert.equal(h.prefix(-12, 'USD', true), 'USD -12');
  });
  return it('should not care if number is a number or not', function() {
    assert.equal(h.prefix('abc', '$'), '$abc');
    return assert.equal(h.prefix('-abc', '$'), '-$abc');
  });
});

describe('#currency()', function() {
  it('should work fine with defaults', function() {
    var s;
    s = h.currency(12);
    return assert.equal(s, '$12.00');
  });
  it('should add thousands separators', function() {
    var s;
    s = h.currency(1200);
    return assert.equal(s, '$1,200.00');
  });
  it('should use any currency we tell it to', function() {
    var s;
    s = h.currency(1200, 'USD');
    return assert.equal(s, 'USD 1,200.00');
  });
  it('should round to number of decimals', function() {
    var s;
    s = h.currency(1200.55, null, 1);
    return assert.equal(s, '$1,200.6');
  });
  it('should play nice with negative numbers', function() {
    var s;
    s = h.currency(-1200);
    return assert.equal(s, '-$1,200.00');
  });
  it('should use different separators if told to', function() {
    var s;
    s = h.currency(1200, null, null, "'", ';');
    return assert.equal(s, "$1'200;00");
  });
  it('should use SI suffixes if told to', function() {
    var s;
    s = h.currency(1200, null, null, null, null, true);
    return assert.equal(s, "$1.2k");
  });
  it('should play nice with string input', function() {
    var s;
    s = h.currency('1200');
    return assert.equal(s, '$1,200.00');
  });
  it('should suffix the currency if we tell it to', function() {
    var s;
    s = h.currency(1200, null, null, null, null, null, true);
    return assert.equal(s, '1,200.00 $');
  });
  it('should only use the integer part if decimal digits is 0', function() {
    var s;
    s = h.currency(123.12, null, 0);
    return assert.equal(s, '$123');
  });
  return it('should return 0 if no input', function() {
    var s;
    s = h.currency();
    return assert.equal(s, '$0.00');
  });
});

describe('#makeCurrency()', function() {
  return it('should create me a custom currency', function() {
    var currencyArgs, originalCurrency;
    originalCurrency = h.currency;
    currencyArgs = null;
    h.currency = function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return currencyArgs = args;
    };
    h.makeCurrency('din', 'Din', 2, '.', ',', false, true);
    h._din(1000);
    assert.deepEqual(currencyArgs, [1000, 'Din', 2, '.', ',', false, true]);
    return h.currency = originalCurrency;
  });
});

describe('#wrap()', function() {
  it('should wrap long lines', function() {
    var output, s, text;
    text = "This is a longer piece of text that needs to be wrapped. It\ncontains no linebreaks, though.".replace('\n', ' ');
    output = "This is a longer\npiece of text that\nneeds to be wrapped.\nIt contains no\nlinebreaks, though.";
    s = h.wrap(text, 20);
    return assert.equal(s, output);
  });
  return it('returns empty string if no output is given', function() {
    var s;
    s = h.wrap();
    return assert.equal(s, '');
  });
});

describe('#slug()', function() {
  it('should convert text to slug', function() {
    var s;
    s = h.slug("This is some text, and it's got some non-word characters");
    return assert.equal(s, 'this-is-some-text-and-it-s-got-some-non-word-characters');
  });
  it('should keep numbers and underscores', function() {
    var s;
    s = h.slug("This is text containing numbers 1, 2, and 3, and _ character");
    return assert.equal(s, 'this-is-text-containing-numbers-1-2-and-3-and-_-character');
  });
  it('strips leading and trailing underscores and dashes', function() {
    var s;
    s = h.slug('### boo ###');
    assert.equal(s, 'boo');
    s = h.slug('___ boo ___');
    return assert.equal(s, 'boo');
  });
  return it('returns empty string if no argument is given', function() {
    var s;
    s = h.slug();
    return assert.equal(s, '');
  });
});

describe('#props()', function() {
  it('should retrieve a property tree', function() {
    var obj, v;
    obj = {
      a: {
        b: {
          c: {
            d: 1
          }
        }
      }
    };
    v = h.props(obj, 'a.b.c.d');
    return assert.equal(v, 1);
  });
  it('should return undefined if at least one segment is undefined', function() {
    var obj, v;
    obj = {
      a: {
        b: {
          c: {
            d: 1
          }
        }
      }
    };
    v = h.props(obj, 'a.b.foo.d');
    return assert.equal(v, void 0);
  });
  it('should return original object if `p` is not passed', function() {
    var obj, v;
    obj = 'foo';
    v = h.props(obj);
    return assert.equal(v, obj);
  });
  return it('should return undefined if object is not passed', function() {
    var v;
    v = h.props();
    return assert.equal(v, void 0);
  });
});

describe('#propset()', function() {
  it('should set a property tree and assign a value to the leaf', function() {
    var obj;
    obj = {};
    h.propset(obj, 'foo.bar.baz', 1);
    return assert.deepEqual(obj, {
      foo: {
        bar: {
          baz: 1
        }
      }
    });
  });
  it('should also accept funky property names', function() {
    var obj;
    obj = {};
    h.propset(obj, 'foo.This is totally funky!.bar', 1);
    return assert.deepEqual(obj, {
      foo: {
        'This is totally funky!': {
          bar: 1
        }
      }
    });
  });
  it('should overwrite existing properties', function() {
    var obj;
    obj = {
      foo: {
        bar: {
          baz: 1
        }
      }
    };
    h.propset(obj, 'foo.bar.baz', 2);
    return assert.equal(obj.foo.bar.baz, 2);
  });
  return it('should be chainable', function() {
    var obj;
    obj = {};
    h.propset(h.propset(obj, 'foo.bar', 2), 'foo.baz', 3);
    return assert.deepEqual(obj, {
      foo: {
        bar: 2,
        baz: 3
      }
    });
  });
});

describe('#walk()', function() {
  it('should access all properties of an object exactly once', function() {
    var obj, walkArgs;
    obj = {
      a: 1,
      b: 2,
      c: 3,
      d: {
        e: 4,
        f: 5
      }
    };
    walkArgs = [];
    dahelpers.walk(obj, function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return walkArgs.push(args);
    });
    return assert.deepEqual(walkArgs, [[1, 'a'], [2, 'b'], [3, 'c'], [obj.d, 'd'], [4, 'd.e'], [5, 'd.f']]);
  });
  return it('should treat arrays as simple values', function() {
    var obj, walkArgs;
    obj = {
      a: 1,
      b: [1, 2, 3],
      c: null
    };
    walkArgs = [];
    dahelpers.walk(obj, function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return walkArgs.push(args);
    });
    return assert.deepEqual(walkArgs, [[1, 'a'], [[1, 2, 3], 'b'], [null, 'c']]);
  });
});

describe('#sweep()', function() {
  it('should sweep over an object, and create a new one', function() {
    var d, obj, obj1;
    d = new Date(2013, 8, 1);
    obj = {
      a: 1,
      b: [1, 2, 3],
      c: {
        d: null,
        e: d
      }
    };
    obj1 = dahelpers.sweep(obj, function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return args[0];
    });
    return assert.deepEqual(obj, obj1);
  });
  it('should create a clone, not return same object', function() {
    var obj, obj1;
    obj = {
      a: 1,
      b: {
        c: {
          d: 2,
          e: 3
        }
      }
    };
    obj1 = dahelpers.sweep(obj, function(v) {
      return v;
    });
    obj1.b = 2;
    assert.deepEqual(obj1, {
      a: 1,
      b: 2
    });
    return assert.notDeepEqual(obj, obj1);
  });
  return it('shoud not set any properties that return undefined from cb', function() {
    var obj, obj1;
    obj = {
      a: 1,
      b: 2,
      c: 3
    };
    obj1 = dahelpers.sweep(obj, function() {});
    return assert.deepEqual(obj1, {});
  });
});

describe('#extend()', function() {
  it('copies properties from other objects', function() {
    var obj, obj2;
    obj = {
      a: 1
    };
    obj2 = {
      b: 2
    };
    dahelpers.extend(obj, obj2);
    return assert.equal(obj.b, 2);
  });
  it('overwrites existing properties', function() {
    var obj, obj1;
    obj = {
      a: 1
    };
    obj1 = {
      a: 2
    };
    dahelpers.extend(obj, obj1);
    return assert.equal(obj.a, 2);
  });
  it('should really clone the mixin properties', function() {
    var obj, obj1;
    obj = {
      a: 1
    };
    obj1 = {
      b: new Date(2013, 8, 1)
    };
    dahelpers.extend(obj, obj1);
    obj.b.setFullYear(2020);
    return assert.notEqual(obj.b.getTime(), obj1.b.getTime());
  });
  return it('shold be fine with deep-nested properties', function() {
    var obj, obj1;
    obj = {
      a: 1
    };
    obj1 = {
      a: {
        b: {
          c: {
            d: {
              e: 2
            }
          }
        }
      }
    };
    dahelpers.extend(obj, obj1);
    return assert.deepEqual(obj, obj1);
  });
});

describe('#clone()', function() {
  it('should clone objects', function() {
    var obj, obj1;
    obj = {
      a: 1,
      b: true,
      c: null,
      d: {
        e: new Date(2013, 8, 15),
        f: /\d+/g,
        g: [1, 2, 3]
      }
    };
    obj1 = dahelpers.clone(obj);
    assert.equal(obj.a, obj1.a);
    assert.equal(obj.b, obj1.b);
    assert.equal(obj.c, obj1.c);
    assert.notEqual(obj.d.e, obj1.d.e);
    assert.equal(obj.d.e.getTime(), obj1.d.e.getTime());
    assert.notEqual(obj.d.f, obj1.d.f);
    assert.equal(obj.d.f.toString(), obj1.d.f.toString());
    return assert.deepEqual(obj.d.g, obj1.d.g);
  });
  it('should make real clones, not just two identical copies', function() {
    var obj, obj1;
    obj = {
      a: new Date(2013, 8, 15)
    };
    obj1 = dahelpers.clone(obj);
    obj1.a.setFullYear(2020);
    return assert.notEqual(obj.a.getTime(), obj1.a.getTime());
  });
  return it('should return simple types as is', function() {
    var v, vals, _i, _len, _results;
    vals = [1, 12.4, true, false, null, 'a', void 0];
    _results = [];
    for (_i = 0, _len = vals.length; _i < _len; _i++) {
      v = vals[_i];
      _results.push(assert.equal(v, dahelpers.clone(v)));
    }
    return _results;
  });
});

describe('#rekey()', function() {
  it('should translate object keys', function() {
    var map, obj, obj1;
    obj = {
      a: 1,
      b: 2,
      c: {
        d: 3,
        e: 4
      }
    };
    map = {
      a: 'a.a',
      b: 'a.b',
      'c.d': 'b.a',
      'c.e': 'b.b'
    };
    obj1 = dahelpers.rekey(obj, map);
    return assert.deepEqual(obj1, {
      a: {
        a: 1,
        b: 2
      },
      b: {
        a: 3,
        b: 4
      }
    });
  });
  it('returns undefined if no arguments are passed', function() {
    return assert.equal(dahelpers.rekey(), void 0);
  });
  it('returns simple types as is', function() {
    return assert.equal(dahelpers.rekey(1, {
      a: 'b'
    }), 1);
  });
  it('returns object clones if no map is specified', function() {
    var obj, obj1;
    obj = {
      a: new Date(2013, 7, 10)
    };
    obj1 = dahelpers.rekey(obj);
    assert.equal(obj1.a.getTime(), obj.a.getTime());
    obj1.a.setFullYear(2020);
    return assert.notEqual(obj1.a.getFullYear(), obj.a.getFullYear());
  });
  return it('returns an empty object if map is an empty object', function() {
    return assert.deepEqual(dahelpers.rekey({
      a: 1
    }, {}), {});
  });
});

describe('#toArray()', function() {
  it('should convert to array the non-array values', function() {
    assert.deepEqual(dahelpers.toArray('foo'), ['foo']);
    assert.deepEqual(dahelpers.toArray(1), [1]);
    return assert.deepEqual(dahelpers.toArray(true), [true]);
  });
  it('should return empty value for undefined or null', function() {
    assert.deepEqual(dahelpers.toArray(), []);
    return assert.deepEqual(dahelpers.toArray(null), []);
  });
  return it('should return original if already an array', function() {
    var a;
    a = [1, 2, 3];
    return assert.deepEqual(dahelpers.toArray(a), a);
  });
});

describe('#empty()', function() {
  it('should tell us if array is empty', function() {
    var a1, a2;
    a1 = [1, 2, 3];
    a2 = [];
    assert.equal(dahelpers.empty(a1), false);
    return assert.equal(dahelpers.empty(a2), true);
  });
  it('should tell us if object is empty', function() {
    var o1, o2;
    o1 = {
      foo: 'bar'
    };
    o2 = {};
    assert.equal(dahelpers.empty(o1), false);
    return assert.equal(dahelpers.empty(o2), true);
  });
  it('should tell us if string is empty', function() {
    var s1, s2;
    s1 = 'foo bar';
    s2 = '';
    assert.equal(dahelpers.empty(s1), false);
    return assert.equal(dahelpers.empty(s2), true);
  });
  return it('should treat anything else as empty', function() {
    assert.equal(dahelpers.empty(1), void 0);
    assert.equal(dahelpers.empty(null), void 0);
    assert.equal(dahelpers.empty(void 0), void 0);
    assert.equal(dahelpers.empty(true), void 0);
    return assert.equal(dahelpers.empty(false), void 0);
  });
});

describe('#truth()', function() {
  it('should return true for values that we consider true', function() {
    var assertTrue, v, _i, _len, _ref, _results;
    assertTrue = function(v) {
      return assert.equal(dahelpers.truth(v), true, "" + v + ", " + (h.type(v)));
    };
    _ref = [
      1, 'foo', [1, 2, 3], {
        foo: 'bar'
      }, true, new Date(), (function() {})
    ];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      _results.push((function(v) {
        return assertTrue(v);
      })(v));
    }
    return _results;
  });
  return it('should return false for values that we consider false', function() {
    var assertFalse, v, _i, _len, _ref, _results;
    assertFalse = function(v) {
      return assert.equal(dahelpers.truth(v), false, "" + v + ", " + (h.type(v)));
    };
    _ref = [0, null, void 0, '', [], {}, false];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      v = _ref[_i];
      _results.push((function(v) {
        return assertFalse(v);
      })(v));
    }
    return _results;
  });
});

describe('tag aliases', function() {
  it('will render appropriate tags', function() {
    var s, tag, tags, _i, _len;
    tags = 'a p strong em ul ol li div span'.split(' ');
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      s = h[tag]();
      assert.equal(s, "<" + tag + "></" + tag + ">");
    }
  });
  return it('accepts the same arguments as #tag()', function() {
    var s, tag, tags, _i, _len;
    tags = 'a p strong em ul ol li div span'.split(' ');
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      s = h[tag]('foo', {
        foo: 'bar'
      });
      assert.equal(s, "<" + tag + " foo=\"bar\">foo</" + tag + ">");
    }
  });
});
