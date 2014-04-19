'use strict';

angular.module('icd10App')
  .directive('codeChildren', function () {
    return {
      template: '<td><ul><li ng-repeat="m in code.m">{{m}}</li></ul></td><td><ul><li ng-repeat="d in children track by $index">{{d}}</li></ul></td>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
        var children = [];

        var arrayLength = scope.code.m.length;
        for (var i = 0; i < arrayLength; i++) {
            children.push(scope.dx_children[scope.code.m[i]]);
        }

        scope.children = children;
      }
    };
  });
