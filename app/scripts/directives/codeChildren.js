'use strict';

angular.module('icd10App')
  .directive('codeChildren', function () {
    return {
      templateUrl: 'views/code_children.html',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
      }
    };
  });
