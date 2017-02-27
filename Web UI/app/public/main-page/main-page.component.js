(function() {
'use strict';

angular.module('public')
  .component('mainPage', {
    templateUrl: 'app/public/main-page/main-page.template.html',
    controller: mainPageController,
    controllerAs: 'mainPageCtrl'
  });

mainPageController.$inject = ['appConfig'];

function mainPageController(appConfig) {
  const mainPageCtrl = this;

  mainPageCtrl.setContractAddress = (addr) => {
    appConfig.setContractAddress(addr);
  };

  mainPageCtrl.setHttpProvider = (prov) => {
    appConfig.setHttpProvider(prov);
  };
}

}());
