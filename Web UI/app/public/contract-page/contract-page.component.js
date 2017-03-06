(function() {
'use strict';

angular.module('public')
.component('contractPage', {
  templateUrl: 'app/public/contract-page/contract-page.template.html',
  controller: ContractPageController
});

ContractPageController.$inject = ['appConfig', 'Web3Service', 'AccountsService', '$scope'];
function ContractPageController(appConfig, Web3Service, AccountsService, $scope) {

    var ctrl = this,
        web3, currentAccount, contractAddress, contract;

    ctrl.$onInit = onInit;//get coinbase, contract etc.

    ctrl.buyOrders = []; //all buy orders in the chain

    ctrl.sellOrders = []; //all sell orders in the chain

    ctrl.allStorageContracts = [];
    ctrl.myStorageContracts = [];

    ctrl.createBuyOrderDisabled = false;

    ctrl.unlockAccount = unlockAccount;//?????????
    ctrl.getCurrentAccount = getCurrentAccount;
    ctrl.createBuyOrder = createBuyOrder;
    ctrl.createSellOrder = createSellOrder;
    ctrl.createStorageContract = createStorageContract;
    ctrl.getBuyOrders = getBuyOrders;
    ctrl.getSellOrders = getSellOrders;
    ctrl.getAllStorageContracts = getAllStorageContracts;
    ctrl.cancelOrder = cancelOrder;
    ctrl.manageStorageContract = manageStorageContract;

    function unlockAccount(pwd) {
      web3.personal.unlockAccount(currentAccount, pwd, 10000);
    }

    function getCurrentAccount() {
      return currentAccount;
    }

    function createBuyOrder(cbo) {
      //prevent multiple requests
      ctrl.createBuyOrderDisabled = true;

      var transactionId = contract //do we need transactionId?
        .createBuyOrder
        .sendTransaction(
          cbo.volumeGB,
          cbo.pricePerGB,
          cbo.connectionInfo,
          {from: currentAccount,
            value: cbo.weiInitialAmount,
            gas: 1000000},
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              getBuyOrders();
            }
          }
        );

    }

    // FIXME: createBuyOrder && createSellOrder need a higher-order function
    function createSellOrder(cso) {
      var transactionId = contract
          .createSellOrder
          .sendTransaction(
            cso.volumeGB,
            cso.pricePerGB,
            cso.connectionInfo,
            {from: currentAccount,
              value: 0,
              gas: 1000000}
          );
        getSellOrders();
    }

    function createStorageContract(orderIndex, orderId, orderType, connectionInfo) {
      let transactionID = contract
        .createStorageContract
        .sendTransaction(
          orderIndex,
          orderId,
          orderType,
          connectionInfo,
          { from: currentAccount,
            value: 0,
            gas: 1000000}
        );
        getBuyOrders();
        getSellOrders();
        getAllStorageContracts();
    }

    function getBuyOrder(index, boLength) {
      contract.getBuyOrder(index, (error, result) => {

        if (error) {
          console.log('Error occured on getting buy orders:', error);
        } else {

          let gboArr = result;
          let gbo = {
            id: +gboArr[0],
            DO: gboArr[1],
            volumeGB: parseFloat(gboArr[2]),
            pricePerGB: parseFloat(gboArr[3]),
            weiInitialAmount: parseFloat(gboArr[4]),
            connectionInfo: gboArr[5],
            index: index
          };

          // $scope.$apply is needed so the tables refresh
          $scope.$apply(() => {
            ctrl.buyOrders.push(gbo);

            if (index === boLength - 1) ctrl.createBuyOrderDisabled = false;
          });

        }
      });

    }

    function getSellOrder(index) {
      var soArr = contract.getSellOrder(index);
      return {
        id: +soArr[0],
        DO: soArr[1],
        volumeGB: parseFloat(soArr[2]),
        pricePerGB: parseFloat(soArr[3]),
        connectionInfo: soArr[4],
        index: index
      };
    }

    function getStorageContract(index) {
      var scArr = contract.getStorageContract(index);
      return {
        id: +scArr[0],
        DOAddress: scArr[1],
        DSOAddress: scArr[2],
        DOConnectionInfo: scArr[3],
        DSOConnectionInfo: scArr[4],
        volumeGB: parseFloat(scArr[5]),
        startDate: parseDate(scArr[6]),
        stopDate: parseDate(scArr[7]),
        pricePerGB: parseFloat(scArr[8]),
        weiLeftToWithdraw: parseFloat(scArr[9]),
        withdrawedAtDate: parseFloat(scArr[10]),
        index: index
      };
    }

    function parseDate(timestamp) {
      return (!+timestamp) ? '-' : new Date(+timestamp)
    }

    function getBuyOrders() {
      ctrl.buyOrders = [];

      var boLength = parseFloat(contract.buyOrdersLength());

      for (var i = 0, n = boLength; i < n; i++) {
        getBuyOrder(i, boLength);
      }
    }

    function getSellOrders() {
      ctrl.sellOrders = [];
      var soLength = contract.sellOrdersLength();

      for (var i = 0, n = soLength; i < n; i++) {
        ctrl.sellOrders.push(getSellOrder(i));
      }
    }

    function getAllStorageContracts() {
      ctrl.allStorageContracts = [];
      var scLength = contract.storageContractsLength();

      for (var i = 0, n = scLength; i < n; i++) {
        ctrl.allStorageContracts.push(getStorageContract(i));
      }

      getMyStorageContracts();
    }

    function getMyStorageContracts() {
      ctrl.myStorageContracts = [];
      ctrl.allStorageContracts.forEach(function(sc) {
        if (sc.DOAddress === currentAccount || sc.DSOAddress === currentAccount) {
          ctrl.myStorageContracts.push(sc);
        }
      })
    }

    function cancelOrder(type, index, id) {
      //check owner?????????????????????????
      if (type == 'buy') {
        contract.cancelBuyOrder(index, id);
      } else if (type == 'sell') {
        contract.cancelSellOrder(index, id);
      } else {
        throw new Error('Can\'t cancel order of type-> ' + type);
      }

      //refresh tables
      if (type == 'buy') getBuyOrders();
      else getSellOrders();
    }

    //invokes 'startStorageContract', 'stopStorageContract',
    //'withdrawFromStorageContract', 'refillStorageContract'
    function manageStorageContract(storageContractIndex, storageContractID, method, wei) {
      let methods = [
        'startStorageContract',
        'stopStorageContract',
        'withdrawFromStorageContract',
        'refillStorageContract'
      ];

      if (methods.indexOf(method) < 0) {
        throw new Error('Contract has no method -> ' + method);
      }

      contract[method].sendTransaction(
        storageContractIndex,
        storageContractID,
        {from: currentAccount,
         value: wei || 0,
         gas: 1000000}
      );

      getAllStorageContracts();
    }

    function onInit() {
      web3 = Web3Service.getWeb3();

      currentAccount = AccountsService.getCurrentAccount();

      contractAddress = appConfig.getContractAddress();

      if (!contractAddress) {
        alert('You didn\'t provide contract address. Provide correct contract address!');
        //redirect to main
        return;
      }

      contract = web3.eth.contract(appConfig.abi).at(contractAddress);

      getBuyOrders();
      getSellOrders();
      getAllStorageContracts();
    };

  }//end controller function

}());
