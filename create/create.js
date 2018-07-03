'use strict';

angular.module('myApp.create', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: 'create/create.html',
            controller: 'Create1Ctrl'
        });
    }])

    .controller('Create1Ctrl', function ($scope, $http, $timeout) {
        $scope.offerTypes = [{
                "val": '$',
                "key": 'D',
            },
            {
                "val": '$ off',
                "key": 'V',
            },
            {
                "val": '% off',
                "key": 'P',
            },
        ];

        $scope.appliedOn = [{
                "val": 'Each',
                "key": 'e',
            },
            {
                "val": 'All',
                "key": 'a',
            },
        ];

        $scope.prereqTypes = [{
                "val": 'Quantity',
                "key": 'qty',
            },
            {
                "val": 'Amount',
                "key": 'amt',
            },
        ];

        $scope.targetGroups = [{
                "val": 'Same as Prerequisite or another group',
                "key": 'same',
            },
            {
                "val": 'Target count (upto or exact quantity?)',
                "key": 'count',
            },
            {
                "val": 'Offer amount/percentage',
                "key": 'offer',
            },
        ];

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
                    }
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
        $scope.summaryText = "";
        $scope.groupitems = [];
        $scope.searchterm = "";
        $scope.searchRes = []
        $scope.searchingInProgress = false;

        var searchTimeOut;

        // ##############################
        // #####      Functions     #####
        // ##############################
        

        $scope.getSummaryText = group => {
            var maxlength = 40;
            var itemlist = group.items.map(item => item.productName).toString();
            if (itemlist == '') return "<No Items>";
            return (itemlist.length > maxlength ? itemlist.substring(0, maxlength) + '...' : itemlist);
        }

        $scope.setGroup = groupIndex => {
            $scope.currGroupIndex = groupIndex;
            $scope.loadGroupItems(groupIndex);
        }

        $scope.loadGroupItems = groupIndex => {
            $scope.groupitems = ($scope.groups.length > 0 && groupIndex > -1? $scope.groups[groupIndex].items : [])
        }

        $scope.createGroup = () => {
            $scope.groups.push(
                {
                    "groupId": $scope.roleID + String.fromCharCode('a'.charCodeAt() + $scope.groups.length),
                    "quantity": 1,
                    "items": [],
                }
            )
        }

        $scope.deleteGroup = () => {
            $scope.groups.splice($scope.currGroupIndex--, 1);
            $scope.loadGroupItems($scope.currGroupIndex);
        }

        $scope.deleteItem = itemIndex => {
            $scope.groups[$scope.currGroupIndex].items.splice(itemIndex, 1);
        }

        $scope.fetchSearchItems = () => {
            if ($scope.searchterm != '') {

                if (searchTimeOut) $timeout.cancel(searchTimeOut);
                searchTimeOut = $timeout(() => {

                    $scope.searchingInProgress = true;
                    $http.get('https://nandu-dot-utils-dot-perpule-qa.appspot.com/offers/14/products/search?q=' + $scope.searchterm).then((resp) => {
                        $scope.searchingInProgress = false;
                        console.log(resp);
                        if (resp.status = 200) {
                            $scope.searchRes = resp.data;
                        }
                    });


                }, 100);

            } else $scope.searchRes = [];
        }
    });