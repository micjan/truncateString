# truncateString

A function to shorten strings with options.

## How to use

Minimal usage:

~~~
truncateString('Lorem Ipsum Dolor Est Sit Amet!', 8);
// => Lorem Ip…
~~~

Usage with default options:

~~~
truncateString('Lorem Ipsum Dolor Est Sit Amet!', 8, {
  appendix: '…',
  treshold: 8 // Default equals second parameter
});
// => Lorem Ip…
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
// => I am a tiny sentence…
~~~

The string is just one char to long (21) and just the period is cut off, replaced by an ellipsis. We may want to prevent those cases. So we can do this:

~~~
truncateString('I am a tiny sentence.', 20, { threshold: 30 });
// => I am a tiny sentence.
~~~

The strings length is lower than 30, so it will be returned unchanged.

~~~
truncateString('I am a tiny sentence.', 10, { threshold: 20 });
// => I am a tin…
~~~

The strings length is 21, so the threshold is surpassed and the string is shortened to the length of 10, cutting of a reasonable amount.

#### options.appendix

Type: `string`

Can be any string to append to a shortened string. By default it is and ellipsis (`…`).

## License

MIT
