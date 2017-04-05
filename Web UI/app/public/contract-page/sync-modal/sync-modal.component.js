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

SyncModalController.$inject = ['SyncService', 'Web3Service'];
function SyncModalController(SyncService, Web3Service) {
  let syncModalCtrl = this;

  let index, id, type;
  let web3 = Web3Service.getWeb3();

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

  syncModalCtrl.setApiKey = (newApiKey) => {
    SyncService.setApiKey(newApiKey);

    //get my device id
    SyncService.getCfg((cfg) => {
      syncModalCtrl.myDeviceId = cfg.devices[0].deviceID;
      SyncService.setMyDeviceId(syncModalCtrl.myDeviceId);
    });
  };

  //send parameters to create storage contract in orders-table
  syncModalCtrl.ok = () => {
    let storageContractArgs = {
      partnerDeviceId: syncModalCtrl.deviceId,
      myDeviceId: syncModalCtrl.myDeviceId,
      index,
      id,
      type,
      weiInitialAmount: web3
          .toWei(syncModalCtrl.weiInitialAmount, 'ether')
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
          let index = 0; // index of the default filder

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
}

}());
