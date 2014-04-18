'use strict';

describe('Directive: codeChildren', function () {
  beforeEach(module('icd10App'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<code-children></code-children>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the codeChildren directive');
  }));
});
