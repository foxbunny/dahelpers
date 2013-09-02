###!
@author Branko Vukelic <branko@brankovukelic.com>
@license MIT
###

# # DaHelpers
#

define = ((root) ->
  if typeof root.define is 'function' and root.define.amd
    root.define
  else
    if typeof module is 'object' and module.exports
      (factory) -> module.exports = factory()
    else
      (factory) -> root.dahelpers = factory()
)(this)

define () ->

  h =
    # ## `#FIRST_CHAR`
    #
    # Regular expression for capturing the first character of a word.
    FIRST_CHAR: /\b([a-z])/gi

    # ## `#objAttrs(o)`
    #
    # Converts a JavaScript object into a set of HTML attributes where the key is
    # the name of the attribute, and value is the attribute value.
    #
    # Note that we do _not_ check whether keys represent valid attribute names.
    #
    # All attribute values are double-quoted and any double quotes inside the
    # attribute values are escaped.
    objAttrs: (o) ->
      attrs = []
      for key of o
        attrs.push "#{key}=\"#{o[key].replace(/"/g, '\\"')}\"" if o[key]
      attrs.join ' '

    # ## `#tag(name, content, [attrs, silence])`
    #
    # Wraps `content` into a `name` HTML tag with optional `attrs` attributes.
    # The `attrs` is an object containing element's attributes.
    #
    # If the `silence` argument is `true`, the whole `tag` is only rendered if
    # `content` is not null or undefined, and can be coerced into a non-empty
    # string.
    tag: (name, content='', attrs=null, silence=false) ->
      return '' if not name
      return '' if silence and (not content? or content.toString() is '')
      s = "<#{name}"
      s += " #{h.objAttrs(attrs)}" if attrs
      s += ">#{content}</#{name}>"
      s

    # ## `#plural(singular, [plural,] count)`
    #
    # Rudimentary support for plurals.
    #
    # If the `plural` argument is missing, 's' will be appended to the singular
    # to build the plural form. This does not take into account any
    # language-specific methods of pluralization or English exceptions, and does
    # not provide support for complex plurals with multiple forms.
    plural: (singular, plural, count) ->
      return '' if not singular
      if not count?
        count = plural
        plural = singular + 's'

      if count is 1 then singular else plural

    # ## `#capitalize(s)`
    #
    # Capitalize the first character of the string `s`. You can used this to
    # build sentence case.
    #
    # For example:
    #
    #     <%= h.capitalize('foo bar fam') %>
    #
    # will render:
    #
    #     Foo bar fam
    #
    # The method internally uses `String.prototype.toUpperCase()` so anything
    # that the string method doesn't support is also not supported.
    capitalize: (s) ->
      return '' if not s
      "#{s[0].toUpperCase()}#{s[1..]}"

    # ## `#titleCase(s)`
    #
    # Converts the string `s` to Title Case.
    #
    # This method uses a simple algorhythm for title-casing, so do not expect
    # exceptions (e.g., it cannot do fancy title cases such as 'Question of
    # Time').
    #
    # This method will also not touch characters that are already in uppercase.
    # For example, calling it on all-caps text will achieve nothing.
    titleCase: (s) ->
      return '' if not s
      s.replace h.FIRST_CHAR, (match, groups...) ->
        groups[0].toUpperCase()

    # ## `#format(s, format)`
    #
    # Formats a string according to the `format`. The format is simply a series
    # of hash character '#' that map the string's characters to appropriate
    # places one by one. Here's an example:
    #
    #     <%= h.format('abcdef', '##-##-##') %>
    #
    # will render:
    #
    #     ab-cd-ef
    #
    # This works best with source strings were internal structure has no
    # semantic like unformatted phone numbers or serial numbers. It doesn't work
    # well for strings that already have structure or whose length is variable.
    #
    # For example:
    #
    #     <%= h.format('John Smith', '### ### ###') %>
    #     <%= h.format('John Doe', '### ### ###') %>
    #
    # renders:
    #
    #     Joh nSm ith
    #     Joh nDo e##
    format: (s, format) ->
      return '' if not s
      s = '' + s # Coerce into string
      return s if not format
      s = s.split '' # Splits into individual characters as array
      for chr in s
        # Replace first unreplaced '#' with `chr`
        format = format.replace('#', chr)
      format

    # ## reverse(s)
    #
    # Reverses a string
    reverse: (s) ->
      if s then s.split('').reverse().join '' else ''

    # ## sgroup(s)
    sgroup: (s, n) ->
      return [] if not s?
      s = s.toString()
      return [s] if not n
      m = s.match new RegExp "(.{1,#{n}})", 'g'
      m

    # ## thousands(num, [separator])
    #
    # Adds the thousands separator to `num`. Default separator is a comma, and
    # can be customized by passing the `separator` argument.
    thousands: (num, separator=',', decimalSeparator='.') ->
      num = num.toString()
      num = num.replace /[^\d\.]/g, ''
      [num, frac] = num.toString().split '.'
      num = h.reverse num
      num = h.sgroup(num, 3).join(separator)
      num = h.reverse num
      num = "#{num}#{decimalSeparator}#{frac}" if frac
      num

    # ## `#si(num, d)`
    #
    # Convert the number to closes SI factor (Kilo, Mega, etc). Uses only factors
    # of thousand (k, M, G, T, P, E, Z, and Y).
    #
    # If `d` is specified, it will allow `d` number of decimals after the main
    # unit.
    #
    # Example:
    #
    #   h.si(1000); // '1k'
    #
    #   h.si(1200); // '1200'
    #
    #   h.si(1200, 1); // '1.2k'
    si: (num, d=0) ->
      return '' if not num?
      units = 'kMGTPEZ'.split ''
      units.unshift ''

      # Add `d` zeros to the number before starting
      adjustment = Math.pow(10, d)
      num = num * adjustment

      factor = 0
      for unit, idx in units
        if num % 1000
          return "#{num / adjustment}#{unit}"
        else
          num = num / 1000

    # ## `#digits(s)`
    #
    # Removes all non-digits from a string.
    digits: (s) ->
      return '' if not s?
      s.toString().replace(/[^\d]/g, '')

  tags = 'a p strong em ul ol li div span'.split ' '

  for tag in tags
    # For instance, if we did this:
    #
    #     for tag in tags
    #       h[tag] = (args...) ->
    #         args.unshift tag
    #         h.tag.apply h, args
    #
    # The above would simply use the last value of the `tag` variable at
    # runtime, which happens to be the last value assigned to it ever, which is
    # `'footer'`. This is because there are no block scopes in JavaScript. The
    # `tag` variable used above is defined at the top of the scope in which we
    # are making the `for` loop, and since the method is referring to the same
    # variable, it will use the last value the variable points to.
    #
    # Because of that, we create a closure using immediate-execution pattern.
    # We pass the immediately-executing function the `tag` variable. The
    # function will name the argument `tag` (could have been any other name)
    # and that new `tag` variable is now defined within its own scope and has
    # nothing to do with the `tag` variable outside it. We then define the
    # method we want within that closure and the new `tag` variable is
    # available to the method.
    h[tag] = ((tag) ->
      (args...) ->
        args.unshift tag
        h.tag.apply h, args
    )(tag)

  h # return the module

