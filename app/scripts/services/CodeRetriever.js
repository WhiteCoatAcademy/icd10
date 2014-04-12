'use strict';

angular.module('icd10App')
  // inject angular q and http for promises and server stuff
  // inject API service for constants
  // this service will retrieve codes from the API or from localStorage
  .service('CodeRetriever', function CodeRetriever($http, $q, API) {
    // AngularJS will instantiate a singleton by calling "new" on this function

    // define "global" variables here
    var params = angular.copy(API.params);
    // placeholder for some action directed towards a server...
    // params.ACTION = 'getICD10JSON';
    return {
      fetchFromAPI: function(codeId){
        // this is where we can check local storage for relevant data
        // var currentCode = localStorage.getItem('code_' + codeId);
        // placeholder for when we passs codeId to the server
        params['codeId'] = codeId;
        return $http({url:API.url, params:params, method:'get'}).then(function(response){
            var data;
            if(response.status != 204) {
                data = response.data;
                // this is where we could store the response in local storage
                // localStorage.setItem('code_' + codeId, JSON.stringify(data));
            } else {
                // this is where we could default to existing localStorage value
                // data = currentTopic;
            }
            return data;
        });
      },
      fetchFromLocalStorage: function(codeId){
        // this is where we can extract data from a localStorage service
        // return localStorage.getItem('code_' + codeId).then(function(data){
          // return JSON.parse(data);
        // });
      },
      get: function(codeId){
        // this can be further wrapped in services if we cut upp a call for a code
        // into multiple requests. For now, it's just a direct call
        return this[navigator.onLine ? 'fetchFromAPI' : 'fetchFromLocalStorage'](codeId);
      }

      // TODO: other call to the API could be defined here, or could go into a different service
    }
  });


