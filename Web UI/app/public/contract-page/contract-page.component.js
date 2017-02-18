//FIXME: you can create order like this -> contract.createBuyOrder //(20, 20); If eth.defaultAccount is set
//FIXME: you can create order like this -> .sendTransaction(from : "******", ...); If you put an account address in "from". No PASSWORD
angular.module('public')
.component('contractPage', {
  templateUrl: 'app/public/contract-page/contract-page.template.html',
  controller: ['appConfig', 'Web3Service',
    function ContractPageController(appConfig, Web3Service) {

      var ctrl = this,
          web3, defaultAccount, contract;

      ctrl.$onInit = onInit;//get coinbase, contract etc.

      ctrl.allBuyOrders = []; //all buy orders in the chain
      ctrl.myBuyOrders = []; //my bo

      ctrl.allSellOrders = []; //all sell orders in the chain
      ctrl.mySellOrders = [];

      ctrl.allStorageContracts = [];
      ctrl.myStorageContracts = [];

      ctrl.unlockAccount = unlockAccount;//?????????
      ctrl.createBuyOrder = createBuyOrder;
      ctrl.createSellOrder = createSellOrder;
      ctrl.createStorageContract = createStorageContract;
      ctrl.getAllBuyOrders = getAllBuyOrders;
      ctrl.getAllSellOrders = getAllSellOrders;
      ctrl.getAllStorageContracts = getAllStorageContracts;
      ctrl.cancelOrder = cancelOrder;
      ctrl.manageStorageContract = manageStorageContract;

      function unlockAccount(pwd) {
          web3.personal.unlockAccount(defaultAccount, pwd, 10000);
      }

      function createBuyOrder(cbo) {
          var transactionId = contract //do we need transactionId?
              .createBuyOrder //(20, 20);
              .sendTransaction(
                  cbo.volumeGB,
                  cbo.pricePerGB,
                  {from: defaultAccount,
                    value: cbo.weiInitialAmount,
                    gas: 1000000}
              );
          getAllBuyOrders();
      }

      // FIXME: createBuyOrder && createSellOrder need a higher-order function
      function createSellOrder(cso) {
        var transactionId = contract
            .createSellOrder
            .sendTransaction(
              cso.volumeGB,
              cso.pricePerGB,
              cso.IPAndPort,
              {from: defaultAccount,
                value: 0,
                gas: 1000000}
            );
          getAllSellOrders();
      }

      function createStorageContract(orderIndex, orderId, orderType, IPAndPort) {
        console.log('Contract...');
        let transactionID = contract
          .createStorageContract
          .sendTransaction(
            orderIndex,
            orderId,
            orderType,
            IPAndPort,
            { from: defaultAccount,
              value: 0,
              gas: 1000000}
          );
          console.log('Contract created...');
          getAllStorageContracts();
      }

      function getBuyOrder(index) {
        var gboArr = contract.getBuyOrder(index);
        return {
          id: +gboArr[0],
          DO: gboArr[1],
          volumeGB: parseFloat(gboArr[2]),
          pricePerGB: parseFloat(gboArr[3]),
          weiInitialAmount: parseFloat(gboArr[4]),
          index: index
        };
      }

      function getSellOrder(index) {
        var soArr = contract.getSellOrder(index);
        return {
          id: +soArr[0],
          DO: soArr[1],
          volumeGB: parseFloat(soArr[2]),
          pricePerGB: parseFloat(soArr[3]),
          IPAndPort: soArr[4],
          index: index
        };
      }

      function getStorageContract(index) {
        var scArr = contract.getStorageContract(index);
        return {
          id: +scArr[0],
          DOAddress: scArr[1],
          DSOAddress: scArr[2],
          IPAndPort: scArr[3],
          volumeGB: parseFloat(scArr[4]),
          startDate: parseDate(scArr[5]),
          //TODO: do something with date :)
          stopDate: parseDate(scArr[6]),
          pricePerGB: parseFloat(scArr[7]),
          weiLeftToWithdraw: parseFloat(scArr[8]),
          withdrawedAtDate: parseFloat(scArr[9]),
          weiAllowedToWithdraw: parseFloat(scArr[10]),
          index: index
        };
      }

      function parseDate(timestamp) {
        return (!+timestamp) ? '-' : new Date(+timestamp)
      }

      function getAllBuyOrders() {
        ctrl.allBuyOrders = [];
        var boLength = contract.buyOrdersLength();

        for (var i = 0, n = boLength; i < n; i++) {
          ctrl.allBuyOrders.push(getBuyOrder(i));
        }

        getMyBuyOrders();
      }

      function getAllSellOrders() {
        ctrl.allSellOrders = [];
        var soLength = contract.sellOrdersLength();

        for (var i = 0, n = soLength; i < n; i++) {
          ctrl.allSellOrders.push(getSellOrder(i));
        }

        getMySellOrders();
      }

      function getAllStorageContracts() {
        ctrl.allStorageContracts = [];
        var scLength = contract.storageContractsLength();

        for (var i = 0, n = scLength; i < n; i++) {
          ctrl.allStorageContracts.push(getStorageContract(i));
        }

        getMyStorageContracts();
      }

      function getMyBuyOrders() {
        ctrl.myBuyOrders = [];
        ctrl.allBuyOrders.forEach(function(bo) {
          if (bo.DO === defaultAccount) ctrl.myBuyOrders.push(bo);
        });
      }

      function getMySellOrders() {
        ctrl.mySellOrders = [];
        ctrl.allSellOrders.forEach(function(so) {
          if (so.DO === defaultAccount) ctrl.mySellOrders.push(so);
        });
      }

      function getMyStorageContracts() {
        ctrl.myStorageContracts = [];
        ctrl.allStorageContracts.forEach(function(sc) {
          if (sc.DOAddress === defaultAccount || sc.DSOAddress === defaultAccount) {
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
        if (type == 'buy') getAllBuyOrders();
        else getAllSellOrders();
      }

      //invokes 'startStorageContract', 'stopStorageContract',
      //'withdrawFromStorageContract', 'refillStorageContract'
      function manageStorageContract(storageContractIndex, storageContractID, method) {
        let methods = [
          'startStorageContract',
          'stopStorageContract',
          'withdrawFromStorageContract',
          'refillStorageContract'
        ];

        if (methods.indexOf(method) < 0) {
          throw new Error('Contract has no method -> ' + method);
        }

        contract[method](storageContractIndex, storageContractID);
      }

      function onInit() {
        web3 = Web3Service.getWeb3();

        defaultAccount = web3.eth.defaultAccount = '0xdedb49385ad5b94a16f236a6890cf9e0b1e30392';//??????????

        contract = web3.eth.contract(appConfig.abi).at(appConfig.contractAddress);
        getAllBuyOrders();
        getAllSellOrders();
        getAllStorageContracts();
      };

    }//end controller function
  ]
});
