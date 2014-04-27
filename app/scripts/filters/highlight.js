'use strict';
// INSPIRED BY ANGULAR-UI
/**
 * Wraps the
 * @param text {string} haystack to search through
 * @param search {string} needle to search for
 * @param [caseSensitive] {boolean} optional boolean to use case-sensitive searching
 */
angular.module('icd10App')
.filter('highlight', function () {
  return function (text, search, caseSensitive, cssClass) {
    cssClass = cssClass || 'ui-match';
    if (text && (search || angular.isNumber(search))) {
      text = text.toString();
      search = search.toString();
      if (caseSensitive) {
        return text.split(search).join('<span class="'+cssClass+'">' + search + '</span>');
      } else {
        return text.replace(new RegExp(search, 'gi'), '<span class="'+cssClass+'">$&</span>');
      }
    } else {
      return text;
    }
  };
});