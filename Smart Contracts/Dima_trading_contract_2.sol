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
  
  
  uint sellOrderId; // auto increment unique id
  uint buyOrderId; // auto increment unique id

  SellOrder[] sellOrderArr; // array of sell orders
  BuyOrder[]  buyOrderArr; // array of buy orders
  
  
  
  //Functions - payable
  
  function createBuyOrder(uint volume, uint pricePerGB) payable{
      
      buyOrderArr.push(BuyOrder(buyOrderId++, msg.sender, volume, pricePerGB, msg.value));
  }
  
  function createSellOrder(uint volume, uint pricePerGB, string IPAndPort) payable{
      
     sellOrderArr.push(SellOrder(sellOrderId++, msg.sender, volume, pricePerGB, IPAndPort)); 
  }
  
  //
  
  function cancelBuyOrder(uint index){
      
      
      if(buyOrderArr[index].DO == msg.sender){
          
         delete buyOrderArr[index];
          
      }else{
          throw;
      }
  }
  
  function cancelSellOrder(uint index){
      
      if(sellOrderArr[index].DSO == msg.sender){
          delete sellOrderArr[index];
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
    
}
