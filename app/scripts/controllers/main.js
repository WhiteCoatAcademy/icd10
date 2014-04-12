'use strict';

angular.module('icd10App')
    .controller('MainCtrl', function ($scope, CodeRetriever) {
        $scope.query = "B12";
        $scope.currentLimit = 20;
        $scope.codes = [];
        CodeRetriever.get().then(function(data){
          $scope.codes = data;
        });
    });
