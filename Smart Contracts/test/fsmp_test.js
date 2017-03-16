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

//******************************************************************************
// Test buy order
// -- payable
// createBuyOrder(uint volumeGB, uint pricePerGB, string DOConnectionInfo) payable
// -- not payable
// cancelBuyOrder(uint buyOrderIndex, uint buyOrderID)
// -- constant
// getBuyOrder(uint buyOrderIndex)constant returns(uint id, address DO, uint volume, uint pricePerGB, uint weiInitialAmount, string DOConnectionInfo)
// buyOrdersLength() constant returns(uint)
//


csvHeader();

// ################## Trading ###################################################
//
//
// *****************************************************************************
// Buy Order operations to test:
// - createBuyOrder
// - cancelBuyOrder


callAndLog('createBuyOrder', [10, 10, '10.0.12.23'],1);
log("Buy order array length:"+fsmp.buyOrdersLength());
log("Buy order[0]:"+fsmp.getBuyOrder(0));

callAndLog('cancelBuyOrder', [0,1]);


// *****************************************************************************
// Test sell order
// -- payable
// -- not payable
// createSellOrder(uint volumeGB, uint pricePerGB, string DSOConnectionInfo)
// cancelSellOrder(uint sellOrderIndex, uint sellOrderID)
// -- constant
// getSellOrder(uint sellOrderIndex)constant returns(uint id, address DSO, uint volume, uint pricePerGB, string DSOConnectionInfo)
// sellOrdersLength() constant returns(uint)

callAndLog('createSellOrder', [10, 10, '10.0.12.23']);
log("Sell order array lenght:"+fsmp.sellOrdersLength());
log("Sell order[0]:"+fsmp.getSellOrder(0));

callAndLog('cancelSellOrder', [0,1]);


// *****************************************************************************
// Test storage contract
//
// -- payable
// createStorageContract(uint orderIndex, uint orderID, uint orderType, string connectionInfo) payable returns (uint newStorageContractID)
// refillStorageContract(uint storageContractIndex, uint storageContractID) payable
// -- not payable
// withdrawFromStorageContract(uint storageContractIndex, uint storageContractID) returns(uint withdrawedWei)
// startStorageContract(uint storageContractIndex, uint storageContractID)
// stopStorageContract(uint storageContractIndex, uint storageContractID) returns(uint withdrawedWei)
//
// -- constant
// getStorageContract(uint storageContractIndex) constant
// storageContractsLength() constant returns(uint)

call('createBuyOrder', [10, 10, '10.0.12.23'],1);
log("Buy order array length:"+fsmp.buyOrdersLength());
log("Buy order[0]:"+fsmp.getBuyOrder(0));

call('createSellOrder', [10, 10, '10.0.12.23']);
log("Sell order array lenght:"+fsmp.sellOrdersLength());
log("Sell order[0]:"+fsmp.getSellOrder(0));

// Create storage contract
log("createStorageContract type = 1");
callAndLog('createStorageContract',[0,2,1,'10.0.0.2'],2);
log(fsmp.storageContractsLength());
log(fsmp.getStorageContract(0));
callAndLog('startStorageContract', [0,1]);
callAndLog('stopStorageContract', [0,1]);

callAndLog('refillStorageContract',[0,1],1);


log("createStorageContract type = 2");
callAndLog('createStorageContract',[0,2,2,'10.0.0.2'],2);
log(fsmp.storageContractsLength());
log(fsmp.getStorageContract(1));




//################## Shared function ################################################

// weiAllowedToWithdraw(uint storageContractIndex) internal constant returns (uint weiAllowedToWithdraw)
