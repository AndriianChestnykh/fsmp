(function() {
'use strict';

angular.module('public')
.component('ordersTable', {
    templateUrl: 'app/public/contract-page/orders-table/orders-table.template.html',
    controller: OrdersTableController,
    controllerAs: 'ordersTableCtrl',
    bindings: {
      tableData: '=',
      type: '@',
      owner: '@',
      onCancel: '&',
      onCreate: '&'
    }
  });

OrdersTableController.$inject = [
    'AccountsService', 
    '$uibModal', 
    '$scope',
    'appConfig'
  ];
function OrdersTableController(
    AccountsService, $uibModal, $scope, appConfig
) {
  let ordersTableCtrl = this;

  // get currentAccount for sorting out my orders from all orders
  ordersTableCtrl.currentAccount = AccountsService.getCurrentAccount();

  // in which currency show properties
  ordersTableCtrl.inEther = {
    pricePerGB: false,
    weiInitialAmount: false
  };

  ordersTableCtrl.etherPrice = appConfig.getEtherPrice();

  $scope.$on('currency:change', (event, data) => {
    let prop = data.cathegory;
    ordersTableCtrl.inEther[prop] = data.ether;    
  });

  ordersTableCtrl.openSyncModal = openSyncModal;
  ordersTableCtrl.cancelOrder = cancelOrder;
  ordersTableCtrl.createStorageContract = createStorageContract;

  function openSyncModal (deviceId, deviceName, index, id, type) {
    let modalInstance = $uibModal.open({
      component: 'syncModal',
      resolve: {
        deviceId: () => deviceId,
        deviceName: () => deviceName,
        index: () => index,
        id: () => id,
        type: () => type
      }
    });

    // if user presses 'ok' on modal -> create storage contract
    modalInstance.result.then((args) => {
      let orderType;

      if (args.type == 'buy') {
        orderType = 1;
      } else if (args.type == 'sell') {
        orderType = 2;
      } else {
        throw new Error('Can\'t create contract from order of type -> ' + args.type);
      }

      ordersTableCtrl.onCreate({
        orderIndex: args.index,
        orderId: args.id,
        orderType: orderType,
        connectionInfo: args.myDeviceId,
        weiInitialAmount: args.weiInitialAmount
      });
    }, () => {
      // console.log('Sync-modal dismissed');
    });
  }


  function cancelOrder (type, index, id) {
    ordersTableCtrl.onCancel({
      type: type,
      index: index,
      id: id
    });
  }

  function createStorageContract (orderIndex, orderId, type, connectionInfo) {
    let orderType;

    if (type == 'buy') {
      orderType = 1;
    } else if (type == 'sell') {
      orderType = 2;
    } else {
      throw new Error('Can\'t create contract from order of type -> ' + type);
    }

    ordersTableCtrl.onCreate({
      orderIndex: orderIndex,
      orderId: orderId,
      orderType: orderType,
      connectionInfo: connectionInfo
    });
  }

}

}());
