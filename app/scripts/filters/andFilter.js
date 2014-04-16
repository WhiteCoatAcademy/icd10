'use strict';

angular.module('icd10App')
  .filter('andFilter', function (filterFilter) {
    return function (searchArray, queryString) {
      var results = searchArray;
      if(queryString){
        var queryParts = queryString.split(' ');
        angular.forEach(queryParts, function(value, key){
          // TODO: make this modular.
          results = filterFilter(results, {'k': value});
        });
      }
      return results;
    };
  });
