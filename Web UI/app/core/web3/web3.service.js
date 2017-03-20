(function() {
'use strict';

angular.module('core')
.service('Web3Service', Web3Service);

Web3Service.$inject = ['appConfig', '$rootScope'];
function Web3Service(appConfig, $rootScope) {
  let Web3Service = this;

  let web3 = new Web3();
  let httpProvider = appConfig.getHttpProvider();
  let contractAddress = appConfig.getContractAddress();
  let contract;

  Web3Service.getWeb3 = () => {
    httpProvider = appConfig.getHttpProvider();
    contractAddress = appConfig.getContractAddress();

    web3.setProvider(new web3.providers.HttpProvider(httpProvider));
    contract = web3.eth.contract(appConfig.abi).at(contractAddress);

    if (!web3.isConnected()) {
        alert('Node not found. Provide correct RPC server.')
    }

    return web3;
  };

  Web3Service.getContract = () => contract;

}

}());
