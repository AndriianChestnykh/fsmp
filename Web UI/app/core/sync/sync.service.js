(function() {
'use strict';

angular.module('core')
.service('SyncService', SyncService);

SyncService.$inject = ['$http'];
function SyncService($http) {
  let service = this;
  let baseUrl = 'http://localhost:8384';
  let apiKey = 'LhrjDydde9XMQyHGZ6qnakyMhFvUmbfX';
  let myDeviceId = '';

  service.getApiKey = () => apiKey;
  service.getMyDeviceId = () => myDeviceId;

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

  // get my device id
  service.getCfg((cfg) => {
    myDeviceId = cfg.devices[0].deviceID;
  });

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
    	var len = cfg.devices.length;

    	cfg.devices = cfg.devices.filter(d => {
    		d.deviceID != deviceId;
    	});

      var defaultFolder = cfg.folders.filter(folder => {
        folder.id == 'default'  
      })[0]

      var i = cfg.folders.indexOf(defaultFolder)

      cfg.folders[i].devices = cfg.folders[i].devices.filter(d => {
        d.deviceID != deviceId;  
      }) 

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
	}
}

}());
