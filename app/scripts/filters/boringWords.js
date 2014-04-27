'use strict';

angular.module('icd10App')
  .filter('boringWords', function (filterFilter) {
    var boringWordsRegExp = new RegExp("\\b(?:and|or|of|for|on|the|due|to|in|not|as|with|without|disease)\\b", "gi");
    return function (input) {
      return input.replace(boringWordsRegExp, '');
    };
  });
