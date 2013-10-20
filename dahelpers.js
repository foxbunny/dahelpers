// Generated by CoffeeScript 1.6.3
/*!
@author Branko Vukelic <branko@brankovukelic.com>
@license MIT
*/

var define,
  __slice = [].slice,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

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
  var h;
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
    HTML_ESCAPE_MAPPINGS: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;',
      '/': '&#x2F;'
    },
    type: function(v, type) {
      var t;
      t = Object.prototype.toString.call(v).toLowerCase().slice(8, -1);
      if (type == null) {
        return t;
      }
      return t === type.toLowerCase();
    },
    klass: function(v, klass) {
      if (typeof v !== 'object' || v === null) {
        return false;
      }
      if (klass != null) {
        return v.constructor === klass;
      } else {
        return v.constructor;
      }
    },
    truth: function(v) {
      if (h.type(v, 'undefined') || h.type(v, 'null')) {
        return false;
      }
      if (v === 0) {
        return false;
      }
      if (v === '') {
        return false;
      }
      if (v === false) {
        return false;
      }
      if (h.type(v, 'object') || h.type(v, 'array')) {
        return !h.empty(v);
      } else {
        return true;
      }
    },
    every: function(arr) {
      var item, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
        if (!item) {
          return false;
        }
      }
      return true;
    },
    none: function(arr) {
      var item, _i, _len;
      for (_i = 0, _len = arr.length; _i < _len; _i++) {
        item = arr[_i];
        if (item) {
          return false;
        }
      }
      return true;
    },
    any: function(arr) {
      return !h.none(arr);
    },
    toArray: function(v) {
      if (v == null) {
        return [];
      }
      if (h.type(v, 'array')) {
        return v;
      } else {
        return [v];
      }
    },
    empty: function(v) {
      var k;
      if (h.type(v, 'array') || h.type(v, 'string')) {
        return !v.length;
      } else if (h.type(v, 'object')) {
        return !((function() {
          var _results;
          _results = [];
          for (k in v) {
            _results.push(k);
          }
          return _results;
        })()).length;
      }
    },
    props: function(o, p) {
      var f, r;
      if (o == null) {
        return;
      }
      if (p == null) {
        return o;
      }
      if (h.type(p) !== 'array') {
        p = p.split('.');
      }
      f = p[0], r = 2 <= p.length ? __slice.call(p, 1) : [];
      if (!r.length) {
        return o[f];
      } else {
        if (o[f] == null) {
          return void 0;
        } else {
          return h.props(o[f], r.join('.'));
        }
      }
    },
    propset: function(o, p, v) {
      var f, r;
      if (o == null) {
        return;
      }
      if ((p == null) || !p.length) {
        return o;
      }
      if (h.type(p, 'string')) {
        p = p.split('.');
      }
      f = p[0], r = 2 <= p.length ? __slice.call(p, 1) : [];
      if (!r.length) {
        o[f] = v;
      } else {
        o[f] || (o[f] = {});
      }
      h.propset(o[f], r, v);
      return o;
    },
    walk: function(obj, cb, key, comps) {
      var k;
      if (key == null) {
        key = null;
      }
      if (comps == null) {
        comps = [];
      }
      if (obj === Object(obj) && obj.constructor === Object) {
        if (key !== null) {
          cb(obj, key, comps);
        }
        for (k in obj) {
          h.walk(obj[k], cb, (key ? [key, k].join('.') : k), comps.concat([k]));
        }
      } else {
        cb(obj, key, comps);
      }
    },
    sweep: function(obj, cb) {
      return (function(o) {
        h.walk(obj, function(v, k) {
          var isObj, v1;
          isObj = v === Object(v) && h.klass(v, Object);
          v1 = cb(v, k, isObj);
          if (!h.type(v1, 'undefined')) {
            return h.propset(o, k, v1);
          }
        });
        return o;
      })({});
    },
    extend: function() {
      var guard, mixin, mixins, obj, _i, _len, _ref;
      obj = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      if (h.type(obj, 'function')) {
        guard = obj;
        _ref = mixins, obj = _ref[0], mixins = 2 <= _ref.length ? __slice.call(_ref, 1) : [];
      } else {
        guard = function(obj, v) {
          return h.type(v) !== 'undefined';
        };
      }
      for (_i = 0, _len = mixins.length; _i < _len; _i++) {
        mixin = mixins[_i];
        h.walk(mixin, function(v, k, c) {
          if (!guard(obj, v, k, c)) {
            return;
          }
          if (h.klass(v) === false) {
            return h.propset(obj, c, v);
          } else {
            return h.propset(obj, c, (function() {
              switch (h.klass(v)) {
                case Object:
                  return {};
                case Date:
                  return new Date(v.getTime());
                case RegExp:
                  return new RegExp(v);
                case Array:
                  return v.slice(0);
                default:
                  return v;
              }
            })());
          }
        });
      }
      return obj;
    },
    mixin: function() {
      var guard, mixins, obj;
      obj = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      guard = function(obj, v, k, c) {
        var propType;
        if (h.type(v) === 'undefined') {
          return false;
        }
        propType = h.type(h.props(obj, c));
        return propType === 'undefined';
      };
      return h.extend.apply(null, [guard, obj].concat(mixins));
    },
    create: function() {
      var Child, mixins, parent;
      parent = arguments[0], mixins = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      Child = function() {
        h.extend.apply(null, [this].concat(mixins));
        this.__super__ = parent;
        return this;
      };
      Child.prototype = parent;
      return new Child();
    },
    clone: function(obj) {
      if (!h.klass(obj, Object)) {
        return obj;
      }
      return h.extend({}, obj);
    },
    rekey: function(obj, map) {
      var newObj, source, target;
      if (!obj) {
        return;
      }
      if (h.klass(obj) === false) {
        return obj;
      }
      if (!h.type(map, 'object')) {
        return h.clone(obj);
      }
      newObj = {};
      for (source in map) {
        target = map[source];
        h.propset(newObj, target, h.props(obj, source));
      }
      return newObj;
    },
    subset: function(small, big) {
      try {
        h.walk(small, function(v, k, c) {
          if (!(v === h.props(big, c))) {
            throw new Error();
          }
        });
      } catch (_error) {
        return false;
      }
      return true;
    },
    pair: function(keys, values) {
      var idx, key, o, _i, _len;
      if (keys.length !== values.length) {
        throw new TypeError('Key-value mismatch');
      }
      o = {};
      for (idx = _i = 0, _len = keys.length; _i < _len; idx = ++_i) {
        key = keys[idx];
        o[key] = values[idx];
      }
      return o;
    },
    unpair: function(o) {
      var key, keys, val, vals;
      keys = [];
      vals = [];
      for (key in o) {
        val = o[key];
        keys.push(key);
        vals.push(val);
      }
      return [keys, vals];
    },
    zip: function() {
      var a, arr, arrays, i, res, shortest, _i, _j, _len, _ref;
      arrays = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      shortest = Math.min.apply(Math, (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = arrays.length; _i < _len; _i++) {
          a = arrays[_i];
          _results.push(a.length);
        }
        return _results;
      })());
      res = [];
      for (i = _i = 0, _ref = shortest - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
        a = [];
        for (_j = 0, _len = arrays.length; _j < _len; _j++) {
          arr = arrays[_j];
          a.push(arr[i]);
        }
        res.push(a);
      }
      return res;
    },
    iterBase: function(state) {
      return {
        indices: function() {
          return state.indices;
        },
        len: function() {
          return state.length;
        },
        hasNext: function() {
          return state.currentIndex + 1 < state.length;
        },
        hasPrev: function() {
          return state.currentIndex > 0;
        },
        remaining: function() {
          if (this.hasNext()) {
            return state.length - state.currentIndex - 1;
          } else {
            return 0;
          }
        },
        apply: function() {
          var fns;
          fns = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
          state.funcs = state.funcs.concat(fns);
          return this;
        },
        get: function(idx) {
          var fn, val;
          val = this.itemize(idx)[0];
          state.currentIndex = idx;
          if (state.funcs.length) {
            fn = h.compose.apply(null, state.funcs);
            val = fn.call(state.v, val);
          }
          return val;
        },
        next: function() {
          if (!this.hasNext()) {
            throw new Error('No more items');
          }
          state.currentIndex += 1;
          return this.get(state.currentIndex);
        },
        prev: function() {
          if (!this.hasPrev()) {
            throw new Error('No more items');
          }
          state.currentIndex -= 1;
          return this.get(state.currentIndex);
        },
        slice: function(start, end, callback) {
          var collected, e, i, item, lastIndex, _i;
          if (start == null) {
            start = 0;
          }
          if (h.type(start, 'function')) {
            callback = start;
            start = 0;
            end = null;
          }
          if (h.type(end, 'function')) {
            callback = end;
            end = null;
          }
          lastIndex = this.len() - 1;
          if ((end == null) || (end > lastIndex)) {
            end = lastIndex;
          }
          if (end < 0) {
            end = lastIndex + end + 1;
          }
          if (start < 0) {
            start = 0;
          }
          collected = [];
          for (i = _i = start; start <= end ? _i <= end : _i >= end; i = start <= end ? ++_i : --_i) {
            try {
              item = this.get(i);
              collected.push(item);
              if (h.type(callback, 'function')) {
                callback(item);
              }
            } catch (_error) {
              e = _error;
              if (e !== 'skip') {
                throw e;
              }
            }
          }
          return collected;
        },
        each: function(callback) {
          var idx, _i, _len, _ref, _results;
          _ref = state.indices;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            idx = _ref[_i];
            _results.push(callback.apply(state.v, this.itemize(idx)));
          }
          return _results;
        },
        reduce: function(callback, initial) {
          var idx, _i, _len, _ref;
          if (initial == null) {
            initial = 0;
          }
          _ref = state.indices;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            idx = _ref[_i];
            initial = callback.apply(state.v, [initial].concat(this.itemize(idx)));
          }
          return initial;
        },
        every: function(callback) {
          var idx, _i, _len, _ref;
          _ref = state.indices;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            idx = _ref[_i];
            if (!callback.apply(state.v, this.itemize(idx))) {
              return false;
            }
          }
          return true;
        },
        none: function(callback) {
          var idx, _i, _len, _ref;
          _ref = state.indices;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            idx = _ref[_i];
            if (callback.apply(state.v, this.itemize(idx))) {
              return false;
            }
          }
          return true;
        },
        any: function(callback) {
          return !this.none(callback);
        }
      };
    },
    arrayIter: function(a) {
      var state, _i, _ref, _results;
      state = {
        v: [].concat(a),
        currentIndex: -1,
        length: a.length,
        indices: (function() {
          _results = [];
          for (var _i = 0, _ref = a.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this),
        funcs: []
      };
      return h.create(h.iterBase(state), {
        itemize: function(idx) {
          return [state.v[idx], idx];
        },
        map: function(callback) {
          var idx, _j, _len, _ref1, _results1;
          _ref1 = state.indices;
          _results1 = [];
          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            idx = _ref1[_j];
            _results1.push(callback.apply(state.v, this.itemize(idx)));
          }
          return _results1;
        },
        filter: function(callback) {
          var idx, _j, _len, _ref1, _results1;
          _ref1 = state.indices;
          _results1 = [];
          for (_j = 0, _len = _ref1.length; _j < _len; _j++) {
            idx = _ref1[_j];
            if (callback.apply(state.v, this.itemize(idx))) {
              _results1.push(state.v[idx]);
            }
          }
          return _results1;
        }
      });
    },
    objIter: function(o) {
      var k, keys, state, _i, _ref, _results;
      keys = (function() {
        var _results;
        _results = [];
        for (k in o) {
          if (Object.prototype.hasOwnProperty.call(o, k)) {
            _results.push(k);
          }
        }
        return _results;
      })();
      state = {
        v: h.clone(o),
        indices: (function() {
          _results = [];
          for (var _i = 0, _ref = keys.length - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; 0 <= _ref ? _i++ : _i--){ _results.push(_i); }
          return _results;
        }).apply(this),
        currentIndex: -1,
        length: keys.length,
        funcs: []
      };
      return h.create(h.iterBase(state), {
        itemize: function(idx) {
          var key, value;
          key = keys[idx];
          value = state.v[key];
          return [value, key];
        },
        indices: function() {
          return keys;
        },
        get: function(idx) {
          var key, val;
          val = this.__super__.get.call(this, idx);
          key = keys[idx];
          return [key, val];
        },
        map: function(callback) {
          var key, o1, val, _ref1;
          o1 = {};
          _ref1 = state.v;
          for (key in _ref1) {
            val = _ref1[key];
            o1[key] = callback.call(state.v, val, key);
          }
          return o1;
        },
        filter: function(callback) {
          var key, o1, val, _ref1;
          o1 = {};
          _ref1 = state.v;
          for (key in _ref1) {
            val = _ref1[key];
            if (callback.call(state.v, val, key)) {
              o1[key] = val;
            }
          }
          return o1;
        }
      });
    },
    iter: function(v) {
      switch (h.type(v)) {
        case 'array':
          return h.arrayIter(v);
        case 'object':
          return h.objIter(v);
        default:
          return void 0;
      }
    },
    lazy: function(fn) {
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        return {
          valueOf: function() {
            return fn.apply(null, args);
          }
        };
      };
    },
    compose: function() {
      var funcs;
      funcs = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      return function() {
        var args, fn, _i;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        args === arguments;
        for (_i = funcs.length - 1; _i >= 0; _i += -1) {
          fn = funcs[_i];
          args = [fn.apply(null, args)];
        }
        return args[0];
      };
    },
    suicidal: function(fn) {
      return function() {
        fn.apply(null, arguments);
        return fn = function() {};
      };
    },
    throttled: function(fn, period, bindTo) {
      var lastCall;
      if (bindTo == null) {
        bindTo = null;
      }
      lastCall = null;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (!lastCall || Date.now() - lastCall >= period) {
          lastCall = Date.now();
          return fn.apply(bindTo, args);
        }
      };
    },
    debounced: function(fn, period, bindTo) {
      var timeout;
      if (bindTo == null) {
        bindTo = null;
      }
      timeout = null;
      return function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        if (timeout != null) {
          clearTimeout(timeout);
        }
        return timeout = setTimeout(function() {
          return fn.apply(bindTo, args);
        }, period);
      };
    },
    queued: function(fn, period, bindTo) {
      var execQueue, queueArgs, queued, timeout;
      if (period == null) {
        period = null;
      }
      if (bindTo == null) {
        bindTo = null;
      }
      queueArgs = [];
      timeout = null;
      if (arguments.length === 2) {
        if (!h.type(period, 'number')) {
          bindTo = period;
          period = null;
        }
      }
      execQueue = function() {
        var a, _i, _len, _results;
        _results = [];
        for (_i = 0, _len = queueArgs.length; _i < _len; _i++) {
          a = queueArgs[_i];
          _results.push(fn.apply(bindTo, a));
        }
        return _results;
      };
      queued = function() {
        var args;
        args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
        queueArgs.push(args);
        if (period != null) {
          if (timeout != null) {
            clearTimeout(timeout);
          }
          return timeout = setTimeout(execQueue, period);
        }
      };
      queued.run = function() {
        clearTimeout(timeout);
        execQueue();
        return queueArgs = [];
      };
      return queued;
    },
    objAttrs: function(o) {
      var attrs, key, val;
      attrs = [];
      for (key in o) {
        val = o[key] || '';
        attrs.push("" + key + "=\"" + (val.replace(/"/g, '\\"')) + "\"");
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
    escape: function(s) {
      var chr, esc, _ref;
      if (s == null) {
        return '';
      }
      s = s.toString();
      _ref = h.HTML_ESCAPE_MAPPINGS;
      for (chr in _ref) {
        esc = _ref[chr];
        s = s.replace(new RegExp(chr, 'g'), esc);
      }
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
    pad: function(s, len, char, tail, sep) {
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
          return h.pad(s, len, char);
        } else {
          s = h.pad(s, len, char);
          if (tail === 0) {
            return s;
          }
          t || (t = char);
          t = h.pad(h.reverse(t), tail, char);
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
      if (num == null) {
        return '';
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
    }
  })('a p strong em ul ol li div span button option'.split(' '));
  return h;
});
