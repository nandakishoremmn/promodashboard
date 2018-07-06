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

        $scope.fetchList = () => {
            $scope.loading = true;
            api.listOffers($scope.shopID).then((data) => {
                $scope.loading = false;
                console.log(data);
                $scope.offers = data;
            });
        }

    }]);