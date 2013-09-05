// Generated by CoffeeScript 1.6.3
/*!
@author Branko Vukelic <branko@brankovukelic.com>
@license MIT
*/

var define,
  __slice = [].slice;

define = (function(root) {
  if (typeof root.define === 'function' && root.define.amd) {
    return root.define;
  } else {
    if (typeof module === 'object' && module.exports) {
      return function(factory) {
        return module.exports = factory();
      };
    } else {
      return function(factory) {
        return root.dahelpers = factory();
      };
    }
  }
})(this);

define(function() {
  var h, pad;
  h = {
    USD: '$',
    EUR: '€',
    YN: '¥',
    GBP: '£',
    DEFAULT_CURRENCY: '$',
    FIRST_CHAR: /\b[a-z]/gi,
    WRAP_WIDTH: 79,
    FORMAT_CHARACTER: '#',
    PLURAL_RULES: function(n) {
      if (n === 1) {
        return 0;
      } else {
        return 1;
      }
    },
    objAttrs: function(o) {
      var attrs, key;
      attrs = [];
      for (key in o) {
        if (o[key]) {
          attrs.push("" + key + "=\"" + (o[key].replace(/"/g, '\\"')) + "\"");
        }
      }
      return attrs.join(' ');
    },
    tag: function(name, content, attrs, silence) {
      var s;
      if (content == null) {
        content = '';
      }
      if (attrs == null) {
        attrs = null;
      }
      if (silence == null) {
        silence = false;
      }
      if (!name) {
        return '';
      }
      if (silence && ((content == null) || content.toString() === '')) {
        return '';
      }
      s = "<" + name;
      if (attrs) {
        s += " " + (h.objAttrs(attrs));
      }
      s += ">" + content + "</" + name + ">";
      return s;
    },
    plural: function() {
      var args, count, forms;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      if (!args.length || args.length < 3) {
        return '';
      }
      count = args.pop();
      forms = args;
      return forms[h.PLURAL_RULES(count)];
    },
    capitalize: function(s) {
      if (!s) {
        return '';
      }
      return "" + (s[0].toUpperCase()) + s.slice(1);
    },
    titleCase: function(s, lowerFirst) {
      if (lowerFirst == null) {
        lowerFirst = false;
      }
      if (!s) {
        return '';
      }
      if (lowerFirst) {
        s = s.toLowerCase();
      }
      return s.replace(h.FIRST_CHAR, function(match) {
        return h.capitalize(match);
      });
    },
    format: function(s, format, formatChar) {
      var chr, _i, _len;
      if (formatChar == null) {
        formatChar = h.FORMAT_CHARACTER;
      }
      if (!s) {
        return '';
      }
      s = '' + s;
      if (!format) {
        return s;
      }
      s = s.split('');
      for (_i = 0, _len = s.length; _i < _len; _i++) {
        chr = s[_i];
        format = format.replace(formatChar, chr);
      }
      return format;
    },
    reverse: function(s) {
      if (s) {
        return s.split('').reverse().join('');
      } else {
        return '';
      }
    },
    sgroup: function(s, n) {
      var m;
      if ((s == null) || s === '') {
        return [];
      }
      s = s.toString();
      if (!n) {
        return [s];
      }
      m = s.match(new RegExp("(.{1," + n + "})", 'g'));
      return m;
    },
    pad: pad = function(s, len, char, tail, sep) {
      var t, _ref;
      if (char == null) {
        char = '0';
      }
      if (tail == null) {
        tail = false;
      }
      if (sep == null) {
        sep = '.';
      }
      if (s != null) {
        s = s.toString();
      } else {
        return '';
      }
      if (tail === false) {
        if (s.length < len) {
          return ((new Array(len)).join(char) + s).slice(-len);
        } else {
          return s;
        }
      } else {
        _ref = s.toString().split(sep), s = _ref[0], t = _ref[1];
        if (tail === false) {
          return pad(s, len, char);
        } else {
          s = pad(s, len, char);
          t || (t = char);
          t = pad(h.reverse(t), tail, char);
          t = h.reverse(t);
          return [s, t].join(sep);
        }
      }
    },
    thousands: function(num, sep, decSep) {
      var frac, _ref;
      if (sep == null) {
        sep = ',';
      }
      if (decSep == null) {
        decSep = '.';
      }
      num = num.toString();
      num = num.replace(/[^\d\.-]/g, '');
      num = parseFloat(num);
      if (isNaN(num)) {
        return '';
      }
      _ref = num.toString().split('.'), num = _ref[0], frac = _ref[1];
      num = h.reverse(num);
      num = h.sgroup(num, 3).join(sep);
      num = h.reverse(num);
      if (frac) {
        num = "" + num + decSep + frac;
      }
      return num;
    },
    si: function(num, d, thousands, sep, decSep) {
      var adjustment, factor, idx, unit, units, _i, _len;
      if (d == null) {
        d = 0;
      }
      if (thousands == null) {
        thousands = false;
      }
      if (sep == null) {
        sep = ",";
      }
      if (decSep == null) {
        decSep = '.';
      }
      if (num == null) {
        return '';
      }
      units = 'kMGTPEZ'.split('');
      units.unshift('');
      adjustment = Math.pow(10, d);
      num = num * adjustment;
      factor = 0;
      for (idx = _i = 0, _len = units.length; _i < _len; idx = ++_i) {
        unit = units[idx];
        if (num % 1000) {
          num = num / adjustment;
          if (thousands) {
            num = h.thousands(num, sep, decSep);
          } else {
            num = num.toString().replace('.', decSep);
          }
          return "" + num + unit;
        } else {
          num = num / 1000;
        }
      }
    },
    digits: function(s) {
      if (s == null) {
        return '';
      }
      return s.toString().replace(/[^\d]/g, '');
    },
    prefix: function(num, prefix, sepLong) {
      if (sepLong == null) {
        sepLong = false;
      }
      if (num == null) {
        return '';
      }
      num = num.toString();
      if (!prefix && !prefix.length) {
        return num;
      }
      if (prefix.length > 1 && sepLong) {
        return "" + prefix + " " + num;
      }
      if (num[0] === '-') {
        return "-" + prefix + num.slice(1);
      } else {
        return "" + prefix + num;
      }
    },
    round: function(num, d) {
      if (d == null) {
        d = 0;
      }
      num = parseFloat(num);
      if (isNaN(num)) {
        return 0;
      }
      return Math.round(num * Math.pow(10, d)) / Math.pow(10, d);
    },
    currency: function(num, currency, dec, sep, decSep, si, suffix) {
      if (currency == null) {
        currency = h.DEFAULT_CURRENCY;
      }
      if (dec == null) {
        dec = 2;
      }
      if (sep == null) {
        sep = ',';
      }
      if (decSep == null) {
        decSep = '.';
      }
      if (si == null) {
        si = false;
      }
      if (suffix == null) {
        suffix = false;
      }
      if (si) {
        num = h.si(num, dec, true, sep, decSep);
      } else {
        num = h.round(num, dec);
        num = h.thousands(num, sep, decSep);
        num = h.pad(num, 0, '0', dec, decSep);
      }
      if (suffix) {
        return "" + num + " " + currency;
      } else {
        return h.prefix(num, currency, true);
      }
    },
    makeCurrency: function(name, currency, dec, sep, decSep, si, suffix) {
      return h["_" + name] = function(num) {
        return h.currency(num, currency, dec, sep, decSep, si, suffix);
      };
    },
    siCurrency: function(num, currency, dec, sep, decSep, suffix) {
      return h.currency(num, currency, dec, sep, decSep, true, suffix);
    },
    dollars: function(num, dec, si, suffix) {
      return h.currency(num, h.USD, dec, null, null, si, suffix);
    },
    euros: function(num, dec, si, suffix) {
      return h.currency(num, h.EUR, dec, null, null, si, suffix);
    },
    yen: function(num, dec, si, suffix) {
      return h.currency(num, h.YN, dec, null, null, si, suffix);
    },
    yuan: function() {
      var args;
      args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return h.yen.apply(h, args);
    },
    pounds: function(num, dec, si, suffix) {
      return h.currency(num, h.GBP, dec, null, null, si, suffix);
    },
    wrap: function(s, len, sep) {
      var l, lines, rxp;
      if (len == null) {
        len = h.WRAP_WIDTH;
      }
      if (sep == null) {
        sep = '\n';
      }
      if (s == null) {
        return '';
      }
      rxp = new RegExp(".{1," + len + "}(\\s|$)", "g");
      lines = s.match(rxp);
      lines = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = lines.length; _i < _len; _i++) {
          l = lines[_i];
          _results.push(l.replace(/\s*$/, ''));
        }
        return _results;
      })();
      return lines.join(sep);
    },
    slug: function(s) {
      if (!s) {
        return '';
      }
      s = s.toString().toLowerCase().replace(/\W+/g, '-');
      s = s.replace(/[_-]+$/, '');
      return s.replace(/^[_-]+/, '');
    }
  };
  (function(tags) {
    var tag, _i, _len;
    for (_i = 0, _len = tags.length; _i < _len; _i++) {
      tag = tags[_i];
      h[tag] = (function(t) {
        return function() {
          var args;
          args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          args.unshift(t);
          return h.tag.apply(h, args);
        };
      })(tag);
      return;
    }
  })('a p strong em ul ol li div span'.split(' '));
  return h;
});
