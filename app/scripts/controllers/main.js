'use strict';

angular.module('icd10App')
  .controller('MainCtrl', function ($scope) {
    $scope.query = "icd"
    $scope.codes = [
      {"code":"ICD1", "text":"Code one", "description":"Description 1"},
      {"code":"ICD2", "text":"Code Two", "description":"Description 2"},
      {"code":"ICD3", "text":"Code Three", "description":"Description 3"}
    ];
  });
