pragma solidity ^0.4.0;

contract TradingContract {

    struct TContract{

        uint contractId; // Try to store time (now + DO + DO hased to sha3)
        address DO;
        address DSO;
        string ipAndPort;
        uint volume;
        uint openDate;
        uint closeDate;
        uint pricePerGB;
        uint weiLeftToWithdraw;
        uint withdrawAtDate;

        
        string ipAndPortDO;
    }

  struct DataStorage{
    address ownerAddress;  // Owner Ethereum address;

    uint volume;

    uint pricePerGB;

    string ipAndPort;
  }

  struct DataOwner{
    address ownerAddress;  // Owner Ethereum address;

    uint volume;

    uint pricePerGB;

    string ipAndPort;
  }

  DataStorage[] dataStorageList;
  DataOwner[] dataOwnerList;

  TContract[] tradingList;

//Can be executed by DSO only ??? how to organasi this??
//function createStorageContractDSO(address DSO, string ipAndPort, uint volume,uint pricePerGB) returns(bool){
  function createStorageContractDSO(string ipAndPort, uint volume,uint pricePerGB) returns(bool){

        address DSO = msg.sender;
        uint index;
        bool error;
        (index,error) = findData(volume, pricePerGB);

        if(error){
            dataStorageList.push(DataStorage(DSO, volume, pricePerGB, ipAndPort));
        }else{
            tradingList.push(TContract(
                                now,
                                dataOwnerList[index].ownerAddress,
                                DSO,
                                ipAndPort,
                                volume,
                                0,
                                0,
                                pricePerGB,
                                0,
                                0,
                                dataOwnerList[index].ipAndPort));

        }



        return true;
  }

    //Can be executed by DO only ???
    //function createStorageContractDO(address DO, string ipAndPort, uint volume,uint pricePerGB) returns(bool){
  function createStorageContractDO( string ipAndPort, uint volume,uint pricePerGB) returns(bool){

        address DO = msg.sender;

        uint index;
        bool error;
        (index,error) = findStorage(volume, pricePerGB);

        if(error){
            dataOwnerList.push(DataOwner(DO, volume, pricePerGB, ipAndPort));
        }else{
            tradingList.push(TContract(
                                now,
                                DO,
                                dataStorageList[index].ownerAddress,
                                dataStorageList[index].ipAndPort,
                                volume,
                                0,
                                0,
                                pricePerGB,
                                0,
                                0,
                                ipAndPort));

        }

        return true;
  }

//Can be executed only by DO
  function startStorageContract(uint contractId){

  }

//Can be executed by DO and DSO of coresponding contract
  function stopStorageContract(uint contractId){

  }

//can be executed by DO
  function refillStorageContract() payable{

  }

//can be called by DSO only
  function withdrawFromStorageContract(){

  }

//can be called by DO or DSO
  function showMyStorageContracts() constant{
        //Probably show contracts by comma???
  }

//this function is impossible
//   function showAllStorageContracts(){

//   }


//// UTILITY FUNCTIONS all should be constant

//Return index in dataStorageList
function findStorage(uint volume,uint pricePerGB) private constant returns(uint index, bool error) {
    for(uint i=0; i < dataStorageList.length ;i++){

        if(dataStorageList[i].volume == volume && dataStorageList[i].pricePerGB == pricePerGB){
            return (i, false);
        }

    }

    return (0, true);
}

//Return index in dataOwnerList
function findData(uint volume,uint pricePerGB)private constant returns(uint index, bool error) {

    for(uint i=0; i < dataOwnerList.length;i++){

        if(dataOwnerList[i].volume == volume && dataOwnerList[i].pricePerGB == pricePerGB){
            return (i, false);
        }

    }

    return (0, true);
}



//// FUNCTION FOR THE WEB-Client

function getDataStorageListSize() constant returns(uint){
    return dataStorageList.length;
}

function getDataOwnerListSize() constant returns(uint){
  return dataOwnerList.length;
}

function getTradingListSize() constant returns(uint){
  return tradingList.length;
}

function getStorageById(uint index) constant returns( address ownerAddress,uint volume, uint pricePerGB,string ipAndPort){
    return (dataStorageList[index].ownerAddress,
            dataStorageList[index].volume,
            dataStorageList[index].pricePerGB,
            dataStorageList[index].ipAndPort);
}



function getDataByID(uint index) constant returns( address ownerAddress,uint volume, uint pricePerGB,string ipAndPort){
     return (dataOwnerList[index].ownerAddress,
             dataOwnerList[index].volume,
             dataOwnerList[index].pricePerGB,
             dataOwnerList[index].ipAndPort);
}

function getContractById(uint index)constant returns(uint contractId,address DO,address DSO,string ipAndPort,
                                                     uint volume,uint openDate,uint closeDate,uint pricePerGB,
                                                     uint weiLeftToWithdraw,uint withdrawAtDate,string ipAndPortDO){

    TContract trade = tradingList[index];

    return (trade.contractId,
            trade.DO,
            trade.DSO,
            trade.ipAndPort,
            trade.volume,
            trade.openDate,
            trade.closeDate,
            trade.pricePerGB,
            trade.weiLeftToWithdraw,
            trade.withdrawAtDate,
            trade.ipAndPortDO);
}


}
