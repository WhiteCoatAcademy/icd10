'use strict';

describe('Filter: andFilter', function () {

  // load the filter's module
  beforeEach(module('icd10App'));

  // initialize a new instance of the filter before each test
  var andFilter;
  beforeEach(inject(function ($filter) {
    andFilter = $filter('andFilter');
  }));

  it('should return the input prefixed with "andFilter filter:"', function () {
    var text = 'angularjs';
    expect(andFilter(text)).toBe('andFilter filter: ' + text);
  });

});
