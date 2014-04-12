'use strict';

angular.module('icd10App')
    .controller('MainCtrl', function ($scope, CodeRetriever) {
        $scope.query = "hel";
        $scope.currentLimit = 20;
        $scope.codes = [];
        $scope.filtered = [];
        CodeRetriever.get().then(function(data){
          $scope.codes = data;
        });
    });
