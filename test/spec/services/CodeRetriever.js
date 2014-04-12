'use strict';

describe('Service: CodeRetriever', function () {

  // load the service's module
  beforeEach(module('icd10App'));

  // instantiate service
  var CodeRetriever;
  beforeEach(inject(function (_CodeRetriever_) {
    CodeRetriever = _CodeRetriever_;
  }));

  it('should do something', function () {
    expect(!!CodeRetriever).toBe(true);
  });

});
