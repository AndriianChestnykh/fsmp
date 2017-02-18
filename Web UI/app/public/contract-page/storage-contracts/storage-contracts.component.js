(function() {
'use strict';

angular.module('public')
.component('storageContracts', {
  templateUrl: 'app/public/contract-page/storage-contracts/storage-contracts.template.html',
  controller: storageContractsController,
  controllerAs: 'storageContractsCtrl',
  bindings: {
    scData: '<',
    onContractManage: '&'
  }
});

function storageContractsController() {
  let storageContractsCtrl = this;

  storageContractsCtrl.manageStorageContract = (storageContractIndex,
                                                storageContractID,
                                                method) => {
    storageContractsCtrl.onContractManage({
      storageContractIndex: storageContractIndex,
      storageContractID: storageContractIndex,
      method: method
    });
  };
}

}());
