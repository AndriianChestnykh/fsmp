(function() {
'use strict';

angular.module('public')
  .component('accountsPage', {
    templateUrl: 'app/public/accounts-page/accounts-page.template.html',
    controller: AccountsPageController
  });

AccountsPageController.$inject = ['appConfig', 'Web3Service', 'AccountsService'];
function AccountsPageController(appConfig, Web3Service, AccountsService) {
  var web3 = Web3Service.getWeb3();

  this.accounts = web3.eth.accounts;

  let ctrl = this;

  ctrl.getTotalBalance = getTotalBalance;
  ctrl.getAccountBalance = getAccountBalance;
  ctrl.setAsCurrent = setAsCurrent;

  function getTotalBalance(accounts) {
      var totalBalance = 0;
      for(var i = 0; i < accounts.length; i++) {
          var accountBalance = web3.fromWei(web3.eth.getBalance(accounts[i]));
          totalBalance += parseFloat(accountBalance);
      }
      return totalBalance;
  }

  function getAccountBalance(account) {
    return web3.fromWei(web3.eth.getBalance(account)).toString(10);
    // return parseFloat(web3.fromWei(web3.eth.getBalance(account)));
  }

  function setAsCurrent(acc) {
    AccountsService.setCurrentAccount(acc);
  }

  // console.log(getTotalBalance(this.accounts));
  // console.log(getAccountBalance(this.accounts[0]));
  // console.log(getAccountBalance(this.accounts[1]));
}

}());
