'use strict';

angular.module('icd10App')
  .controller('MainCtrl', function ($scope) {
    $scope.query = "B10.8"
    $scope.codes = [
      {"code":"B10.81", "text":"Human herpesvirus 6 infection", "description":"Infection by human herpesvirus 6"},
      {"code":"B10.82", "text":"Human herpesvirus 7 infection", "description":"Infection by human herpesvirus 7"},
      {"code":"B10.89", "text":"Other human herpesvirus infection", "description":"Applicable to human herpesvirus 8 infection or Kaposi's sarcoma-associated herpesvirus infection"}
    ];
  });
