(function() {
'use strict';

angular.module('public')
  .component('mainPage', {
    templateUrl: 'app/public/main-page/main-page.template.html',
    controller: mainPageController,
    controllerAs: 'mainPageCtrl'
  });

mainPageController.$inject = ['appConfig', 'SyncService'];

function mainPageController(appConfig, SyncService) {
  const mainPageCtrl = this;

  mainPageCtrl.setContractAddress = (addr) => {
    appConfig.setContractAddress(addr);
  };

  mainPageCtrl.setHttpProvider = (prov) => {
    appConfig.setHttpProvider(prov);
  };

  mainPageCtrl.setEtherPrice = (price) => {
    appConfig.setEtherPrice(price);
  };

  mainPageCtrl.setSyncApiKey = (key) => {
    SyncService.setApiKey(key);
  };

  mainPageCtrl.setSyncApiAddress = (addr) => {
    SyncService.setBaseUrl(addr);
  };

  $.get('http://127.0.0.1:8080/syncthingoptions', json => {
    var data = JSON.parse(json)
    SyncService.setApiKey(data['apikey']| || '');
    SyncService.setBaseUrl(data['baseurl'] || '');
  })
}

}());
