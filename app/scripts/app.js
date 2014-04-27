'use strict';

angular.module('icd10App', ['ngRoute','ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .when('/code/:code', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        reloadOnSearch: false
      })
      .when('/:q', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        redirectTo: '/'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
