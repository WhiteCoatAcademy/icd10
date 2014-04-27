'use strict';

angular.module('icd10App')
  .filter('andFilter', function (filterFilter) {
    return function (searchArray, queryString, filterByKeysArray) {
      var resultsArrayByKey = {};
      var results = [];
      angular.forEach(filterByKeysArray, function(key){
        resultsArrayByKey[key] = searchArray;
      });

      if(queryString){
        var queryParts = queryString.split(' ');
        angular.forEach(queryParts, function(value){
          angular.forEach(filterByKeysArray, function(key){
            var queryObject = {};
            queryObject[key] = value;
            resultsArrayByKey[key] = filterFilter(resultsArrayByKey[key], queryObject);
          })
        });
      }
      angular.forEach(resultsArrayByKey, function(value){
        results = _.union(results, value);

      });


      return results;
    };
  });
