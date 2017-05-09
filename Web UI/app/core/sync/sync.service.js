(function() {
'use strict';

angular.module('core')
.service('SyncService', SyncService);

SyncService.$inject = ['$http', '$window'];
function SyncService($http, $window) {
  let service = this;

  // try to retrieve from previous sessions
  let baseUrl = $window.localStorage.syncAddress || null;
  let apiKey = $window.localStorage.syncApiKey || null;
  let myDeviceId = $window.localStorage.syncDeviceId || null;
  
  // let baseUrl = 'http://localhost:8384';
  // let apiKey = 'LhrjDydde9XMQyHGZ6qnakyMhFvUmbfX';
  

  // fetch API key from the server
  // fetchApiKey('http://127.0.0.1:8080/syncthingoptions');

  service.setBaseUrl = (url) => {
    baseUrl = url;
    $window.localStorage.setItem('syncAddress', url);
  };
  service.getBaseUrl = () => baseUrl;

  service.getApiKey = () => apiKey;
  service.setApiKey = (newApiKey) => {
    apiKey = newApiKey;
    // refresh user's device ID
    service.getCfg((cfg) => {
      myDeviceId = cfg.devices[0].deviceID;
      $window.localStorage.setItem('syncDeviceId', myDeviceId);
    });
    $window.localStorage.setItem('syncApiKey', newApiKey);
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


  service.addDevice = () => {
    SyncService.checkDeviceId(syncModalCtrl.deviceId, (response) => {

    	if(response.data.error){
        syncModalCtrl.message = response.data.error;
    	} else if (response.data.id){

    		SyncService.getCfg((cfg) => {
          let index = 0; // index of the default folder

    			cfg.devices.push({
    				'deviceID': syncModalCtrl.deviceId,
    				'name': syncModalCtrl.deviceName,
    				'addresses':["dynamic"],
    				"compression":"metadata",
    				"certName":"",
    				"introducer":false,
    				"skipIntroductionRemovals":false,
    				"introducedBy":"",
    				"paused":false
    			});

          for (let n = cfg.folders.length; index < n; index++) {
            if (cfg.folders[index].id == 'default') break;
          }

          cfg.folders[index].devices.push({
            'deviceID': syncModalCtrl.deviceId,
            'introducedBy': ''
          });

    			SyncService.updateCfg(cfg, (status) => {
      				if(status == 200){
      					syncModalCtrl.message = 'success';
                // alow creation of SC
                syncModalCtrl.creationAllowed = true;
      				}
        		})
    		});
    	} // end else if
    });
  };


  service.removeDevice = (deviceId) => {
    service.getCfg((cfg) => {
    	let len = cfg.devices.length;
      let index = 0; // index of the default folder

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
