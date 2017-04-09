(function() {
'use strict';

angular.module('core')
  .service('appConfig', AppConfig);

AppConfig.$inject = ['$rootScope', '$window']
function AppConfig($rootScope, $window) {
  let appConfig = this;

  appConfig.abi = [{"constant":false,"inputs":[{"name":"storageContractIndex","type":"uint256"},{"name":"storageContractID","type":"uint256"}],"name":"refillStorageContract","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"orderIndex","type":"uint256"},{"name":"orderID","type":"uint256"},{"name":"orderType","type":"uint256"},{"name":"connectionInfo","type":"string"}],"name":"createStorageContract","outputs":[{"name":"newStorageContractID","type":"uint256"}],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"sellOrderIndex","type":"uint256"}],"name":"getSellOrder","outputs":[{"name":"id","type":"uint256"},{"name":"DSO","type":"address"},{"name":"volume","type":"uint256"},{"name":"pricePerGB","type":"uint256"},{"name":"DSOConnectionInfo","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"volumeGB","type":"uint256"},{"name":"pricePerGB","type":"uint256"},{"name":"DSOConnectionInfo","type":"string"}],"name":"createSellOrder","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"sellOrdersLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"storageContractsLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"buyOrdersLength","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"buyOrderIndex","type":"uint256"},{"name":"buyOrderID","type":"uint256"}],"name":"cancelBuyOrder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"storageContractIndex","type":"uint256"},{"name":"storageContractID","type":"uint256"}],"name":"startStorageContract","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"volumeGB","type":"uint256"},{"name":"pricePerGB","type":"uint256"},{"name":"DOConnectionInfo","type":"string"}],"name":"createBuyOrder","outputs":[],"payable":true,"type":"function"},{"constant":true,"inputs":[{"name":"buyOrderIndex","type":"uint256"}],"name":"getBuyOrder","outputs":[{"name":"id","type":"uint256"},{"name":"DO","type":"address"},{"name":"volume","type":"uint256"},{"name":"pricePerGB","type":"uint256"},{"name":"weiInitialAmount","type":"uint256"},{"name":"DOConnectionInfo","type":"string"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"storageContractIndex","type":"uint256"},{"name":"storageContractID","type":"uint256"}],"name":"stopStorageContract","outputs":[{"name":"withdrawedWei","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"sellOrderIndex","type":"uint256"},{"name":"sellOrderID","type":"uint256"}],"name":"cancelSellOrder","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"storageContractIndex","type":"uint256"}],"name":"getStorageContract","outputs":[{"name":"id","type":"uint256"},{"name":"DO","type":"address"},{"name":"DSO","type":"address"},{"name":"DOConnectionInfo","type":"string"},{"name":"DSOConnectionInfo","type":"string"},{"name":"volumeGB","type":"uint256"},{"name":"startDate","type":"uint256"},{"name":"stopDate","type":"uint256"},{"name":"pricePerGB","type":"uint256"},{"name":"weiLeftToWithdraw","type":"uint256"},{"name":"withdrawedAtDate","type":"uint256"},{"name":"weiAllowedToWithdraw_Output","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"storageContractIndex","type":"uint256"},{"name":"storageContractID","type":"uint256"}],"name":"withdrawFromStorageContract","outputs":[{"name":"withdrawedWei","type":"uint256"}],"payable":false,"type":"function"}]

  //DEVELOPMENT: DELETE in production -> default address and provider.
  // let contractAddress = '0xf05eb15f41c48da6ced7c87437ea6ac88e408ca7';
  // let httpProvider = 'http://localhost:8545'; https://mykolafant.by.ether.camp:8555/sandbox/9ac8c7ae73
  // let etherPrice = 49.1607211878;

  // try to retrieve settings from previous sessions
  let _contractAddress = $window.localStorage.contractAddress || null,
      _httpProvider = $window.localStorage.ethereumHttpProvider || null,
      _etherPrice = $window.localStorage.etherPrice || 49.1607211878;
    
  // contractAddress
  appConfig.setContractAddress = (addr) => {
    _contractAddress = addr;

    // let current-info component know about change
    $rootScope.$broadcast('currentInfo:change', {
      'contractAddress': addr
    });

    // put in localStorage
    $window.localStorage.setItem('contractAddress', addr);    
  };
  appConfig.getContractAddress = () => _contractAddress;


  // ethereumHttpProvider
  appConfig.setHttpProvider = (prov) => {
    _httpProvider = prov;

    // let current-info component know about change
    $rootScope.$broadcast('currentInfo:change', {
      'httpProvider': prov
    });
    
    // put in localStorage
    $window.localStorage.setItem('ethereumHttpProvider', prov);    
  };
  appConfig.getHttpProvider = () => _httpProvider;


  // etherPrice
  appConfig.setEtherPrice = (price) => {
    _etherPrice = price;

    // put in localStorage
    $window.localStorage.setItem('etherPrice', price);
  };
  appConfig.getEtherPrice = () => _etherPrice;

}

}());
