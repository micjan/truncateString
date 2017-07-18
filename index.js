module.exports = function(string, length, options) {
  // Initially handle the params
  if (typeof string !== 'string') return '';
  if (typeof length !== 'number' || length < 0) return string;
  if (typeof options !== 'object') options = {};

  // Base settings
  var settings = {
    threshold: length,
    appendix: '…',
  };

  // Overwrite settings with options if they are valid
  if (options.threshold && typeof options.threshold === 'number' && options.threshold > 0) settings.threshold = options.threshold;
  if (typeof options.appendix === 'string') settings.appendix = options.appendix;

  // Check if string is long enough for truncation
  if (string.length > (settings.threshold || length) && string.length > length) {
    var shortenedString = string.substring(0, length);

    return shortenedString + settings.appendix;
  }

  // Otherwise return string as is
  return string;
};
