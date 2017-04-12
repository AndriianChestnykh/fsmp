(function() {
'use strict';

angular.module('public')
.component('currencyLabel', {
  template: '<span class="label label-info currency"\
                  ng-click="ether = !ether; $ctrl.emitChange(ether)">\
              <span ng-show="ether">ether</span>\
              <span ng-hide="ether">dollar</span>\
            </span>',
  controller: currencyLabelController,
  bindings: {
    cathegory: '@'
  }
});

currencyLabelController.$inject = ['$scope'];
function currencyLabelController ($scope) {
  let ctrl = this;


  ctrl.emitChange = emitChange;
  function emitChange (isEtherOn) {
     $scope.$emit('currency:change', {
      'ether': isEtherOn,
      'cathegory': ctrl.cathegory
    });
  }
 
}

})();