(function() {
'use strict';

angular.module('public')
.component('storageContracts', {
  templateUrl: 'app/public/contract-page/storage-contracts/storage-contracts.template.html',
  controller: StorageContractsController,
  controllerAs: 'SCCtrl',
  bindings: {
    scData: '<',
    owner: "@",
    onContractManage: '&'
  }
});

StorageContractsController.$inject = ['AccountsService'];
function StorageContractsController(AccountsService) {
  let SCCtrl = this;

  SCCtrl.currentAccount = AccountsService.getCurrentAccount();

  SCCtrl.manageStorageContract = (storageContractIndex,
                                  storageContractID,
                                  method,
                                  wei) => {
    SCCtrl.onContractManage({
      storageContractIndex: storageContractIndex,
      storageContractID: storageContractID,
      method: method,
      wei: wei
    });
  };
}

}());
