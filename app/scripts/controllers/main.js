'use strict';

angular.module('icd10App')
    .controller('MainCtrl', function ($scope, CodeRetriever, $filter) {
        $scope.query = "";
        $scope.currentLimit = 20;
        $scope.codes = [];
        $scope.totalResults = 0;
        $scope.filtered = [];


        CodeRetriever.get('diagnosis_parents').then(function(data){
          $scope.codes = data;
        });
        // get the filter steps into controller,
        // so tht it can be controlled by a watcher
        // and not be defined by the ng-repeat digest cycle
        var filterFilter = $filter('andFilter');
        var limitToFilter = $filter('limitTo');
        // may want to orderBy eventually, here is the filter
        var orderByFilter = $filter('orderBy');
        $scope.search_times = [0,0];
        $scope.$watch('query', function(newVal, oldVal){
          $scope.search_times[0] = Date.now();
          $scope.filtered = filterFilter($scope.codes, $scope.query)
          $scope.search_times[1] = Date.now();
        })

        // Get child codes later on.
        CodeRetriever.get('diagnosis_children').then(function(data){
          $scope.dx_children = data;
        });

    });
