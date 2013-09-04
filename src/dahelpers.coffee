###!
@author Branko Vukelic <branko@brankovukelic.com>
@license MIT
###

# # DaHelpers
#
# These are da helpers to help you out.
#
# Miscellaneous general-purpose helper methods for JavaScript in browsers and
# on NodeJS.
#
# ::TOC::
#
# ## Installation
#
# This module is in UMD format. It can be used with an AMD loader such as
# RequireJS, on NodeJS, or in browsers using `<script>` tag.
#
# ### NodeJS
#
# Install with NPM:
#
#     npm install dahelpers
#
# ### volo
#
# Install with:
#
#     volo add foxbunny/dahelpers
#
# ### Browser
#
# Either `require()` it if using RequireJS, or add a `<script>` tag. When using
# with the `<script>` tag, the module will create a `dahelpers` global.
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

    # ## Variables
    #
    # Although some of the properties of this module are all-caps, they are by
    # no means constants. They are, in fact, variables that configure various
    # aspects of DaHelpers. You are free to modify them any way you need.
    #

    # ### `#USD`
    #
    # Symbol for US currency
    #
    USD: '$'

    # ### `#EUR`
    #
    # Symbol for EU currency
    #
    EUR: '€'

    # ### `#JPY`
    #
    # Symbol for Japanese currency
    #
    JPY: '¥'

    # ### `#GBP`
    #
    # Symbol for UK currency
    #
    GBP: '£'

    # ### `#DEFAULT_CURRENCY`
    #
    # Default curency used by `#currency()` method.
    #
    DEFAULT_CURRENCY: '$'

    # ### `#FIRST_CHAR`
    #
    # Regular expression for capturing the first character of a word.
    #
    FIRST_CHAR: /\b[a-z]/gi

    # ### `#WRAP_WIDTH`
    #
    # Default text wrap width.
    #
    WRAP_WIDTH: 79

    # ### `#FORMAT_CHARACTER`
    #
    # Character used by default in `#format()` method.
    #
    FORMAT_CHARACTER: '#'

    # ### `#PLURAL_RULES`
    #
    # Returns the form to use based on number `n`. The form is 0 for singular,
    # and 1 or more for plural forms.
    #
    # This function is called by the `#plural()` method to yield the correct
    # form.
    #
    # Default function accounts for English and compatible pluralization where
    # singular is used when n==1, and a single plural form for all other cases.
    #
    # You can see different rules for different langauges on [Unicode
    # CLDR](http://www.unicode.org/cldr/charts/supplemental/language_plural_rules.html)
    #
    PLURAL_RULES: (n) ->
      if n is 1 then 0 else 1

    # ## Helper functions
    #
    # Although all the methods are exported as one object, they are completely
    # decoupled (they call each other by using the reference to the module
    # object `h`, instead of `this`), so you can assign individual methods to
    # variables and pass them around.
    #

    # ### `#objAttrs(o)`
    #
    # Converts a JavaScript object `o` into a set of HTML attributes where a
    # key is the attribute name, and value is the attribute value.
    #
    # Note that the validity of attribute names are not checked, so it's
    # developer's job to make sure valid attributes are being generated.
    #
    # All attribute values are double-quoted and any double quotes inside the
    # attribute values are escaped.
    #
    # Example:
    #
    #     dahelpers.obAttrs({foo: 1, bar: 'foo'});
    #     // returns 'foo="1" bar="foo"'
    #
    objAttrs: (o) ->
      attrs = []
      for key of o
        attrs.push "#{key}=\"#{o[key].replace(/"/g, '\\"')}\"" if o[key]
      attrs.join ' '

    # ### `#tag(name, content, [attrs, silence])`
    #
    # Wraps optional content into a HTML tag with optional attributes hash.
    #
    # The `name` represents the name of the HTML tag (and it is not checked for
    # validity at all. The `attrs` is an object whic is passed to
    # `#objAttrs()`.
    #
    # If the `silence` argument is `true`, the whole `tag` is only rendered if
    # `content` is not null or undefined, and can be coerced into a non-empty
    # string.
    #
    # Example:
    #
    #     dahelpers.tag('a', 'click here', {href: '#'});
    #     // returns '<a href="#">click here</a>'
    #
    tag: (name, content='', attrs=null, silence=false) ->
      return '' if not name
      return '' if silence and (not content? or content.toString() is '')
      s = "<#{name}"
      s += " #{h.objAttrs(attrs)}" if attrs
      s += ">#{content}</#{name}>"
      s

    # ### `#plural(singular, plural, [plural2...] count)`
    #
    # Provides support for pluralization. All but the last argument are plural
    # forms, starting with singular, which is the first argument, followed by 0
    # or more plural forms.
    #
    # The function will return an empty string if at least one form of singular
    # and one form of plural are not passed along with the count.
    #
    # The pluralization rules are actually defined in the `PLURAL_RULES`
    # property, which is a function that returns 0 for singular, and 1 or more
    # for plural forms. The correct form is then selected from the arguments
    # passed to this function.
    #
    # Example:
    #
    #     dahelpers.plural('bear', 'bears', 3);  // returns 'bears'
    #
    plural: (args...) ->
      return '' if not args.length or args.length < 3
      count = args.pop()  # Last argument is count
      forms = args
      forms[h.PLURAL_RULES count]

    # ### `#capitalize(s)`
    #
    # Capitalizes the first character of the string `s`. You can used this to
    # build sentence case.
    #
    # Example:
    #
    #     dahelpers.capitalize('foo bar fam');  // returns 'Foo bar fam'
    #
    capitalize: (s) ->
      return '' if not s
      "#{s[0].toUpperCase()}#{s[1..]}"

    # ### `#titleCase(s, [lowerFirst])`
    #
    # Converts the string `s` to Title Case.
    #
    # This method uses a simple algorhythm for title-casing, so do not expect
    # exceptions (e.g., it cannot do fancy title cases such as 'Question of
    # Time').
    #
    # You can change the `FIRST_CHAR` property to customize the regular
    # expression used to find the first character if you need a more complex
    # behavior.
    #
    # To understand how the customization works here is a short description of
    # what `#titleCase()` does with the regexp internally.  The regexp is used
    # in a `String.prototype.replace()` call as the first argument, and the
    # callback function is passed the entire match. The match (not any captured
    # group) is then capitalized using `#capitalize()`.
    #
    # Because of the way this method works, you generally must include the 'g'
    # flag in your regexp. The rest is up to you. There is a very crude example
    # of a customized title case which only capitalizes words that are longer
    # than 4 and contain only letters.
    #
    # If the `lowerFirst` is `ture`, the whole string will be lower-cased
    # before applying the title case. Default is `false`.
    #
    # Examples:
    #
    #     dahelpers.titleCase('This is a title');
    #     // returns 'This Is A Title'
    #
    #     dahelpers.FIRST_CHAR = /\b[a-z]{4,}/gi;
    #     dahelpers.titleCase('This is the title');
    #     // returns 'This is the Title'
    #
    titleCase: (s, lowerFirst=false) ->
      return '' if not s
      s = s.toLowerCase() if lowerFirst
      s.replace h.FIRST_CHAR, (match) ->
        h.capitalize match

    # ### `#format(s, format, [formatChar])`
    #
    # Formats a string according to the `format`. The format is simply a series
    # of hash character '#' that map the string's characters to appropriate
    # places one by one.
    #
    # This works best with source strings were internal structure has no
    # semantic like unformatted phone numbers or serial numbers. It doesn't
    # work well for strings that already have structure or whose length is
    # variable.
    #
    # The character used in the `format` string can be customed either by
    # passing an alternative as `formatChar` argument, or by modifying the
    # `FORMAT_CHARACTER` property.
    #
    # Examples:
    #
    #     dahelpers.format('abcdef', '##-##-##');  // returns 'ab-cd-ef'
    #     dahelpers.format('John Doe', '## ###');  // returns 'Jo hnD'
    #     dahelpers.format('1234', '$$$-$', '$');  // returns '123-4'
    #
    format: (s, format, formatChar=h.FORMAT_CHARACTER) ->
      return '' if not s
      s = '' + s # Coerce into string
      return s if not format
      s = s.split '' # Splits into individual characters as array
      for chr in s
        # Replace first unreplaced '#' with `chr`
        format = format.replace(formatChar, chr)
      format

    # ### `#reverse(s)`
    #
    # Reverses a string.
    #
    # Example:
    #
    #     dahelpers.reverse('esrever');  // returns 'reverse'
    #
    reverse: (s) ->
      if s then s.split('').reverse().join '' else ''

    # ### `#sgroup(s, n)`
    #
    # Groups the string's characters into groups of `n` characters and returns
    # the groups as an array.
    #
    # The last group can be shorter than `n` if there are not enough
    # characters.
    #
    # An empty string is returned if `s` is not defined or is an empty string,
    # and an array containing the orginal string if `n` is not specified or is
    # 0.
    #
    # Examples:
    #
    #     dahelpers.sgroup('Groupings', 3);  // returns ['Gro', 'upi', 'ngs']
    #     dahelpers.sgroup('Grouping', 3);   // returns ['Gro', 'upi', 'ng']
    #
    sgroup: (s, n) ->
      return [] if not s? or s is ''
      s = s.toString()
      return [s] if not n
      m = s.match new RegExp "(.{1,#{n}})", 'g'
      m

    # ### `#pad(s, len, [char, tail, sep])`
    #
    # Pads a string `s` with `char` characters, so that the output is at least
    # `len` long.
    #
    # The `char` is '0' by default.
    #
    # If `len` is 0 or less than the length of `s`, no padding is done, and the
    # original string is left intact.
    #
    # Tail has the same meaning as `len` but from the tail end of the string.
    # The `sep` character is used to split the string into head and tail, and
    # they are padded separately and re-merged using the same separator
    # character.
    #
    # The only case where `tail` behaves differently than `len` is when it is
    # set to `false`. This has a special meaning internally, where it disables
    # any processing of the tail if it is `false`.
    #
    # Examples:
    #
    #     dahelpers.pad('2', 2);             // returns '02'
    #     dahelpers.pad('2.5', 0, null, 3);  // returns '2.50'
    #
    pad: pad = (s, len, char='0', tail=false, sep='.') ->
      if s? then s = s.toString() else return ''
      if tail is false
        if s.length < len
          ((new Array len).join(char) + s).slice -len
        else
          s
      else
        [s, t] = s.toString().split sep
        if tail is false
          pad s, len, char
        else
          # Pad the head-end
          s = pad s, len, char

          # Pad the tail end
          t or= char
          t = pad h.reverse(t), tail, char
          t = h.reverse(t)
          [s, t].join sep

    # ### thousands(num, [sep, decSep])
    #
    # Adds the thousands separator to `num`.
    #
    # Default separator is a comma, and can be customized by passing the `sep`
    # argument.
    #
    # The `decSep` argument can be used to customize the decimal separator ('.'
    # by default).
    #
    # Although the `decSep` can control the output decimal separator, the input
    # decimal separator is always period. This is a tradeoff to give
    # `#thousands()` the ability to take JavaScript numbers as input, and still
    # use a different separator in the output without cluttering the function
    # signature.
    #
    # Examples:
    #
    #     dahelpers.thousands(1200000);               // returns '1,200,000'
    #     dahelpers.thousands(1200000.12, '.', ',');  // returns '1.200.000,00'
    #
    thousands: (num, sep=',', decSep='.') ->
      num = num.toString()
      num = num.replace /[^\d\.-]/g, ''
      num = parseFloat(num)
      return '' if isNaN(num)
      [num, frac] = num.toString().split '.'
      num = h.reverse num
      num = h.sgroup(num, 3).join(sep)
      num = h.reverse num
      num = "#{num}#{decSep}#{frac}" if frac
      num

    # ### `#si(num, [d, thousands, sep, decSep])`
    #
    # Converts the number to closes SI factor (Kilo, Mega, etc). Uses only
    # factors of thousand (k, M, G, T, P, E, and Z) larger than 0.
    #
    # Due to overlow issues, the Y suffix is not avilable.
    #
    # The method will only add the next bigger suffix if the number is
    # divisible by that factor. For example, 1000 can use the 'k' suffix, but
    # 1100 will be returned as is.
    #
    # If `d` is specified, it will allow `d` number of decimals after the main
    # unit. For example, with number 1100, with `d` of 1, the method will add
    # return '1.1k'. With `d` of 1, 1110 would still be returned as is.
    # Increasing `d` to 2 would allow the method to output '1.11k'. And so on.
    # `d` can be as large as you want.
    #
    # if `thousands` is `true`, the thousands separator will be added.
    #
    # You can control the characters used for separator and decimal separator
    # by using the `sep` and `decSep` arguments. They work the same way as the
    # `thousands`.
    #
    # Examples:
    #
    #     dahelpers.si(1000);                 // returns '1k'
    #     dahelpers.si(1200);                 // returns '1200'
    #     dahelpers.si(1200, 1);              // returns '1.2k'
    #     dahelpers.si(1200, null, true);     // returns '1,200'
    #
    si: (num, d=0, thousands=false, sep=",", decSep='.') ->
      return '' if not num?
      units = 'kMGTPEZ'.split ''
      units.unshift ''

      # Add `d` zeros to the number before starting
      adjustment = Math.pow(10, d)
      num = num * adjustment

      factor = 0
      for unit, idx in units
        if num % 1000
          num = num / adjustment
          if thousands
            num = h.thousands(num, sep, decSep)
          else
            num = num.toString().replace('.', decSep)
          return "#{num}#{unit}"
        else
          num = num / 1000

    # ### `#digits(s)`
    #
    # Removes all non-digit characters from a string. This includes decimal
    # points, minus sign, and anyting else that does not match the `\d` regular
    # expression.
    #
    # Examples:
    #
    #     dahelpers.digits('123.456.7890');           // returns '1234567890'
    #     dahelpers.digits('Number of items is 12');  // returns '12'
    #
    digits: (s) ->
      return '' if not s?
      s.toString().replace(/[^\d]/g, '')

    # ### `#prefix(num, prefix, sepLong)`
    #
    # Adds a prefix to a number. The `prefix` argument can be any string of any
    # length. `num` can be a real number, or just any string.
    #
    # The main difference between `#prefix()` and simple string concatenation
    # is the handling of the leading minus sign. If there is a minus sign at
    # the beginning of the number, the prefix will be inserted between the
    # minus sign and the rest of the number.
    #
    # The `sepLong` argument is used to separate long prefixes from the number.
    #
    # Examples:
    #
    #     dahlperss.prefix(12, '$');          // returns '$12'
    #     dahelpers.prefix(-12, '$');         // returns '-$12'
    #     dahelpers.prefix(12, 'foo');        // returns 'foo12'
    #     dahelpers.prefix(12, 'foo', true);  // returns 'foo 12'
    #
    prefix: (num, prefix, sepLong=false) ->
      return '' if not num?
      num = num.toString()
      return num if not prefix and not prefix.length

      if prefix.length > 1 and sepLong
        return "#{prefix} #{num}"

      if num[0] is '-'
        "-#{prefix}#{num[1..]}"
      else
        "#{prefix}#{num}"

    # ### `#round(num, [d])
    #
    # Round the number to `d` decimal places. `d` is 0 by default.
    #
    # Examples:
    #
    #     dahelpers.round(12.34);     // returns 12
    #     dahelpers.round(12.34, 1);  // returns 12.3
    #
    round: (num, d=0) ->
      num = parseFloat num
      return 0 if isNaN num
      Math.round(num * Math.pow(10, d)) / Math.pow(10, d)

    # ### `#currency(num, [currency, dec, sep, decSep, si, suffix])`
    #
    # Formats `num` as currency  with thousands separator or SI suffix. Default
    # currency is '$', and thousands separators are used by default.
    #
    # The `dec` argument specifies the number of decimal places (default is 2).
    # This number is also used when converting to SI suffix.
    #
    # The `sep` argument specifies the thousands separator (default is ',').
    #
    # The `decSep` argument specifies the decimal separator (default is '.').
    #
    # The `si` argument should be a boolean and tells the method to render the
    # number with SI prefix instead of with thousands separator. Default is
    # `false`.
    #
    # The `suffix` argument is used to suffix the currency instead of prefixing
    # it.
    #
    # Example:
    #
    #     dahelpers.currency(12);            // returns '$12.00'
    #     dahelpers.currency(12, null, 0);   // returns '$12'
    #     dahelpers.currency(12, 'Fr');      // returns 'Fr 12.00'
    #     dahelpers.currency(12, 'USD');     // returns 'USD 12.00'
    #
    currency: (num, currency=h.DEFAULT_CURRENCY, dec=2, sep=',', decSep='.',
      si=false, suffix=false) ->
      if si
        num = h.si num, dec, true, sep, decSep
      else
        num = h.round num, dec
        num = h.thousands(num, sep, decSep)
        num = h.pad num, 0, '0', dec, decSep
      if suffix
        "#{num} #{currency}"
      else
        h.prefix num, currency, true

    # ### `#makeCurrency(name, currency, dec, sep, decSep, si, suffix)`
    #
    # Because the `#currency()` method takes many arguments and you might not
    # always use them all, this method will help you create a somewhat
    # permanent alias for the mix of arguments you wish to use often.
    #
    # Except for the `name` argument, the others are passed through to
    # `#currency()` method, and work the same way. The `name` is the name you
    # wish to use to refer to the currency. You can basically use any name you
    # want, but since the name is used to create a new key on JavaScript
    # object, you should use a name that can be used effectively in that
    # context.
    #
    # The method returns a function which takes only the `num` argument and
    # uess previously specified arguments to return formatted currency. The
    # function is also accessible through `dahelpers._NAME` key where `NAME` is
    # the name you originally specified.
    #
    # To modify the definition of an existing currency, simply call this method
    # again and use the same name. To remove a currency, you should simply
    # `delete` the property from the `dahelpers` module (see examples below).
    #
    # Examples:
    #
    #     dahelpers.makeCurrency('din', 'Din', 2, '.', ',', false, true);
    #     dahelpers._din(15000);  // returns '15.000,00 Din'
    #     delete dahelpers._din;  // removes 'din' currency
    #
    makeCurrency: (name, currency, dec, sep, decSep, si, suffix) ->
      h["_#{name}"] = (num) ->
        h.currency(num, currency, dec, sep, decSep, si, suffix)

    # ### `siCurrency(num, [currency, dec, sep, decSep])`
    #
    # This is a shortcut for `#currency` which passes the si argument.
    #
    # Example:
    #
    #     dahelpers.siCurrency(1200, 'Fr');  // returns 'Fr 1.2k'
    #
    siCurrency: (num, currency, dec, sep, decSep, suffix) ->
      h.currency num, currency, dec, sep, decSep, true, suffix

    # ### `dollars(num, dec, si)`
    #
    # Shortcut method for formatting US currency.
    #
    # Example:
    #
    #     dahelpers.dollars(100);  // returns '$100.00'
    #
    dollars: (num, dec, si, suffix) ->
      h.currency num, h.USD, dec, null, null, si, suffix

    # ### `euros(num, dec, si)`
    #
    # Shortcut method for formatting EU currency.
    #
    # Example:
    #
    #     dahelpers.euros(100);  // returns '€100.00'
    #
    euros: (num, dec, si, suffix) ->
      h.currency num, h.EUR, dec, null, null, si, suffix

    # ### `yen(num, dec, si)`
    #
    # Shortcut method for formatting Japanese currency.
    #
    # Example:
    #
    #     dahelpers.yen(100);  // returns '¥100.00'
    #
    yen: (num, dec, si, suffix) ->
      h.currency num, h.JPY, dec, null, null, si, suffix

    # ### `yuan(num, dec, si)`
    #
    # Shortcut method for formatting Chinese currency. Since both Chinese and
    # Japanese currencies use the same symbol, this method is a simple alias
    # for `#yen()`.
    #
    # Example:
    #
    #     dahelpers.yuan(100);  // returns '¥100.00'
    #
    yuan: (args...) ->
      h.yen args...

    # ### `pounds(num, dec, si)`
    #
    # Shortcut method for formatting UK currency.
    #
    # Example:
    #
    #     dahelpers.pounds(100); // returns '£100.00'
    #
    pounds: (num, dec, si, suffix) ->
      h.currency num, h.GBP, dec, null, null, si, suffix

    # ### `wrap(s, [len, sep])`
    #
    # Wraps the text to make lines of `len` length separated by `sep`
    # separator. The `len` is 79 by default, and separator is a LF character
    # ('\n').
    #
    # Code for this method is based on the idea from [James Padolsey's blog
    # post](http://james.padolsey.com/javascript/wordwrap-for-javascript/).
    #
    # Example:
    #
    #     dahelpers.wrap('The quick brown fox jumps over lazy old fox.', 20);
    #     // returns:
    #     // 'The quick brown\n
    #     // fox jumps over\n
    #     // lazy old fox.'
    #
    wrap: (s, len=h.WRAP_WIDTH, sep='\n') ->
      return '' if not s?
      rxp = new RegExp ".{1,#{len}}(\\s|$)", "g"
      lines = s.match(rxp)
      lines = (l.replace(/\s*$/, '') for l in lines)  # Strip trailing spaces
      lines.join(sep)

    # ### `slug(s)`
    #
    # Converts a string to a slug (URL-compatible string). This method is
    # fairly basic, so don't depend on it for strings that contain non-ASCII
    # letters.
    #
    # Example:
    #
    #     dahelpers.slug('This is some text.');
    #     // returns 'this-is-some-text'
    #
    slug: (s) ->
      return '' if not s
      s = s.toString().toLowerCase().replace /\W+/g, '-'
      s = s.replace /[_-]+$/, ''  # Strip trailing non-letters
      s.replace /^[_-]+/, ''  # Strip leading non-letters

  # ## Tag aliases
  #
  # For convenience we include a few aliases for HTML tags that will call
  # `#tag()` method with a specific HTML tag name. The tags that are aliased
  # are:
  #
  #  + a
  #  + p
  #  + strong
  #  + em
  #  + ul
  #  + ol
  #  + li
  #  + div
  #  + span
  #
  # They take the same arguments as the `#tag()` method except `name`.
  #
  tags = 'a p strong em ul ol li div span'.split ' '

  for tag in tags
    ## For instance, if we did this:
    ##
    ##     for tag in tags
    ##       h[tag] = (args...) ->
    ##         args.unshift tag
    ##         h.tag.apply h, args
    ##
    ## The above would simply use the last value of the `tag` variable at
    ## runtime, which happens to be the last value assigned to it ever, which
    ## is `'footer'`. This is because there are no block scopes in JavaScript.
    ## The `tag` variable used above is defined at the top of the scope in
    ## which we are making the `for` loop, and since the method is referring to
    ## the same variable, it will use the last value the variable points to.
    ##
    ## Because of that, we create a closure using immediate-execution pattern.
    ## We pass the immediately-executing function the `tag` variable. The
    ## function will name the argument `tag` (could have been any other name)
    ## and that new `tag` variable is now defined within its own scope and has
    ## nothing to do with the `tag` variable outside it. We then define the
    ## method we want within that closure and the new `tag` variable is
    ## available to the method.
    h[tag] = ((tag) ->
      (args...) ->
        args.unshift tag
        h.tag.apply h, args
    )(tag)

  h # return the module

