'use strict';

describe('Filter: boringWords', function () {

  // load the filter's module
  beforeEach(module('icd10App'));

  // initialize a new instance of the filter before each test
  var boringWords;
  beforeEach(inject(function ($filter) {
    boringWords = $filter('boringWords');
  }));

  it('should return the input prefixed with "boringWords filter:"', function () {
    var text = 'angularjs';
    expect(boringWords(text)).toBe('boringWords filter: ' + text);
  });

});
