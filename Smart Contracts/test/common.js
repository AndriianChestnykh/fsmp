
//******************************************************************************
//
// FSMP contract.
//
// This file contain utility functions and initial configuration for testing
// FSMP smart contract

//Log
function log(text){
    console.log(text);
}

//Mine function mine one block
function mine(){
  log("Start mining");
  logTime();
  miner.start(8);admin.sleepBlocks(1);miner.stop();
  log("Stop mining");
  logTime();
}

//Print data and time on console
function logTime(){
  var currentdate = new Date();
  var datetime = "Date: "
                  + currentdate.getDay() + "/"
                  + currentdate.getMonth() + "/"
                  + currentdate.getFullYear() + " @ "
                  + currentdate.getHours() + ":"
                  + currentdate.getMinutes() + ":"
                  + currentdate.getSeconds();

 console.log(datetime);
}


function callRaw(account, contract, funcName, params, val){

  //Unlock account
  personal.unlockAccount(account, "");

  //Get account balance
  var beforeBalance = web3.fromWei(eth.getBalance(account));

  //Check if function need value
  if(val){
    params.push({from:primary, value:val, gas:2000000});
  }else{
    params.push({from:primary,  gas:2000000});
  }

  //Estimate gas price
  var estimateFunct = contract[funcName].estimateGas;
  var estimateGas = estimateFunct.apply(estimateFunct, params);

  //Call contract function
  var func = contract[funcName].sendTransaction;
  var res = func.apply(func, params);

  //Mine one block
  mine();

  //Balance after transaction has been mined
  var afterBalance = web3.fromWei(eth.getBalance(primary));

  //Delta - difference before and after transaction
  var deltaBalance = beforeBalance - afterBalance;

  //Transaction Receipt
  var tx = eth.getTransactionReceipt(res);

  //Log result
  log(">>>DEBUG: ('"+ funcName +"')  InitBalance:"+beforeBalance+ ", AfterBalance:"+afterBalance +", Delata:"+ deltaBalance +" ,estimateGas:"+estimateGas+", cumulativeGasUsed:"+tx.cumulativeGasUsed + ", gasUsed:"+tx.gasUsed);
  log(">>>CSV,"+ funcName +","+beforeBalance+ ","+afterBalance +","+ deltaBalance +","+estimateGas+","+tx.cumulativeGasUsed + ","+tx.gasUsed);

}


function call(funcName, params, val){

  callRaw(primary, fsmp, funcName, params, val);
}


function nodeInfo(){
  //Start section, just display important infomation about our node and network.
  log("FSMP test started!!!");
  log("------------------------------------------------------------------------");
  log("");
  log("Default node information.");
  log("Network difficulty:"+admin.nodeInfo.protocols.eth.difficulty);
  log("");
  log("------------------------------------------------------------------------");
}

function initAccounts(){
  //Init part
  //In this section we initialise two accounts
  // primary - for testing operations
  // miningAcc - for mining

  log("Create new accounts....");
  // create account. will prompt for password
  personal.newAccount("");
  personal.newAccount("");
  // name your primary account, will often use it


  primary = eth.accounts[0];
  miningAcc = eth.accounts[1];

  //IF we have multiple accounts, we should set defaultAccount other way fsmp.createBuyOrder will throw Error: invalid address
  eth.defaultAccount=eth.accounts[0];

  log("");
  log("Accounts:"+eth.accounts);
  log("Personal account : "+primary);
  log("Mining   account : "+miningAcc);

  log("Personal account balance : "+ web3.fromWei(eth.getBalance(primary), "ether") +"(ether)");
  log("Mining   account balance : "+ web3.fromWei(eth.getBalance(miningAcc), "ether")+"(ether)");
  log("");

  //Mine some Wei

  // starting miner for primary
  logTime();
  miner.start(8);admin.sleepBlocks(2);miner.stop() ;
  logTime();

  log("");
  log("Personal account balance : "+ web3.fromWei(eth.getBalance(primary), "ether") +"(ether)");
  log("Mining   account balance : "+ web3.fromWei(eth.getBalance(miningAcc), "ether")+"(ether)");
  log("");

  // starting miner for miningAcc

  miner.setEtherbase(miningAcc);

  logTime();
  miner.start(8);admin.sleepBlocks(2);miner.stop();
  logTime();

  log("");
  log("Personal account balance : (ether)"+ web3.fromWei(eth.getBalance(primary), "ether"));
  log("Mining   account balance : (ether)"+ web3.fromWei(eth.getBalance(miningAcc), "ether"));
  log("");

  return primary;
}

function deploySmartContract(){
  log("");
  log("Create Contract !!!!!");

  constractSource = "contract fsmp { struct SellOrder{ uint id; address DSO; uint volumeGB; uint pricePerGB; string DSOConnectionInfo; } struct BuyOrder{ uint id; address DO; uint volumeGB; uint pricePerGB; uint weiInitialAmount; string DOConnectionInfo; } struct StorageContract{ uint id; address DO; address DSO; string DOConnectionInfo; string DSOConnectionInfo; uint volumeGB; uint startDate; uint stopDate; uint pricePerGB; uint weiLeftToWithdraw; uint withdrawedAtDate; } uint sellOrderId; uint buyOrderId; uint storageContractId; SellOrder[] sellOrderArr; BuyOrder[] buyOrderArr; StorageContract[] storageContractArr; function deleteBuyOrderFromArray (uint buyOrderIndex) internal { if(buyOrderIndex != buyOrderArr.length-1){ buyOrderArr[buyOrderIndex] = buyOrderArr[buyOrderArr.length-1]; } buyOrderArr.length--; } function deleteSellOrderFromArray (uint sellOrderIndex) internal { if(sellOrderIndex != sellOrderArr.length-1){ sellOrderArr[sellOrderIndex] = sellOrderArr[sellOrderArr.length-1]; } sellOrderArr.length--; } function deleteStorageContractFromArray (uint storageContractIndex) internal { if(storageContractIndex != storageContractArr.length-1){ storageContractArr[storageContractIndex] = storageContractArr[storageContractArr.length-1]; } storageContractArr.length--; } function weiAllowedToWithdraw(uint storageContractIndex) internal constant returns (uint weiAllowedToWithdraw) { var c = storageContractArr[storageContractIndex]; if (c.startDate == 0) return 0; uint calcToDate = now; if (c.stopDate != 0) calcToDate = c.stopDate; weiAllowedToWithdraw = (calcToDate - c.withdrawedAtDate) * c.pricePerGB * c.volumeGB; if (weiAllowedToWithdraw >= c.weiLeftToWithdraw) weiAllowedToWithdraw = c.weiLeftToWithdraw; return weiAllowedToWithdraw; } function createBuyOrder(uint volumeGB, uint pricePerGB, string DOConnectionInfo) payable { buyOrderArr.push(BuyOrder(++buyOrderId, msg.sender, volumeGB, pricePerGB, msg.value, DOConnectionInfo)); } function cancelBuyOrder(uint buyOrderIndex, uint buyOrderID){ if(buyOrderArr[buyOrderIndex].DO == msg.sender && buyOrderArr[buyOrderIndex].id == buyOrderID){ uint amount = buyOrderArr[buyOrderIndex].weiInitialAmount; deleteBuyOrderFromArray(buyOrderIndex); if (!msg.sender.send(amount)) throw; }else{ throw; } } function getBuyOrder(uint buyOrderIndex)constant returns(uint id, address DO, uint volume, uint pricePerGB, uint weiInitialAmount, string DOConnectionInfo){ return (buyOrderArr[buyOrderIndex].id, buyOrderArr[buyOrderIndex].DO, buyOrderArr[buyOrderIndex].volumeGB, buyOrderArr[buyOrderIndex].pricePerGB, buyOrderArr[buyOrderIndex].weiInitialAmount, buyOrderArr[buyOrderIndex].DOConnectionInfo); } function buyOrdersLength() constant returns(uint) { return buyOrderArr.length; } function createSellOrder(uint volumeGB, uint pricePerGB, string DSOConnectionInfo) { sellOrderArr.push(SellOrder(++sellOrderId, msg.sender, volumeGB, pricePerGB, DSOConnectionInfo)); } function getSellOrder(uint sellOrderIndex)constant returns(uint id, address DSO, uint volume, uint pricePerGB, string DSOConnectionInfo) { return (sellOrderArr[sellOrderIndex].id, sellOrderArr[sellOrderIndex].DSO, sellOrderArr[sellOrderIndex].volumeGB, sellOrderArr[sellOrderIndex].pricePerGB, sellOrderArr[sellOrderIndex].DSOConnectionInfo); } function sellOrdersLength() constant returns(uint){ return sellOrderArr.length; } function cancelSellOrder(uint sellOrderIndex, uint sellOrderID){ if(sellOrderArr[sellOrderIndex].DSO == msg.sender && sellOrderArr[sellOrderIndex].id == sellOrderID){ deleteSellOrderFromArray(sellOrderIndex); return; }else{ throw; } } function createStorageContract(uint orderIndex, uint orderID, uint orderType, string connectionInfo) payable returns (uint newStorageContractID){ if (orderType == 1) { if (buyOrderArr[orderIndex].id != orderID) throw; storageContractArr.push(StorageContract( ++storageContractId, buyOrderArr[orderIndex].DO, msg.sender, buyOrderArr[orderIndex].DOConnectionInfo, connectionInfo, buyOrderArr[orderIndex].volumeGB, 0, 0, buyOrderArr[orderIndex].pricePerGB, buyOrderArr[orderIndex].weiInitialAmount, 0 )); deleteBuyOrderFromArray(orderIndex); return storageContractId; } else if (orderType == 2){ if (sellOrderArr[orderIndex].id != orderID) { throw; } storageContractArr.push(StorageContract( ++storageContractId, msg.sender, sellOrderArr[orderIndex].DSO, connectionInfo, sellOrderArr[orderIndex].DSOConnectionInfo, sellOrderArr[orderIndex].volumeGB, 0, 0, sellOrderArr[orderIndex].pricePerGB, msg.value, 0 )); deleteSellOrderFromArray(orderIndex); return storageContractId; } throw; } function refillStorageContract(uint storageContractIndex, uint storageContractID) payable { var c = storageContractArr[storageContractIndex]; if (msg.sender != c.DO) throw; if (c.id != storageContractID) throw; if (c.stopDate != 0) throw; c.weiLeftToWithdraw += msg.value; } function withdrawFromStorageContract(uint storageContractIndex, uint storageContractID) returns(uint withdrawedWei) { var c = storageContractArr[storageContractIndex]; if (msg.sender != c.DSO && msg.sender != c.DO) throw; if (c.id != storageContractID) throw; if (c.startDate == 0) throw; withdrawedWei = weiAllowedToWithdraw(storageContractIndex); if (msg.sender == c.DSO && withdrawedWei != 0) { c.weiLeftToWithdraw -= withdrawedWei; c.withdrawedAtDate = now; if(!msg.sender.send(withdrawedWei)) throw; if(c.stopDate != 0){ deleteStorageContractFromArray(storageContractIndex); } return withdrawedWei; } if (msg.sender == c.DO && c.stopDate != 0){ if (withdrawedWei != 0) throw; withdrawedWei = c.weiLeftToWithdraw; c.weiLeftToWithdraw -= withdrawedWei; if(!msg.sender.send(withdrawedWei)) throw; deleteStorageContractFromArray(storageContractIndex); return withdrawedWei; } throw; } function startStorageContract(uint storageContractIndex, uint storageContractID) { var c = storageContractArr[storageContractIndex]; if (msg.sender != c.DO) throw; if (c.id != storageContractID) throw; storageContractArr[storageContractIndex].startDate = now; storageContractArr[storageContractIndex].withdrawedAtDate = now; } function stopStorageContract(uint storageContractIndex, uint storageContractID) returns(uint withdrawedWei) { var c = storageContractArr[storageContractIndex]; if (c.id != storageContractID) throw; if (c.stopDate != 0) throw; if (msg.sender != c.DO && msg.sender != c.DSO) throw; c.stopDate = now; withdrawedWei = weiAllowedToWithdraw(storageContractIndex); if (msg.sender == c.DO){ withdrawedWei = c.weiLeftToWithdraw - withdrawedWei; } if (msg.sender == c.DSO){ c.withdrawedAtDate = now; } c.weiLeftToWithdraw -= withdrawedWei; if (!msg.sender.send(withdrawedWei)) throw; if (c.weiLeftToWithdraw == 0) { deleteStorageContractFromArray(storageContractIndex); } } function getStorageContract(uint storageContractIndex) constant returns( uint id, address DO, address DSO, string DOConnectionInfo, string DSOConnectionInfo, uint volumeGB, uint startDate, uint stopDate, uint pricePerGB, uint weiLeftToWithdraw, uint withdrawedAtDate, uint weiAllowedToWithdraw_Output ) { var contr = storageContractArr[storageContractIndex]; var watw = weiAllowedToWithdraw(storageContractIndex); return (contr.id, contr.DO, contr.DSO, contr.DOConnectionInfo, contr.DSOConnectionInfo, contr.volumeGB, contr.startDate, contr.stopDate, contr.pricePerGB, contr.weiLeftToWithdraw, contr.withdrawedAtDate, watw ); } function storageContractsLength() constant returns(uint){ return storageContractArr.length; } } ";

  contract = eth.compile.solidity(constractSource)['<stdin>:fsmp'];

  // create contract object
  //var MyContract = eth.contract(contract['<stdin>:fsmp'].info.abiDefinition);
  // extracts info from contract, save the json serialisation in the given file,
  //contenthash = admin.saveInfo(contract['<stdin>:fsmp'].info, "~/test1/shared/contracts/test/info.json");
  // send off the contract to the blockchain
  //MyContract.new({from: primary, data: contract['<stdin>:fsmp'].code}, gas:2000000);

  personal.unlockAccount(primary, "");
  log("Personal account balance : (ether)"+ web3.fromWei(eth.getBalance(primary), "ether"));

  txhash = eth.sendTransaction({from: primary, data: contract.code, gas:5000000});

  log("Personal account balance : (ether)"+ web3.fromWei(eth.getBalance(primary), "ether"));

  mine();

  log("Contract address:"+eth.getTransactionReceipt(txhash).contractAddress);

  contractaddress = eth.getTransactionReceipt(txhash).contractAddress;

  eth.getCode(contractaddress);

  fsmp = eth.contract(contract.info.abiDefinition).at(contractaddress);

  return fsmp;
}
