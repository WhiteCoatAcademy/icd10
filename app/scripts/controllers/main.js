'use strict';

angular.module('icd10App')
    .controller('MainCtrl', function ($scope, CodeRetriever, $filter, $location, $routeParams) {
        $scope.query = $routeParams.q || "";
        $scope.currentLimit = 20;
        $scope.codes = [];
        $scope.totalResults = 0;
        $scope.filtered = [];


        CodeRetriever.get('diagnosis_parents').then(function(data){
          $scope.codes = data;
          // this can be cleaned up as a chain of promises
          // but the way you had it before, both files
          // would have been called as part of the main thread!
          CodeRetriever.get('diagnosis_children').then(function(data){
            $scope.dx_children = data;
          });
        });

        // get the filter steps into controller,
        // so tht it can be controlled by a watcher
        // and not be defined by the ng-repeat digest cycle
        var andFilter = $filter('andFilter');
        var boringWordsFilter = $filter('boringWords');
        var limitToFilter = $filter('limitTo');
        // may want to orderBy eventually, here is the filter
        var orderByFilter = $filter('orderBy');

        $scope.search_times = [0,0];
        var cleanQuery;
        $scope.$watch('query', function(newVal, oldVal){
          cleanQuery = boringWordsFilter($scope.query);
          // only do the filter if the filtered query (without boring words)
          if(cleanQuery !== boringWordsFilter(oldVal)){
            $scope.search_times[0] = Date.now();
            $scope.filtered = andFilter($scope.codes, cleanQuery);
            $scope.search_times[1] = Date.now();
            $location.search('q', cleanQuery);
          }
        });

        // Better to leave this stuff out of the controller and into a directive
        //
        // Awesome toggle hack, via:
        // https://stackoverflow.com/questions/17544048/multi-level-tables-inside-another-if-clicked
        $scope.toggleChildren = function($index) {
            $scope.activePosition = $scope.activePosition == $index ? -1 : $index;
        };

    });
