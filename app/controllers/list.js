'use strict';

angular.module('myApp.list', ['ngRoute', 'myApp.factory'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/list', {
            templateUrl: 'app/views/list.html',
            controller: 'ListCtrl'
        });
    }])

    .controller('ListCtrl', ['$scope', '$http', '$timeout', 'api', function ($scope, $http, $timeout, api) {
        $scope.offers = [];
        $scope.shopID = 14;
        $scope.limit = 10;
        $scope.offset = 0;
        $scope.loading = false;
        $scope.statusMessages = {
            secondary: 'No offers loaded',
            warning: 'Fetching offers',
            success: 'Offers Loaded',
        }

        var fetchTimeOut;

        $scope.fetchList = function () {
            if (fetchTimeOut) $timeout.cancel(fetchTimeOut);

            $scope.loading = true;
            $scope.offers = [];
            fetchTimeOut = $timeout(function () {

                api.listOffers($scope.shopID).then(function(data) {
                    console.log(data);
                    $scope.loading = false;
                    $scope.offers = data;
                });
            }, 10);

        }

        $scope.get = function (ruleID) {
            if(ruleID == undefined) alert("Invalid ruleID.")
            else api.fetchOffer($scope.shopID, ruleID).then(function(data) {console.log(data)})
        }

        $scope.getSummaryText = function(group) {
            var itemlist = group.items.map(function(item) {
                return item.productName;
            }).toString();
            return (itemlist == '' ? "<No Items>" : itemlist);
        }


        // Initialize
        $scope.fetchList();

    }]);