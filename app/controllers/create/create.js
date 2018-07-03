'use strict';

angular.module('myApp.create', ['ngRoute', 'myApp.factory'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: 'app/controllers/create/create.html',
            controller: 'Create1Ctrl'
        });
    }])

    .controller('Create1Ctrl', ['$scope', '$http', '$timeout', 'api', function ($scope, $http, $timeout, api) {
        var staticData = $http.get('/static/data.json').then((resp) => {
            $scope.offerTypes = resp.data.offerTypes;
            $scope.appliedOn = resp.data.appliedOn;
            $scope.prereqTypes = resp.data.prereqTypes;
            $scope.targetGroups = resp.data.targetGroups;
        });

        $scope.groups = [{
                "groupId": '10517844464A',
                "quantity": '2',
                "items": [{
                        "productName": "Bucket 16 Ltr",
                        "sku": "100000616"
                    },
                    {
                        "productName": "Gebi Garbage Bag Small 30 Pc 1",
                        "sku": "100000613"
                    },
                ],
            },
            {
                "groupId": '10517844464b',
                "quantity": '3',
                "items": [{
                    "productName": "Silver House Tope 22 G 28 Cm 1",
                    "sku": "100000636"
                }],
            },
        ];
        $scope.roleID = '10517844464';
        $scope.currGroupIndex = 0;
        $scope.gpqty = parseInt($scope.groups[$scope.currGroupIndex].quantity);
        $scope.lastGpByLength = $scope.groups.length;
        $scope.summaryText = "";
        $scope.groupitems = [];
        $scope.searchterm = "";
        $scope.searchRes = []
        $scope.searchingInProgress = false;
        var searchTimeOut;


        // ############################################################
        // ###############           Functions          ###############
        // ############################################################

        $scope.getSummaryText = group => {
            var maxlength = 40;
            var itemlist = group.items.map(item => item.productName).toString();
            return (itemlist == '' ? "<No Items>" : (itemlist.length > maxlength ? itemlist.substring(0, maxlength) + '...' : itemlist))
        }

        $scope.setQty = () => {
            $scope.groups[$scope.currGroupIndex].quantity = $scope.gpqty;
        }

        $scope.setGroup = groupIndex => {
            $scope.currGroupIndex = groupIndex;
            $scope.loadGroupItems(groupIndex);
            $scope.gpqty = parseInt($scope.groups[$scope.currGroupIndex].quantity);
        }

        $scope.loadGroupItems = groupIndex => {
            $scope.groupitems = ($scope.groups.length > 0 && groupIndex > -1 ? $scope.groups[groupIndex].items : [])
        }

        $scope.createGroup = () => {
            $scope.groups.push({
                "groupId": $scope.roleID + String.fromCharCode('a'.charCodeAt() + $scope.lastGpByLength),
                "quantity": 1,
                "items": [],
            });
            $scope.lastGpByLength = ($scope.lastGpByLength++ < $scope.groups.length ? $scope.groups.length : ($scope.groups.length == 0 ? 0 : $scope.lastGpByLength))
        }

        $scope.deleteGroup = () => {
            $scope.groups.splice($scope.currGroupIndex--, 1);
            $scope.loadGroupItems($scope.currGroupIndex);
        }

        $scope.addItem = itemIndex => {
            $scope.groups[$scope.currGroupIndex].items.push($scope.searchRes[itemIndex]);
        }

        $scope.deleteItem = itemIndex => {
            $scope.groups[$scope.currGroupIndex].items.splice(itemIndex, 1);
        }

        $scope.fetchSearchItems = () => {
            if ($scope.searchterm != '') {
                if (searchTimeOut) $timeout.cancel(searchTimeOut);
                $scope.searchingInProgress = true;
                searchTimeOut = $timeout(() => {
                    api.search($scope.searchterm).then((data) => {
                        $scope.searchingInProgress = false;
                        $scope.searchRes = data;
                    });

                }, 100);
            } else $scope.searchRes = [];
        }
    }]);