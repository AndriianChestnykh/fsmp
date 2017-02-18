(function() {
'use strict';

angular.module('public')
.component('ordersTable', {
    templateUrl: 'app/public/contract-page/orders-table/orders-table.template.html',
    controller: ordersTableController,
    controllerAs: 'ordersTableCtrl',
    bindings: {
      tableData: '<',
      type: '@',
      owner: '@',
      onCancel: '&',
      onCreate: '&'
    }
  });


  function ordersTableController() {
    var ordersTableCtrl = this;

    ordersTableCtrl.cancelOrder = function(type, index, id) {
      ordersTableCtrl.onCancel({
        type: type,
        index: index,
        id: id
      });
    };

    ordersTableCtrl.createStorageContract = function(orderIndex, orderId, type) {
      //FIXME: get REAL ip and port
      let IPAndPort = document.location.host,
          orderType;

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
        IPAndPort: IPAndPort
      });
    }
  }

}());
