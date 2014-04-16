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

        // TODO: Modularize or clean this later?
        // Since we filter these words when generating keyword lists, you can't really search for them (!).
        var boringWords = new RegExp("\\b(?:and|or|of|on|the|due|to|in|with|without|disease)\\b", "gi");

        $scope.search_times = [0,0];
        $scope.$watch('query', function(newVal, oldVal){
          $scope.search_times[0] = Date.now();
          $scope.filtered = filterFilter($scope.codes, $scope.query.replace(boringWords, ''));
          $scope.search_times[1] = Date.now();
        });

        // Awesome toggle hack, via:
        // https://stackoverflow.com/questions/17544048/multi-level-tables-inside-another-if-clicked
        $scope.toggleChildren = function($index) {
            $scope.activePosition = $scope.activePosition == $index ? -1 : $index;
        };

        // Get child codes later on.
        CodeRetriever.get('diagnosis_children').then(function(data){
          $scope.dx_children = data;
        });


    });
