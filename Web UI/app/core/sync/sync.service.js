(function() {
'use strict';

angular.module('core')
.service('SyncService', SyncService);

SyncService.$inject = ['$http'];
function SyncService($http) {
  let service = this;
  // development
  let baseUrl = '';
  // let baseUrl = 'http://localhost:8384';

  // development
  let apiKey = '';
  // let apiKey = 'LhrjDydde9XMQyHGZ6qnakyMhFvUmbfX';
  let myDeviceId = '';

  // fetch API key from the server
  // fetchApiKey('http://127.0.0.1:8080/syncthingoptions');

  service.setBaseUrl = (url) => {
    baseUrl = url;
    console.log('Syncthing API Address ->', baseUrl);
  };
  service.getBaseUrl = () => baseUrl;

  service.getApiKey = () => apiKey;
  service.setApiKey = (newApiKey) => {
    apiKey = newApiKey;
    // refresh user's device ID
    service.getCfg((cfg) => {
      myDeviceId = cfg.devices[0].deviceID;
    });
  };

  service.getMyDeviceId = () => myDeviceId;

  service.setMyDeviceId = (newDeviceId) => {
    myDeviceId = newDeviceId;
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
      callback(response.status)
    }, (error) => {
      console.log(error)
    })
  };

  service.removeDevice = (deviceId) => {
    service.getCfg((cfg) => {
    	let len = cfg.devices.length;
      let index = 0; // index of the default filder

    	cfg.devices = cfg.devices.filter(d => {
    		return d.deviceID != deviceId;
    	});

      for (let n = cfg.folders.length; index < n; index++) {
        if (cfg.folders[index].id == 'default') break;
      }

      cfg.folders[index].devices = cfg.folders[index].devices.filter(d => {
        return d.deviceID != deviceId;
      });

    	if(len == cfg.devices.length){
    		console.log("No device with id: " + deviceId);
    	} else {
    		service.updateCfg(cfg, (status) => {
    			if(status == 200){
    				console.log('Device deleted');
    			}
        })
    	}
    })
	}; // end removeDevice

  // function fetchApiKey(url) {
  //   $http({
  //     method: 'GET',
  //     url: url
  //   }).then((response) => {
  //     console.log(response.data);
  //   }, (error) => {
  //     console.log(error);
  //   });
  // }

}

}());
