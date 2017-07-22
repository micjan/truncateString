# truncateString

A function to shorten strings with options.

## Install

~~~
$ npm install truncatestring --save
~~~

## How to use

Minimal usage:

~~~
var truncateString = require('truncatestring');

truncateString('Lorem Ipsum Dolor Est Sit Amet!', 8);
// => "Lorem Ip…"
~~~

Usage with default options:

~~~
truncateString('Lorem Ipsum Dolor Est Sit Amet!', 8, {
  appendix: '…',
  threshold: 8 // Default equals second parameter
});
// => "Lorem Ip…"
~~~

## API

~~~
truncateString(string, length, [options])
~~~

### string

Type: `string`

The string to shorten.

### length

Type: `number`

The length to shorten the `string` to.
If `string.length` is smaller or equal to `length` the string will be returned without any modification.
If `string.length` is larger than `length` the string will be cropped to have the length of `length` and an ellipsis (`…`) will be appended to it before returning (Can be changed by setting `options.appendix`).

### options

Type: `object`

(Optional) This object can contain some customized settings to change the way the string is handled.

#### options.threshold

Type: `number`

By default `options.threshold` equals the `length` parameter. If `options.threshold` differs from `length`, `string.length` has to surpass `options.threshold` to then be cut of to the `length`.

With this you can make sure to cut off a reasonable amount from the string.

Consider this:

~~~
truncateString('I am a tiny sentence.', 20);
// => "I am a tiny sentence…"
~~~

The string is just one char to long (21) and just the period is cut off, replaced by an ellipsis. We may want to prevent those cases. So we can do this:

~~~
truncateString('I am a tiny sentence.', 20, { threshold: 30 });
// => "I am a tiny sentence."
~~~

The strings length is lower than 30, so it will be returned unchanged.

~~~
truncateString('I am a tiny sentence.', 10, { threshold: 20 });
// => "I am a tin…"
~~~

The strings length is 21, so the threshold is surpassed and the string is shortened to the length of 10, cutting of a reasonable amount.

#### options.appendix

Type: `string`

Can be any string to append to a shortened string. By default it is and ellipsis (`…`).

#### options.cutChars

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

The same rules apply here.

The intended cut `Lorem ipsu/m-dolor sit.` is moved to the closest char. In this case it is the dash to its right.  
Note, that the char that was marking the cut-position is **not** removed. The cut-position-char will stay attached to the returned string.

The space in the first two examples **was** removed because `option.trim` is `true` by default.

~~~
truncateString('Lorem ipsum-dolor sit.', 8, { cutChars: ' ', trim: false });
// => "Lorem …"
~~~

#### options.trim

Type: `boolean`

This is `true` by default and will trim all spaces after the cut was made at the cut off end of the string. The untouched ends of the string will stay as they were.

Normal use-case:

~~~
truncateString('Lorem Ipsum', 6);
// => "Lorem…"
~~~

~~~
truncateString('Lorem Ipsum', 6, { trim: false });
// => "Lorem …"
~~~

And with a couple extra spaces, 'cause why not?

~~~
truncateString('  Lorem   Ipsum  ', 10);
// => "  Lorem…"
~~~

~~~
truncateString('  Lorem   Ipsum  ', 10, { trim: false });
// => "  Lorem   …"
~~~

## Dev notes

Work in `src/truncateString.js` and then run

~~~
$npm run build
~~~

This will transpile (to `dist/truncateString.js`), uglify (to `dist/truncateString.min.js`) and run tests (on the `dist/truncateString.min.js`).

Make sure that all Tests are successful and check the coverage/index.html for 100% test-coverage.

Also, no dependencies, please! devDependencies are OK of course.

## License

MIT © Michael Janssen
