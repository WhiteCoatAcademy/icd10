'use strict';

angular.module('icd10App')
  .directive('codeChildren', function () {
    return {
      template: '<td><ul><li ng-repeat="m in code.m">{{m}}</li></ul></td><td><ul><li ng-repeat="m in code.m">lookup {{m}} in children json</li></ul></td>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {

      }
    };
  });
