pragma solidity ^0.4.0;

contract fsmp {
    
  struct SellOrder{
	uint id;          //Sell Order Id (auto increment)
	address	DSO;      //Data Storage Owner address of the contract
	uint volumeGB;    //Volume of disk space, which DSO is ready to sell.
	uint pricePerGB;  //	Min price in wei DSO ready to get for 1 second (will be 1 day in real case) per 1 GB storage
	string DSOConnectionInfo;  //Specific info to connect to DSO securely
  }

  struct BuyOrder{
    uint id; //	Buy Order Id (auto increment)
    address DO;	//Data Owner address of the contract
    uint volumeGB;	//Volume of disk space, which DO is ready to buy.
    uint pricePerGB;	//Max price in wei DO ready to pay for 1 second (will be 1 day in real case) per 1 GB storage
    uint weiInitialAmount; // Quantity of wei, that is put into SmartContract at
                           // the moment of Buy Order creation.
                           // So it represent real value, that Escrow logic currently manage
                           // (and real DO intention to pay for future Storage Contract)
    string DOConnectionInfo; //Specific info to conect to DO securely
  }

  struct StorageContract{
    uint id; //ContractID (auto increment)
    address DO; //Data owner address of the contract
    address DSO; //Data storage owner address
    string DOConnectionInfo; //Specific info to connect to DO securely
    string DSOConnectionInfo; //Specific info to conect to DSO securely
    uint volumeGB; //Volume of disk space, which can be provided by DSO.
    uint startDate; //Date and time, which, if exists, indicates that the contract has been started
    uint stopDate;	//Date and time, which, if exists, indicates that the contract has been stopped
    uint pricePerGB; //Price in wei to pay for 1 second (will be 1 day in real case) per 1 GB storage
    uint weiLeftToWithdraw;	//Quantity of wei, that can we withdrawed by DSO
    uint withdrawedAtDate; //Last date and time when wei was withdrawed by DSO
  }


  uint sellOrderId; // auto increment unique id
  uint buyOrderId; // auto increment unique id
  uint storageContractId; // auto increment unique id

  SellOrder[] sellOrderArr; // array of sell orders
  BuyOrder[]  buyOrderArr; // array of buy orders
  StorageContract[]  storageContractArr; // array of contracts


  //################## Shared function ################################################

  function deleteBuyOrderFromArray (uint buyOrderIndex) internal {
    //if index not last element in the array
    if(buyOrderIndex != buyOrderArr.length-1){
        buyOrderArr[buyOrderIndex] = buyOrderArr[buyOrderArr.length-1];
    }
    buyOrderArr.length--;
  }

  function deleteSellOrderFromArray (uint sellOrderIndex) internal {
    //if index not last element in the array
    if(sellOrderIndex != sellOrderArr.length-1){
        sellOrderArr[sellOrderIndex] = sellOrderArr[sellOrderArr.length-1];
    }
    sellOrderArr.length--;
  }

  function deleteStorageContractFromArray (uint storageContractIndex) internal {
    //if index not last element in the array
    if(storageContractIndex != storageContractArr.length-1){
        storageContractArr[storageContractIndex] = storageContractArr[storageContractArr.length-1];
    }
    storageContractArr.length--;
  }

  function weiAllowedToWithdraw(uint storageContractIndex) internal constant returns (uint weiAllowedToWithdraw) {
      var c = storageContractArr[storageContractIndex];
      if (c.startDate == 0) return 0;
      uint calcToDate = now;
      if (c.stopDate != 0) calcToDate = c.stopDate;

      weiAllowedToWithdraw = (calcToDate - c.withdrawedAtDate) * c.pricePerGB * c.volumeGB;
      if (weiAllowedToWithdraw >= c.weiLeftToWithdraw) weiAllowedToWithdraw = c.weiLeftToWithdraw;

      return weiAllowedToWithdraw;
  }

  // ################## Trading ###################################################
  // Buy Order

  function createBuyOrder(uint volumeGB, uint pricePerGB, string DOConnectionInfo) payable {
      buyOrderArr.push(BuyOrder(++buyOrderId, msg.sender, volumeGB, pricePerGB, msg.value, DOConnectionInfo));
  }

  function cancelBuyOrder(uint buyOrderIndex, uint buyOrderID){
      //check if user can cancel an order
      if(buyOrderArr[buyOrderIndex].DO == msg.sender && buyOrderArr[buyOrderIndex].id == buyOrderID){
            uint amount = buyOrderArr[buyOrderIndex].weiInitialAmount;

            deleteBuyOrderFromArray(buyOrderIndex);

            if (!msg.sender.send(amount)) throw;
      }else{
          throw;
      }
  }

  function getBuyOrder(uint buyOrderIndex)constant returns(uint id, address DO, uint volume, uint pricePerGB, uint weiInitialAmount, string DOConnectionInfo){
      return (buyOrderArr[buyOrderIndex].id,
              buyOrderArr[buyOrderIndex].DO,
              buyOrderArr[buyOrderIndex].volumeGB,
              buyOrderArr[buyOrderIndex].pricePerGB,
              buyOrderArr[buyOrderIndex].weiInitialAmount,
              buyOrderArr[buyOrderIndex].DOConnectionInfo);
  }

  function buyOrdersLength() constant returns(uint) {
      return buyOrderArr.length;
  }

  // Sell Order

  function createSellOrder(uint volumeGB, uint pricePerGB, string DSOConnectionInfo) {
     sellOrderArr.push(SellOrder(++sellOrderId, msg.sender, volumeGB, pricePerGB, DSOConnectionInfo));
  }

    function getSellOrder(uint sellOrderIndex)constant returns(uint id, address DSO, uint volume, uint pricePerGB, string DSOConnectionInfo) {
      return (sellOrderArr[sellOrderIndex].id,
              sellOrderArr[sellOrderIndex].DSO,
              sellOrderArr[sellOrderIndex].volumeGB,
              sellOrderArr[sellOrderIndex].pricePerGB,
              sellOrderArr[sellOrderIndex].DSOConnectionInfo);
  }

  function sellOrdersLength() constant returns(uint){
    return sellOrderArr.length;
  }

  function cancelSellOrder(uint sellOrderIndex, uint sellOrderID){
      //check if user can cancel an order
      if(sellOrderArr[sellOrderIndex].DSO == msg.sender && sellOrderArr[sellOrderIndex].id == sellOrderID){
            deleteSellOrderFromArray(sellOrderIndex);
          return;
      }else{
          throw;
      }
  }

  // ################## Escrow ###################################################
  // Storage Contract

    function createStorageContract(uint orderIndex, uint orderID, uint orderType, string connectionInfo) payable returns (uint newStorageContractID){

      //DSO calls the contract, orderType = "buy"
      if (orderType == 1) {

        //check if Buy Order id is equal to expected to avoid working with wrong or deleted Buy Order
        if (buyOrderArr[orderIndex].id != orderID) throw;

        storageContractArr.push(StorageContract(
            ++storageContractId,                //ContractID - auto increment
            buyOrderArr[orderIndex].DO,         //DO - from the BuyOrder data
            msg.sender,                         //DSO - from msg.sender (the function caller address)
            buyOrderArr[orderIndex].DOConnectionInfo, //DOConnectionInfo
            connectionInfo,                     //DSOConnectionInfo
            buyOrderArr[orderIndex].volumeGB,   //VolumeGB - from the BuyOrder data
            0,                                  //StartDate - empty
            0,                                  //StopDate - empty
            buyOrderArr[orderIndex].pricePerGB, //PricePerGB - from the BuyOrder data
            buyOrderArr[orderIndex].weiInitialAmount,   //WeiLeftToWithdraw - from the BuyOrder data
            0                                   //WeiWithdrawedAtDate - empty
            ));

        deleteBuyOrderFromArray(orderIndex);
        return storageContractId;

      //DO call the contract, orderType = "sell"
      } else if (orderType == 2){

        //check if Sell Order Id is equal to expected to avoid working with wrong or deleted Sell Order
        if (sellOrderArr[orderIndex].id != orderID) {
            throw;
        }

        storageContractArr.push(StorageContract(
            ++storageContractId,                    //ContractID - auto increment
            msg.sender,                             //DO - from msg.sender (the function caller address)
            sellOrderArr[orderIndex].DSO,           //DSO - from the SellOrder data
            connectionInfo,                        //DOConnectionInfo
            sellOrderArr[orderIndex].DSOConnectionInfo, //DSOConnectionInfo
            sellOrderArr[orderIndex].volumeGB,    //VolumeGB - from the SellOrder data
            0,                                      //StartDate - empty
            0,                                      //StopDate - empty
            sellOrderArr[orderIndex].pricePerGB,   //PricePerGB - from the SellOrder data
            msg.value,                              //WeiLeftToWithdraw - from msg.value (weis sent with the call)
            0                                       //WeiWithdrawedAtDate - empty
            ));

        deleteSellOrderFromArray(orderIndex);
        return storageContractId;
      }
      throw;
  }

  function refillStorageContract(uint storageContractIndex, uint storageContractID) payable {
      var c = storageContractArr[storageContractIndex];
      if (msg.sender != c.DO) throw;
      if (c.id != storageContractID) throw;
      if (c.stopDate != 0) throw;

      c.weiLeftToWithdraw += msg.value;
  }

  function withdrawFromStorageContract(uint storageContractIndex, uint storageContractID) returns(uint withdrawedWei) {
    var c = storageContractArr[storageContractIndex];
    if (msg.sender != c.DSO && msg.sender != c.DO) throw;
    if (c.id != storageContractID) throw;
    if (c.startDate == 0) throw;

    withdrawedWei = weiAllowedToWithdraw(storageContractIndex);

    if (msg.sender == c.DSO && withdrawedWei != 0) {
        // if the storage contract is active then withdraw by DSO has sence
        c.weiLeftToWithdraw -= withdrawedWei;
        c.withdrawedAtDate = now;
        if(!msg.sender.send(withdrawedWei)) throw;
        // if DO stopped contract before then weiAllowedToWithdraw can be not zero and withdraw is OK
        // if DSO stopped contract before then weiAllowedToWithdraw should be zero and withdraw will not occur
        if(c.stopDate != 0){
            deleteStorageContractFromArray(storageContractIndex);
        }
        return withdrawedWei;
    }

    if (msg.sender == c.DO && c.stopDate != 0){
        // if DO stopped contract before then weiAllowedToWithdraw can be not zero,
        //which means that DO is trying take the money more that one time
        // if DSO stopped contract before then weiAllowedToWithdraw should be zero
        if (withdrawedWei != 0) throw;
        withdrawedWei = c.weiLeftToWithdraw;
        c.weiLeftToWithdraw -= withdrawedWei;
        if(!msg.sender.send(withdrawedWei)) throw;
        deleteStorageContractFromArray(storageContractIndex);
        return withdrawedWei;
    }

    throw;
  }

  function startStorageContract(uint storageContractIndex, uint storageContractID) {
      var c = storageContractArr[storageContractIndex];
      if (msg.sender != c.DO) throw;
      if (c.id != storageContractID) throw;
      storageContractArr[storageContractIndex].startDate = now;
      storageContractArr[storageContractIndex].withdrawedAtDate = now;
  }

  function stopStorageContract(uint storageContractIndex, uint storageContractID) returns(uint withdrawedWei) {
    var c = storageContractArr[storageContractIndex];
    if (c.id != storageContractID) throw;
    if (c.stopDate != 0) throw;       //protect from reentrance attack
    if (msg.sender != c.DO && msg.sender != c.DSO) throw;

    c.stopDate = now;
    withdrawedWei = weiAllowedToWithdraw(storageContractIndex);

    if (msg.sender == c.DO){
        withdrawedWei = c.weiLeftToWithdraw - withdrawedWei;
    }

    if (msg.sender == c.DSO){
        c.withdrawedAtDate = now;
    }

    c.weiLeftToWithdraw -= withdrawedWei;
    if (!msg.sender.send(withdrawedWei)) throw;

    if (c.weiLeftToWithdraw == 0) {
        deleteStorageContractFromArray(storageContractIndex);
    }
  }

  function getStorageContract(uint storageContractIndex) constant returns(
        uint id,
        address DO,
        address DSO,
        string DOConnectionInfo,
        string DSOConnectionInfo,
        uint volumeGB,
        uint startDate,
        uint stopDate,
        uint pricePerGB,
        uint weiLeftToWithdraw,
        uint withdrawedAtDate,
        uint weiAllowedToWithdraw_Output
    ) {

      var contr = storageContractArr[storageContractIndex];
      var watw = weiAllowedToWithdraw(storageContractIndex);

      return (contr.id,
              contr.DO,
              contr.DSO,
              contr.DOConnectionInfo,
              contr.DSOConnectionInfo,
              contr.volumeGB,
              contr.startDate,
              contr.stopDate,
              contr.pricePerGB,
              contr.weiLeftToWithdraw,
              contr.withdrawedAtDate,
              watw
              );
  }
  
  function storageContractsLength() constant returns(uint){
      return storageContractArr.length;
  }
}