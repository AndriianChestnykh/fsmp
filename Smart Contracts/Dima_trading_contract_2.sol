pragma solidity ^0.4.0;

contract TradingContract {
    
    struct SellOrder{
        
        uint id; //Sell Order Id (auto increment)
        
        address	DSO; //Data Storage Owner address of the contract
        
        uint volume; //Volume of disk space, which DSO is ready to sell.
        
        uint pricePerGB; //	Min price in wei DSO ready to get for 1 second (will be 1 day in real case) per 1 GB storage
        
        string IPAndPort;//IP and port of Data Storage Owner
    }

  struct BuyOrder{
      
    uint id; //	Buy Order Id (auto increment)
    
    address DO;	//Data Owner address of the contract
    
    uint volume;	//Volume of disk space, which DO is ready to buy.
    
    uint pricePerGB;	//Max price in wei DO ready to pay for 1 second (will be 1 day in real case) per 1 GB storage
    
    uint weiInitialAmount; // Quantity of wei, that is put into SmartContract at 
                           // the moment of Buy Order creation. 
                           // So it represent real value, that Escrow logic currently manage 
                           // (and real DO intention to pay for future Storage Contract)
  }
  
  struct Contract{
      
    uint contractID; //ContractID (auto increment)
    address DO; //Data owner address of the contract
    address DSO; //Data storage owner address
    string IPAndPort; //IP/port of data storage owner
    uint volume; //Volume of disk space, which can be provided by DSO.
    uint openDate; //Date and time, which, if exists, indicates that the contract has been started
    uint closeDate;	//Date and time, which, if exists, indicates that the contract has been closed
    uint pricePerGB; //Price in wei to pay for 1 second (will be 1 day in real case) per 1 GB storage
    uint weiLeftToWithdraw;	//Quantity of wei, that can we withdrawed by DSO
    uint withdrawedAtDate; //Last date and time when wei was withdrawed by DSO
  }
  
  
  uint sellOrderId; // auto increment unique id
  uint buyOrderId; // auto increment unique id
  uint contractId; // auto increment unique id

  SellOrder[] sellOrderArr; // array of sell orders
  BuyOrder[]  buyOrderArr; // array of buy orders
  Contract[]  contractArr; // array of contracts
  
  
  //############################################################################
  //Functions - payable
  
  
  // ##### Trading
  function createBuyOrder(uint volume, uint pricePerGB) payable{
      
      buyOrderArr.push(BuyOrder(buyOrderId++, msg.sender, volume, pricePerGB, msg.value));
  }
  
  function createSellOrder(uint volume, uint pricePerGB, string IPAndPort) payable{
      
     sellOrderArr.push(SellOrder(sellOrderId++, msg.sender, volume, pricePerGB, IPAndPort)); 
  }
  
  // ### 
  
  //OrderType(string): ""buy"", ""sell"""
  //TODO: probably we should also send contract index as a parameter to reduce iterations????
  function createStorageContract(uint sellBuyOrderID, string orderType) payable returns (uint){
      
      //TODO: not implemented;
      return 0;
  }
  
  //TODO: probably we should also send contract index as a parameter to reduce iterations????
  function refillStorageContract(uint contractId) payable returns (bool){
      //TODO: not implemented;
      return false;
  }
  
  //TODO: probably we should also send contract index as a parameter to reduce iterations????
  function withdrawFromStorageContract(uint contractId) returns(uint){
      
      //TODO: not implemented;
      return 0;
  }
  
  //TODO: probably we should also send contract index as a parameter to reduce iterations????
  function startStorageContract(uint contractId) returns (bool){
      
      //TODO: not implemented;
      return false;
  }
  
  //TODO: probably we should also send contract index as a parameter to reduce iterations????
  function stopStorageContract(uint contractId) returns (bool){
      //TODO: not  implemented;
  }
  
  //
  
  function cancelBuyOrder(uint index) returns(bool){
      
      
      if(buyOrderArr[index].DO == msg.sender){
         
            uint amount = buyOrderArr[index].weiInitialAmount;
        
            if (msg.sender.send(amount)) {
                
                delete buyOrderArr[index];
                return true;
            } else {
                
                return false;
            }
          
      }else{
          throw;
      }
  }
  
  function cancelSellOrder(uint index) returns(bool){
      
      if(sellOrderArr[index].DSO == msg.sender){
          //TODO: Return money;
           //TODO: Return money;
        //   uint amount = sellOrderArr[index].weiInitialAmount;
        
        //     if (msg.sender.send(amount)) {
                
        //         delete buyOrderArr[index];
        //         return true;
        //     } else {
                
        //         return false;
        //     }
          
          delete sellOrderArr[index];
          return true;
      }else{
          throw;
      }
  }
  
  
  
  //Utility functions - constant
  
  //Buy order
  function showBuyOrder(uint index)constant returns(uint id,address DO,uint volume,uint pricePerGB,uint weiInitialAmount){
      return (buyOrderArr[index].id,
              buyOrderArr[index].DO,
              buyOrderArr[index].volume,
              buyOrderArr[index].pricePerGB,
              buyOrderArr[index].weiInitialAmount);
  }
  
  function buyOrderLength() constant returns(uint) {
      return buyOrderArr.length;
  }

  //Sell order    
  function showSellOrder(uint index)constant returns(uint id,address DSO,uint volume,uint pricePerGB,string IPAndPort) {
      return (sellOrderArr[index].id,
              sellOrderArr[index].DSO,
              sellOrderArr[index].volume,
              sellOrderArr[index].pricePerGB,
              sellOrderArr[index].IPAndPort);
  }  
  
  function sellOrderLength() constant returns(uint){
    return sellOrderArr.length;
  }
  
  //contracts
  
  function showContract(uint index)constant returns(uint contractID,address DO,
    address DSO,string IPAndPort,uint volume,uint openDate,uint closeDate,
    uint pricePerGB,uint weiLeftToWithdraw,uint withdrawedAtDate)
    {
      var contr = contractArr[index];
        
      return (contr.contractID,
              contr.DO,
              contr.DSO,
              contr.IPAndPort,
              contr.volume,
              contr.openDate,
              contr.closeDate,
              contr.pricePerGB,
              contr.weiLeftToWithdraw,
              contr.withdrawedAtDate);
  }
  
  function contractsLength() constant returns(uint){
      return contractArr.length;
  }
  
    
}
