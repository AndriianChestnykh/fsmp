(function() {
'use strict';

angular.module('public')
.component('currentInfo', {
  templateUrl: 'app/public/current-info/current-info.template.html',
  controller: CurrentInfoController,
  controllerAs: 'currentInfoCtrl'
});

CurrentInfoController.$inject = ['AccountsService', 'appConfig', '$scope'];
function CurrentInfoController(AccountsService, appConfig, $scope) {
  let currentInfoCtrl = this;

  currentInfoCtrl.currentAccount = AccountsService.getCurrentAccount();
  currentInfoCtrl.contractAddress = appConfig.getContractAddress();
  currentInfoCtrl.httpProvider = appConfig.getHttpProvider();

// 'data' can has 1 of 3 props: currentAccount, contractAddress, httpProvider
  $scope.$on('currentInfo:change', (event, data) => {

    for (let prop in data) {
      if (data.hasOwnProperty(prop))
        currentInfoCtrl[prop] = data[prop];
    }
  });
}

}());
