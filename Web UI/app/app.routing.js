angular.
module('fsmpApp').
config(['$locationProvider', '$routeProvider',
  ($locationProvider, $routeProvider) => {
    $locationProvider.hashPrefix('');
    $routeProvider.
    when('/main', {
        template: '<main-page></main-page>'
    }).
    when('/contract', {
        template: '<contract-page></contract-page>'
    }).
    when('/accounts', {
        template: '<accounts-page></accounts-page>'
    })
    // .
    // when('/sync', {
    //     template: '<sync-page></sync-page>'
    // })
    .otherwise('/main');
  }
]);
