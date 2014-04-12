'use strict';

describe('Directive: ngDebounce', function () {
  beforeEach(module('icd10App'));

  var element;

  it('should make hidden element visible', inject(function ($rootScope, $compile) {
    element = angular.element('<ng-debounce></ng-debounce>');
    element = $compile(element)($rootScope);
    expect(element.text()).toBe('this is the ngDebounce directive');
  }));
});
