(function() {
'use strict';

angular.module('core')
.service('Web3Service', Web3Service);

Web3Service.$inject = ['appConfig'];
function Web3Service(appConfig) {
  var Web3Service = this;
  Web3Service.getWeb3 = getWeb3;


  function getWeb3() {
    var web3 = new Web3();

    web3.setProvider(new web3.providers.HttpProvider(appConfig.httpProvider));

    if (!web3.isConnected()) {
        alert('Node not found. Provide correct RPC server.')
    }

    return web3;
  }

}

}());
