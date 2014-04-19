'use strict';

angular.module('icd10App')
    .controller('MainCtrl', function ($scope, CodeRetriever, $filter, $location, $routeParams) {
        $scope.query = $routeParams.q || "";
        $scope.currentLimit = 20;
        $scope.codes = [];
        $scope.totalResults = 0;
        $scope.filtered = [];

        // we are binding to scope variables here, but this kind of thing can be handled
        // with $broadcast of loading events. That is better if there are multiple controllers
        // or if we want global awareness of loading
        // for now, this is a reasonable simple solution
        $scope.isParentDataLoaded = false;
        $scope.isChildrenDataLoaded = false;
        CodeRetriever.get('diagnosis_parents').then(function(data){
          $scope.codes = data;
          $scope.isParentDataLoaded = true;
          $scope.updateResults($scope.query, "");
          // this can be cleaned up as a chain of promises
          // but the way you had it before, both files
          // would have been called as part of the main thread!
          CodeRetriever.get('diagnosis_children').then(function(data){
            // right now we are loading ALL children diagnoses
            // if we instead only loaded those children whose parents were clicked on
            // then the approach would be different;
            $scope.dx_children = data;
            $scope.isChildrenDataLoaded = true;
          });
        });

        var andFilter = $filter('andFilter');
        var boringWordsFilter = $filter('boringWords');
        var limitToFilter = $filter('limitTo');
        // may want to orderBy eventually, here is the filter
        var orderByFilter = $filter('orderBy');

        $scope.search_times = [0,0];
        $scope.$watch('query', function(newVal, oldVal){
          $scope.updateResults(newVal, oldVal)
        });

        $scope.updateResults = function(newVal, oldVal){
          var cleanQuery = boringWordsFilter(newVal);
          // only do the filter if the filtered query (without boring words)
          if(cleanQuery !== boringWordsFilter(oldVal)){
              $scope.search_times[0] = Date.now();
              $scope.filtered = andFilter($scope.codes, cleanQuery);
              $scope.search_times[1] = Date.now();
              $location.search('q', cleanQuery);
          }
        }
    });