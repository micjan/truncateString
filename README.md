# truncateString

A function to shorten strings with [options](#options).

## <a name="#table-of-contents">Table of contents</a>

* [Install](#install)
* [How to use](#how-to-use)
* [API](#api)
    * [string](#string)
    * [length](#length)
    * [options](#options)
        * [appendix](#options-appendix)
        * [cutChars](#options-cutchars)
        * [threshold](#options-threshold)
        * [trim](#options-trim)
        * [verbose](#options-verbose)
* [Dev Notes](#dev-notes)
* [License](#license)

## <a name="install">Install</a>

~~~
$ npm install truncatestring --save
~~~

## <a name="how-to-use">How to use</a>

Importing:

~~~
// ES5 Minified
var truncateString = require('truncatestring');

// ES5 Non-Minified
var truncateString = require('truncatestring/dist/truncateString');

// ES2015
import truncateString from 'truncatestring/src/truncateString';
~~~

Minimal usage:

~~~
truncateString('Lorem ipsum dolor est sit amet!', 8);
// => "Lorem ip…"
~~~

Usage with default options:

~~~
truncateString('Lorem ipsum dolor est sit amet!', 8, {
  appendix: '…',
  cutChars: [],
  threshold: 8, // Default equals second parameter
  trim: true,
  verbose: false
});
// => "Lorem ip…"
~~~

## <a name="api">API</a>

~~~
truncateString(string, length, [options])
~~~

### <a name="string">string</a>

Type: `string`

The string to shorten.

### <a name="length">length</a>

Type: `number`

The length to shorten the `string` to.
If `string.length` is smaller or equal to `length` (or [options.threshold](#options-threshold)) it will be returned without any modification.
If `string.length` is larger than `length` it will be cropped to have the length of `length` (can change slightly if [options.cutChars](#options-cutchars) is used).
Before returning an ellipsis (`…`) will be appended to it (See [options.appendix](#options-appendix)).

### <a name="options">options</a>

Type: `object`

(Optional) This object can contain some options to change the way the string is shortened.

#### <a name="options-appendix">options.appendix</a>

Type: `string`

Can be any string to append to a shortened string. By default it is an ellipsis (`…`).

#### <a name="options-cutchars">options.cutChars</a>

Type: `string` or `array` of single chars

By default, the string is cut at the positon `length` without checking if the cut will slice right through a word.
You can prevent word-slicing by defining chars as markers where cuts are allowed. In most cases this would just be a space:

~~~
truncateString('Lorem ipsum-dolor sit.', 8, { cutChars: ' ' });
// => "Lorem…"

truncateString('Lorem ipsum-dolor sit.', 15, { cutChars: ' ' });
// => "Lorem ipsum-dolor…"
~~~

So, what happend here?
The intended cut in the first case would be `Lorem ip/sum-dolor sit.`. That cut is closer to the space between "Lorem" and "ipsum" than it is to the space between "dolor" and "sit", so the cut is moved to the left space.
In the second example the intended cut `Lorem ipsum-dol/or sit.` is closer to the space on its right, so the cut is made there.

You can also pass an array of chars like so:

~~~
truncateString('Lorem ipsum-dolor sit.', 10, { cutChars: [' ', '-'] });
// => "Lorem ipsum-…"
~~~

The same rules apply here but with more chars that mark potential cut-positons.

The intended cut `Lorem ipsu/m-dolor sit.` is moved to the closest char. In this case it is the dash to its right.
Note, that the char that was marking the cut-position is **not** removed. The cut-position-char will stay attached to the returned string.

The space in the first two examples **was** removed because [option.trim](#options-trim) is `true` by default.

Doing this will preserve the space:

~~~
truncateString('Lorem ipsum-dolor sit.', 8, { cutChars: ' ', trim: false });
// => "Lorem …"
~~~

#### <a name="options-threshold">options.threshold</a>

Type: `number`

By default `options.threshold` equals the `length` parameter. If `options.threshold` differs from `length`, `string.length` has to surpass `options.threshold` to then be cut of to the `length`.

With this you can make sure to cut off a reasonable amount from the string.

Consider this:

~~~
truncateString('I am a tiny sentence.', 20);
// => "I am a tiny sentence…"
~~~

The string is just one char to long (21) and just the period is cut off, replaced by an ellipsis. You may want to prevent those cases. So you can do this:

~~~
truncateString('I am a tiny sentence.', 20, { threshold: 30 });
// => "I am a tiny sentence."
~~~

The strings length is lower than 30, so it will be returned unchanged even if it is longer than the `length`.

~~~
truncateString('I am a tiny sentence.', 10, { threshold: 20 });
// => "I am a tin…"
~~~

The strings length is 21, so the threshold is surpassed and the string is shortened to the length of 10, cutting of a reasonable amount.

#### <a name="options-trim">options.trim</a>

Type: `boolean`

This is `true` by default and will trim all spaces after the cut was made at the cut off end of the string. The untouched ends of the string will stay as they were.

Normal use-case:

~~~
truncateString('Lorem ipsum', 6);
// => "Lorem…"
~~~

~~~
truncateString('Lorem ipsum', 6, { trim: false });
// => "Lorem …"
~~~

And with a couple extra spaces, 'cause why not?

~~~
truncateString('  Lorem   ipsum  ', 10);
// => "  Lorem…"
~~~

~~~
truncateString('  Lorem   ipsum  ', 10, { trim: false });
// => "  Lorem   …"
~~~

#### <a name="options-verbose">options.verbose</a>

Type: `boolean`

By default this is `false` and the return value of this function will always be a string.

If this is `true` though, the return value will be an `object` with more information about the result.
It will contain the following properties:

| key           | type               | value         |
|-------------- |--------------------| --------------|
| result        | `string`           | The string that would have been returned if `options.verbose` was `false`. |
| parts         | `array` of strings | If the `string` **was not** cut, this contains the `string` as its only item. If the `string` **was** cut into two parts, this will contain those two parts of the string without an appendix. |
| wasCut        | `boolean`          | If a cut was made, this is `true`, otherwise `false`. |

## <a name="dev-notes">Dev notes</a>

Fork this repo and run:

~~~
$npm install
~~~

Then work in `src/truncateString.js` and then run:

~~~
$npm run build
~~~

This will do some linting, transpile (to `dist/truncateString.js`), minify (to `dist/truncateString.min.js`) and run tests (on the `dist/truncateString.min.js`).

Make sure that all Tests are successful and check the coverage/index.html for 100% test-coverage.

Also, no dependencies, please! devDependencies are OK of course.

## <a name="license">License</a>

MIT © Michael Janssen
