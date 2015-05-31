'use strict';

var through = require('through2');
var path = require('path');
var rs = require('replacestream');

module.exports = function(base) {

  var search = /url\((['"]?)(.+?)\1\)/g;
  var excludes = ['/', 'data:', 'http:', 'https:'];

  var doReplace = function(file, enc, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }

    var replacement = function (match, quote, content, index, string) {
      for (var i = 0, len = excludes.length; i < len; i++) {
        if (content.indexOf(excludes[i]) === 0) {
          return match;
        }
      }

      var sourceName = path.basename(content);
      var sourcePath = path.resolve(path.dirname(file.path), path.dirname(content));
      var newSourceRelativePath = path.relative(base, sourcePath);
      var newUrl = [
        'url(',
          quote,
            path.join(newSourceRelativePath, sourceName),
          quote,
        ')'
      ].join('');

      return newUrl;
    }

    function doReplace() {
      if (file.isStream()) {
        file.contents = file.contents.pipe(rs(search, replacement));
        return callback(null, file);
      }

      if (file.isBuffer()) {
        if (search instanceof RegExp) {
          file.contents = new Buffer(String(file.contents).replace(search, replacement));
        }
        return callback(null, file);
      }

      callback(null, file);
    }

    doReplace();
  };

  return through.obj(doReplace);
};
