(function() {
'use strict';

angular.module('public')
.component('syncModal', {
  templateUrl: 'app/public/contract-page/sync-modal/sync-modal.template.html',
  bindings: {
    resolve: '<',
    close: '&',
    dismiss: '&'
  },
  controller: SyncModalController,
  controllerAs: 'syncModalCtrl'
});

SyncModalController.$inject = ['SyncService'];
function SyncModalController(SyncService) {
  let syncModalCtrl = this;

  syncModalCtrl.$onInit = () => {
    syncModalCtrl.deviceId = syncModalCtrl.resolve.deviceId;
    syncModalCtrl.deviceName = syncModalCtrl.resolve.deviceName;
    syncModalCtrl.apiKey = SyncService.getApiKey();
  };

  syncModalCtrl.ok = () => {
    syncModalCtrl.close({$value: syncModalCtrl.deviceId});
  };

  syncModalCtrl.cancel = () => {
    syncModalCtrl.dismiss({$value: 'cancel'});
  };

  syncModalCtrl.getConfig = () => {
    SyncService.getCfg((cfg) => {
      let json = JSON.stringify(cfg.devices, null, 2);
      syncModalCtrl.configResult = json;
      console.log(json);
    });
  };

  syncModalCtrl.addDevice = () => {
    SyncService.checkDeviceId(syncModalCtrl.deviceId, (response) => {
    	console.log(response)

    	if(response.data.error){
        syncModalCtrl.message = response.data.error;
    	} else if (response.data.id){
    		getCfg((cfg) => {
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

    			SyncService.updateCfg(cfg, (status) => {
      				if(status == 200){
      					syncModalCtrl.message = 'success';
      				}
        		})
    		});
    	} // end else if
    });
  };
}

}());
