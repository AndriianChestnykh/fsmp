(function() {
'use strict';

angular.module('public')
  .component('syncPage', {
    templateUrl: 'app/public/sync-page/sync-page.template.html',
    controller: syncPageController,
  });

syncPageController.$inject = ['$scope', '$http'];

function syncPageController($scope, $http) {
	var baseUrl = 'http://localhost:8384'
	$scope.apiKey = 'r4ZaVkfv56PaAQgiYsHVkYkFZsGsXN6G'

	$scope.getConfig = function () {
		getCfg($http, function callback(cfg){
			var json = JSON.stringify(cfg.devices, null, 2)
         	$('#config-result').text(json)
         	console.log(json)
		})
   	}

   	$scope.removeDevice = function(){
    	removeDevice($scope.deviceId_r)
    }

	function removeDevice(deviceId){
        getCfg($http, function callback(cfg){
        	var len = cfg.devices.length
        	cfg.devices = cfg.devices.filter(d => {
        		d.deviceID != deviceId
        	})
        	if(len != cfg.devices.length){
        		$('#message_r').html("no device with id: " + deviceId)
        	} else {
        		updateCfg($http, cfg, status => {
        			if(status == 200){
        				$('#message_r').html("success")
        			}
	          	})
        	}
        })
	}

	$scope.addDevice = function () {
        checkDeviceId($http, $scope.deviceId, response => {
        	console.log(response)
        	if(response.data.error){
        		$('#message').html(response.data.error)
        	} else if (response.data.id){
        		getCfg($http, function callback(cfg){
        			cfg.devices.push({
        				'deviceID': $scope.deviceId,
						'name': $scope.name,
						'addresses':["dynamic"],
						"compression":"metadata",
						"certName":"",
						"introducer":false,
						"skipIntroductionRemovals":false,
						"introducedBy":"",
						"paused":false
        			})
        			updateCfg($http, cfg, status => {
        				if(status == 200){
        					$('#message').html("success")
        				}
	          		})
        		})
        	}
        })
    }

    $scope.changeDeviceState = function(){
    	changeDeviceState($http, $scope.deviceId_p)
    }

    function changeDeviceState($http, deviceId){
        getCfg($http, cfg => {
        	var result = undefined
        	console.log(cfg.devices)
        	for(var i = 0; i < cfg.devices.length; i++){
        		if(cfg.devices[i].deviceID == deviceId){
        			var paused = cfg.devices[i].paused
        			result = !paused
        			cfg.devices[i].paused = !paused
        		}
        	}
        	if(result == undefined){
        		$('#update').html('no device with id: ' + deviceId)
        	} else {
        		updateCfg($http, cfg, status => {
	       			$http({
        				method: 'GET',
        				url : baseUrl + '/rest/system/config/insync',
        				headers : {'X-API-Key': $scope.apiKey}
        			}).then(success => {
	       				$('#update').html('paused: ' + result)
	       			}, error => {
	       				console.log(error)
	       			})
        		})
        	}
        })
    }

    function updateCfg($http, cfg, callback){
        var req = {
			method: 'POST',
			url : baseUrl + '/rest/system/config',
			headers : {
				'X-API-Key': $scope.apiKey
			},
			data: cfg
		}
		$http(req).then(function successCallback(response){
			console.log(response)
			callback(response.status)
	  	}, function errorCallback(response) {
	  		console.log(response)
		})
    }

   	function getCfg($http, callback){
        var req = {
			method: 'GET',
			url : baseUrl + '/rest/system/config',
			headers : {
				'X-API-Key': $scope.apiKey
			}
		}
        $http(req).then(function successCallback(response){
			callback(response.data)
	  	}, function errorCallback(response) {
	  		console.log(response)
	    })
    }

    function checkDeviceId($http, deviceId, callback){
        var req = {
			method: 'GET',
			url : baseUrl + '/rest/svc/deviceid?id=' + deviceId,
			headers : {
				'X-API-Key': $scope.apiKey
			}
		}
		$http(req).then(function successCallback(response){
			callback(response)
	  	}, function errorCallback(response) {
	  		console.log(response.status)
		})
    }
}

}());
