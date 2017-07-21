module.exports = function truncateString(string, length, options = {}) {
  // Initially handle the params
  if (typeof string !== 'string') return '';
  if (typeof length !== 'number' || length < 0) return string;

  // Base settings
  const settings = {
    threshold: length,
    appendix: '…',
    trim: true,
  };

  // Overwrite settings with options if they are valid
  if (options.threshold && typeof options.threshold === 'number' && options.threshold > 0) settings.threshold = options.threshold;
  if (typeof options.appendix === 'string') settings.appendix = options.appendix;
  if (typeof options.trim !== 'undefined') settings.trim = options.trim;

  // Check if string is long enough for truncation
  if (string.length > settings.threshold && string.length > length) {
    // Shorten the String
    let shortenedString = string.substring(0, length);

    // Trim the cut end if the settings say so
    if (settings.trim) shortenedString = shortenedString.replace(/ +$/, '');

    // Add appendix and return the new string
    return `${shortenedString}${settings.appendix}`;
  }

  // Return unmanipulated string
  return string;
};
