(function() {
'use strict';

angular.module('public')
.controller('navController', navController);

navController.$inject = ['$location'];
function navController ($location) {
  let path = $location.path(), activeAnchor;
  let navCtrl = this;

  activeAnchor = document.querySelector('li>a[href="#' + path + '"]');
  
  //if some other path activeAnchor must be MAIN
  if (!activeAnchor) {
    activeAnchor = document.querySelector('li>a[href="#/main"]');
  }

  activeAnchor.parentNode.className = 'active';  

  navCtrl.activateAnchor = activateAnchor;

  function activateAnchor (event) {
    event.target.parentNode.className = 'active';
    activeAnchor.parentNode.className = '';
    activeAnchor = event.target;
  }
}

})();