(function() {
'use strict';

angular.module('public')
.component('storageContracts', {
  templateUrl: 'app/public/contract-page/storage-contracts/storage-contracts.template.html',
  controller: StorageContractsController,
  controllerAs: 'SCCtrl',
  bindings: {
    scData: '<',
    owner: '@',
    etherPrice: '@',
    onContractManage: '&'
  }
});

StorageContractsController.$inject = ['AccountsService', '$scope'];
function StorageContractsController(AccountsService, $scope) {
  let SCCtrl = this;

  SCCtrl.currentAccount = AccountsService.getCurrentAccount();

  SCCtrl.inEther = {
    pricePerGB: false,
    weiLeftToWithdraw: false,
    weiAllowedToWithdraw: false
  };

  $scope.$on('currency:change', (event, data) => {
    let prop = data.cathegory;
    SCCtrl.inEther[prop] = data.ether;    
  });


  SCCtrl.manageStorageContract = manageStorageContract;

  function manageStorageContract (storageContractIndex,
                                  storageContractID,
                                  method,
                                  wei) {
    SCCtrl.onContractManage({
      storageContractIndex: storageContractIndex,
      storageContractID: storageContractID,
      method: method,
      wei: wei
    });
  } // end manageStorageContract
}

}());
