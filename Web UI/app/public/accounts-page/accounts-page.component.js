angular.module('public')
    .component('accountsPage', {
        templateUrl: 'app/public/accounts-page/accounts-page.template.html',
        controller: ['appConfig', 'Web3Service',
            function AccountsPageController(appConfig, Web3Service) {
                var web3 = Web3Service.getWeb3();

                this.accounts = web3.eth.accounts;

                var self = this;

                self.getTotalBalance = getTotalBalance;
                self.getAccountBalance = getAccountBalance;

                function getTotalBalance(accounts) {
                    var totalBalance = 0;
                    for(var i = 0; i < accounts.length; i++) {
                        var accountBalance = web3.fromWei(web3.eth.getBalance(accounts[i]));
                        totalBalance += parseFloat(accountBalance);
                    }
                    return totalBalance;
                }

                function getAccountBalance(account) {
                    return parseFloat(web3.fromWei(web3.eth.getBalance(account)));
                }

                // console.log(getTotalBalance(this.accounts));
                // console.log(getAccountBalance(this.accounts[0]));
                // console.log(getAccountBalance(this.accounts[1]));
            }
        ]
    });
