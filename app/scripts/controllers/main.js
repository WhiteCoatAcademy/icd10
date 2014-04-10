'use strict';

angular.module('icd10App')
    .controller('MainCtrl', function ($scope, $http) {
        $scope.query = "B12"
        $http.get('temp-codes.json')
            .then(function(res){
                $scope.codes = res.data;
            });
    });
