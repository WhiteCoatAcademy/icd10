'use strict';
// INSPIRED BY ANGULAR-UI
/**
 * Wraps the
 * @param text {string} haystack to search through
 * @param search {string} needle to search for
 * @param [isMatchExact] {boolean} optional boolean to use exact searching searching
 */
angular.module('icd10App')
.filter('highlight', function () {
  return function (text, search, isMatchExact, cssClass) {
    cssClass = cssClass || 'ui-match';
    if (text && (search || angular.isNumber(search))) {
      text = text.toString();
      search = search.toString();
      if (isMatchExact) {
        return text.split(search).join('<span class="'+cssClass+'">' + search + '</span>');
      } else {
        _.each(search.split(' '), function(word){
          if(word.length>1){
            text = text.replace(new RegExp(word, 'gi'), '####$&????');
          }
          // console.log(text)
          text = text.replace('####', '<span class="'+cssClass+'">');
          text = text.replace('????', '</span>');
        })
        return text;
      }
    } else {
      return text;
    }
  };
});