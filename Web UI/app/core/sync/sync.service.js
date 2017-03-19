(function() {
'use strict';

angular.module('core')
.service('SyncService', SyncService);

SyncService.$inject = ['$http'];
function SyncService($http) {
  let service = this;
  let baseUrl = 'http://localhost:8384';
  let apiKey = 'r4ZaVkfv56PaAQgiYsHVkYkFZsGsXN6G';

  service.getApiKey = () => {
    return apiKey;
  };

  service.getCfg = (callback) => {
    var req = {
      method: 'GET',
      url : baseUrl + '/rest/system/config',
      headers : {
        'X-API-Key': apiKey
      }
    };

    $http(req).then((response) => {
      callback(response.data);
    }, (error) => {
      console.log(error);
    });
  };

  service.checkDeviceId = (deviceId, callback) => {
    let req = {
      method: 'GET',
      url : baseUrl + '/rest/svc/deviceid?id=' + deviceId,
      headers : {
        'X-API-Key': apiKey
      }
    };
    $http(req).then((response) => {
      callback(response);
    }, (error) => {
      console.log(error.status);
    });
  };

  service.updateCfg = (cfg, callback) => {
    var req = {
      method: 'POST',
      url : baseUrl + '/rest/system/config',
      headers : {
        'X-API-Key': apiKey
      },
      data: cfg
    };
    $http(req).then((response) => {
      console.log(response)
      callback(response.status)
    }, (error) => {
      console.log(error)
    })
  };
}

}());
