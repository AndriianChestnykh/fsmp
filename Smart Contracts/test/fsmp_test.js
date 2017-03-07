//
// FSMP contract testing
//
//

//Preload configuration and util functions from common.js
loadScript("common.js");

nodeInfo();

primary = initAccounts();

fsmp = deploySmartContract();


//------------------------------------------------------------------------------
//
//Contract testing
//


//Buy order
call('createBuyOrder', [10, 10, '10.0.12.23'],1);
log(fsmp.buyOrdersLength());
log(fsmp.getBuyOrder(0));


call('cancelBuyOrder',[0,1]);
log(fsmp.buyOrdersLength());



call('createSellOrder', [10, 10, '10.0.12.23']);
log(fsmp.sellOrdersLength());
log(fsmp.getSellOrder(0));

call('cancelSellOrder', [0,1]);

call('createSellOrder', [10, 10, '10.0.12.23']);
sellOrder = fsmp.getSellOrder(0);

call('createBuyOrder', [10, 10, '10.0.12.23'],1);
buyOrder = fsmp.getBuyOrder(0);

//call('createStorageContract', [0, buyOrder[0],1 '10.0.12.23'],1);
log(fsmp.storageContractsLength());
