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

OrdersTableController.$inject = ['AccountsService', '$uibModal']
function OrdersTableController(AccountsService, $uibModal) {
  let ordersTableCtrl = this;

  ordersTableCtrl.currentAccount = AccountsService.getCurrentAccount();

  ordersTableCtrl.openSyncModal = (deviceId, deviceName) => {
    let modalInstance = $uibModal.open({
      component: 'syncModal',
      resolve: {
        deviceId: () => {
          return deviceId;
        },
        deviceName: () => {
          return deviceName;
        }
      }
    });

    modalInstance.result.then((selectedItem) => {
      console.log('Selected item', selectedItem);
    }, () => {
      console.log('modal-component dismissed');
    });
  };

  ordersTableCtrl.cancelOrder = function(type, index, id) {
    ordersTableCtrl.onCancel({
      type: type,
      index: index,
      id: id
    });
  };

  ordersTableCtrl.createStorageContract = function(orderIndex, orderId, type, connectionInfo) {
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
