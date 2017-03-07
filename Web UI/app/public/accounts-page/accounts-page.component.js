(function() {
'use strict';

angular.module('public')
  .component('accountsPage', {
    templateUrl: 'app/public/accounts-page/accounts-page.template.html',
    controller: AccountsPageController
  });

AccountsPageController.$inject = ['appConfig', 'Web3Service', 'AccountsService'];
function AccountsPageController(appConfig, Web3Service, AccountsService) {
  let web3 = Web3Service.getWeb3();

  let ctrl = this;

  ctrl.$onInit = onInit;

  ctrl.accounts = [];
  ctrl.setAsCurrent = setAsCurrent;
  ctrl.createAccount = createAccount;

  function getAllBalances(accounts) {
      var totalBalance = 0, accountNumber, accountBalance;
      for(var i = 0; i < accounts.length; i++) {
          accountNumber = accounts[i];

          accountBalance = web3.fromWei(web3.eth.getBalance(accountNumber));
          accountBalance = parseFloat(accountBalance);
          ctrl.accounts.push({
            number: accountNumber,
            balance: accountBalance
          });
          totalBalance += accountBalance;
      }
      return totalBalance;
  }

  function getAccountBalance(account) {
    return web3.fromWei(web3.eth.getBalance(account)).toString(10);
    // return parseFloat(web3.fromWei(web3.eth.getBalance(account)));
  }

  function setAsCurrent(acc) {
    ctrl.currentAccount = AccountsService.setCurrentAccount(acc);
  }

  function createAccount(password) {
    ctrl.newAccount = web3.personal.newAccount(password);
    console.log('password ->', password, '\naccount ->', account);
    ctrl.totalBalance = getAllBalances(web3.eth.accounts);
  }

  function onInit() {
    ctrl.totalBalance = getAllBalances(web3.eth.accounts);
    ctrl.currentAccount = AccountsService.getCurrentAccount();
  }
}

}());
