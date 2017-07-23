module.exports = function truncateString(string, length, options = {}) {
  // Prepare base settings
  const settings = {
    appendix: '…',
    cutChars: [],
    threshold: length,
    trim: true,
    verbose: options.verbose,
  };

  // Helper to get the return value depending on the vebose setting.
  const getResult = (str, prts) => {
    if (settings.verbose) {
      return {
        result: str,
        parts: prts || [str],
        wasCut: !!prts,
      };
    }
    return str;
  };

  // Handle the params and return instantly if necessecary
  if (typeof string !== 'string') return getResult('');
  if (typeof length !== 'number' || length < 0) return getResult(string);

  // Validate options.threshold
  if (options.threshold && typeof options.threshold === 'number' && options.threshold > 0) {
    settings.threshold = options.threshold;
  }

  // If string will never be cut we stop it here by returning the string as it was passed.
  if (string.length <= settings.threshold || string.length <= length) return getResult(string);

  // Validate options.appendix
  if (typeof options.appendix === 'string') {
    settings.appendix = options.appendix;
  }

  // Validate options.cutChars
  if (typeof options.cutChars === 'string' && options.cutChars.length === 1) {
    settings.cutChars.push(options.cutChars);
  } else if (Object.prototype.toString.call(options.cutChars) === '[object Array]') {
    options.cutChars.forEach((char) => {
      if (typeof char === 'string' && char.length === 1) {
        settings.cutChars.push(char);
      }
    });
  }

  // Validate options.trim
  if (typeof options.trim !== 'undefined') {
    settings.trim = options.trim;
  }

  // Cache the intended cut-position because it may change later
  let cutAt = length;

  // Do this only if cutChars are defined.
  if (settings.cutChars.length > 0) {
    // Split the string in left and right parts by cutting it at the intended
    // cup-position and cache the initial cut-position-offsets relative
    // to that intended cut-position.
    // By doing that, we now know how much to the left or right we have to move
    // to make a permitted cut.
    const leftString = string.substring(0, cutAt);
    let leftCutOffset = leftString.length;
    const rightString = string.substring(cutAt);
    let rightCutOffset = rightString.length;

    // Looping through all cutChars, updating the leftCutOffset and rightCutOffset vars
    // if a char was found in leftString or rightString that is closer to the
    // intended cut-position than the previous cut-position-offsets on each side.
    settings.cutChars.forEach((char) => {
      // First find the current char in each string-part that is closest to the
      // intended cut-position.
      const leftIndex = leftString.lastIndexOf(char); // Rightmost Char
      const rightIndex = rightString.indexOf(char); // Leftmost Char
      // If the char was found in the leftString && the offset to the
      // intended cut-position is closer than the old one, update the leftCutOffset.
      if (leftIndex >= 0 && leftString.length - leftIndex < leftCutOffset) {
        leftCutOffset = leftString.length - leftIndex;
      }
      // Same for the rightString.
      if (rightIndex >= 0 && rightIndex < rightCutOffset) {
        rightCutOffset = rightIndex;
      }
    });

    // When all chars were checked in leftString and rightString, and we know where
    // the closest cut-position to the intended one is, we can decide if we
    // need to move the cut to the left or the right.
    if (rightCutOffset < leftCutOffset) {
      // increment the rightCutOffset, to include the char that marks the cut-position.
      // Otherwise it would be cut off. Even a space is left dangling if the char
      // was a space. But that will be trimmed later if needed.
      rightCutOffset += 1;
      // Updated the cutAt-var by adding the rightCutOffset the the leftString.length.
      cutAt = leftString.length + rightCutOffset;
    } else {
      // Similar to the rightCutOffset, the leftCutOffset has to be reduced by one to not
      // cut off the char that is marking the cut, except when the leftCutOffset equals
      // the leftString length. Because in that case, the cut should be made on the start
      // of the string resulting in an empty string to return.
      leftCutOffset = leftCutOffset === leftString.length ? leftString.length : leftCutOffset - 1;
      // Updating the cutAt-var
      cutAt = leftString.length - leftCutOffset;
    }
  }

  // Check if the string will be cut at all. If that isn't the case, we can just return it.
  if (string.length <= cutAt) return getResult(string);

  // Shorten the String
  const parts = [
    string.substring(0, cutAt),
    string.substring(cutAt),
  ];

  // Remove all spaces on the cut end if the settings say so
  let result = settings.trim ? parts[0].replace(/ +$/, '') : parts[0];

  // Add appendix
  result = `${result}${settings.appendix}`;

  // Return the result
  return getResult(result, parts);
};
