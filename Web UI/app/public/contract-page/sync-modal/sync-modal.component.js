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

  //get my device id
  // SyncService.getCfg((cfg) => {
  //   syncModalCtrl.myDeviceId = cfg.devices[0].deviceID;
  // });

  let index, id, type;

  syncModalCtrl.$onInit = () => {
    syncModalCtrl.myDeviceId = SyncService.getMyDeviceId();

    syncModalCtrl.deviceId = syncModalCtrl.resolve.deviceId;
    syncModalCtrl.deviceName = syncModalCtrl.resolve.deviceName;
    index = syncModalCtrl.resolve.index;
    id = syncModalCtrl.resolve.id;
    type = syncModalCtrl.resolve.type;
    syncModalCtrl.apiKey = SyncService.getApiKey();

    syncModalCtrl.creationAllowed = false;
  };

  //send parameters to create storage contract in orders-table
  syncModalCtrl.ok = () => {
    let storageContractArgs = {
      partnerDeviceId: syncModalCtrl.deviceId,
      myDeviceId: syncModalCtrl.myDeviceId,
      index,
      id,
      type,
      weiInitialAmount: syncModalCtrl.weiInitialAmount
    };
    syncModalCtrl.close({$value: storageContractArgs});
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

    	if(response.data.error){
        syncModalCtrl.message = response.data.error;
    	} else if (response.data.id){

    		SyncService.getCfg((cfg) => {
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

          var defaultFolder = cfg.folders.filter(folder => {
            folder.id == 'default'  
          })[0]

          var i = cfg.folders.indexOf(defaultFolder)

          cfg.folders[i].devices.push({
              'deviceID': syncModalCtrl.deviceId
              'introducedBy':''
          })

    			SyncService.updateCfg(cfg, (status) => {
      				if(status == 200){
      					syncModalCtrl.message = 'success';
                // alow creation od SC
                syncModalCtrl.creationAllowed = true;
      				}
        		})
    		});
    	} // end else if
    });
  };
}

}());
