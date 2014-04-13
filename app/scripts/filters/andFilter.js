'use strict';

angular.module('icd10App')
  .filter('andFilter', function (filterFilter) {
    return function (searchArray, queryString) {
      var results = searchArray;
      if(queryString){
        var queryParts = queryString.split(' ');
        angular.forEach(queryParts, function(value, key){
          results = filterFilter(results, value);
        });
      }
      return results;
    };
  });
