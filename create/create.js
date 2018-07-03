'use strict';

angular.module('myApp.create', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: 'create/create.html',
            controller: 'Create1Ctrl'
        });
    }])

    .controller('Create1Ctrl', function ($scope) {
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

        $scope.searchRes = [{
                "productName": 'First Result',
                "sku": 'res1',
            },
            {
                "productName": 'Another Result',
                "sku": 'res2',
            },
            {
                "productName": 'Final Result',
                "sku": 'res3',
            },
        ]

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
        $scope.currGroupID = 0;
        $scope.groupitems = [];
        
        // Functions
        $scope.setGroup = groupIndex => {
            $scope.currGroup = groupIndex;
            console.log($scope.currGroup + ' loaded');
            $scope.loadGroupItems(groupIndex);
        }

        $scope.loadGroupItems = groupIndex => {
            // $scope.CurrGroup = $scope.groups.filter((gp) => gp.groupId == gpID);
            $scope.CurrGroup = $scope.groups[groupIndex];
            $scope.groupitems = $scope.CurrGroup.items;

        }

        $scope.deleteItem = itemIndex => {
            $scope.groups[$scope.currGroupID].items.splice(itemIndex, 1);
        }


    });