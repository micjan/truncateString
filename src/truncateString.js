module.exports = function truncateString(string, length, options = {}) {
  // Initially handle the params
  if (typeof string !== 'string') return '';
  if (typeof length !== 'number' || length < 0) return string;

  // Base settings
  const settings = {
    appendix: '…',
    cutChars: [],
    threshold: length,
    trim: true,
  };

  // Some Helpers
  const isArray = mixed => Object.prototype.toString.call(mixed) === '[object Array]';
  const isString = mixed => typeof mixed === 'string';
  const isNumber = mixed => typeof mixed === 'number';
  const isDefined = mixed => typeof mixed !== 'undefined';
  const trimRight = str => str.replace(/ +$/, '');
  const appendix = str => `${str}${settings.appendix}`;

  // Validate options.appendix
  if (isString(options.appendix)) {
    settings.appendix = options.appendix;
  }

  // Validate options.cutChars
  if (isString(options.cutChars)) {
    settings.cutChars.push(options.cutChars);
  } else if (isArray(options.cutChars)) {
    options.cutChars.forEach((char) => {
      if (isString(char) && char.length === 1) {
        settings.cutChars.push(char);
      }
    });
  }

  // Validate options.threshold
  if (options.threshold && isNumber(options.threshold) && options.threshold > 0) {
    settings.threshold = options.threshold;
  }

  // Validate options.trim
  if (isDefined(options.trim)) {
    settings.trim = options.trim;
  }

  // Check if string is long enough for truncation
  if (string.length > settings.threshold && string.length > length) {
    // Shorten the String
    let shortenedString = string.substring(0, length);

    // Do this only if cutChars are defined, otherwise the shortenedString is
    // left with its cut where it was made.
    if (settings.cutChars.length > 0) {
      // Split the string in left and right parts and cache some distance-variables
      // to initially store the length of each string-part. Doing this we now know
      // the distance to the left- and rightmost potential cut-position
      // of the string relative to the intended cut-position.
      const leftString = shortenedString;
      let leftDist = leftString.length;
      const rightString = string.substring(length);
      let rightDist = rightString.length;

      // Looping through all cutChars, updating the leftDist and rightDist vars
      // if a char was found in leftString or rightString that is closer to the
      // intended cut-position than the previous cut-position on each side.
      settings.cutChars.forEach((char) => {
        // First find the current char in each string-part that is closest to the
        // intended cut-position.
        const leftIndex = leftString.lastIndexOf(char);
        const rightIndex = rightString.indexOf(char);
        // If the char was found in the leftString and the distance to the
        // intended cut-position is closer than the old one, update the leftDist.
        if (leftIndex >= 0 && leftString.length - leftIndex < leftDist) {
          leftDist = leftString.length - leftIndex;
        }
        // Same for the rightString.
        if (rightIndex >= 0 && rightIndex < rightDist) {
          rightDist = rightIndex;
        }
      });
      // When all chars were checked in leftString and rightString, and we where
      // the closest cut-position to the intended one is, we can decide if we
      // need to move the cut to the left or the right.
      if (rightDist < leftDist) {
        // increment the rightDist, to include the char that marks the cut-position.
        // Otherwise it would be cut off. Even a space is left dangling if the char
        // was a space. But that will be cut trimmed later if needed.
        rightDist += 1;
        // Updated the shortended string by shortening the rightString before
        // appending it to the leftString.
        shortenedString = leftString + rightString.substring(0, rightDist);
      } else {
        // Similar to the rightDist, the leftDist has to be reduced by one to not
        // cut off the char that is marking the cut, except when the leftDist equals
        // the leftString length. Because in that case, we want to return an empty string.
        leftDist = leftDist === leftString.length ? leftString.length : leftDist - 1;
        // Forgetting about the rightString we just cut off a bit from the leftString
        shortenedString = leftString.substring(0, leftString.length - leftDist);
      }
      // Lastly check if the string was cut at all. If that wasn't the case, we can just return it.
      if (shortenedString === string) {
        return string;
      }
    }

    // Trim the cut end if the settings say so
    if (settings.trim) shortenedString = trimRight(shortenedString);

    // Add appendix and return the new string
    return appendix(shortenedString);
  }

  // Return unmanipulated string
  return string;
};
