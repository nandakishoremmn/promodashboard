'use strict';

angular.module('myApp.offer', ['ngRoute', 'myApp.factory'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/offer', {
            templateUrl: 'app/views/offer.html',
            controller: 'OfferCtrl'
        });
    }])

    .controller('OfferCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'api', function ($scope, $http, $timeout, $routeParams, api) {

        // Todo: breadcrumb notifs
        console.log($routeParams.action);

        var routeActions = {
            edit: {
                value: "edit",
                title: "Edit Offer"
            },
            create: {
                value: "create",
                title: "Create Offer"
            },
            undefined: {
                value: "undefined",
                title: "Invalid Action"
            }
        }

        // console.log($routeParams);
        switch ($routeParams.action) {

            // Create offer
            case routeActions.create.value:
                $scope.actionType = routeActions.create;
                $scope.actionType.data = {
                    shopId: $routeParams.shopID || 14,
                    ruleId: Math.random().toString(10).substring(11)
                };
                break;

            // Edit Offer
            case routeActions.edit.value:
                $scope.actionType = routeActions.edit;
                $scope.actionType.data = {
                    shopId: $routeParams.shopID || 14,
                    ruleId: $routeParams.ruleID
                };
                break;

            default:
                $scope.actionType = routeActions.undefined;
                $scope.actionType.input = $routeParams.action;
                break;
        }

        console.log('Action key: ', $scope.actionType.value)

        // Load Options
        api.fetchOptions().then((data) => {
            // $scope.targetGroups = data.targetGroups;
            $scope.offerTypesOptions = data.offerTypesOptions;
            $scope.appliedOnOptions = data.appliedOnOptions;
            $scope.prereqTypeOptions = data.prereqTypeOptions;
            $scope.normTypeOptions = data.normTypeOptions;
            $scope.targetGroupOptions = data.targetGroupOptions;
            $scope.offerApplicationLogicOptions = data.offerApplicationLogicOptions;
        }).then(() => {
            // Initialize

            // From ten days later to a month from that
            $scope.startDate = new Date(Date.now());
            $scope.startDate.setDate($scope.startDate.getDate() + 10);
            $scope.startDate.setHours(0, 0, 0, 0);

            $scope.endDate = new Date($scope.startDate);
            $scope.endDate.setMonth($scope.endDate.getMonth() + 1);
            $scope.endDate.setHours(23, 59, 59, 0);

            $scope.selectedOfferType = $scope.offerTypesOptions[0];
            $scope.selectedAppliedOn = $scope.appliedOnOptions[0];
            $scope.selectedPrereqType = $scope.prereqTypeOptions[0];
            $scope.selectedNormType = $scope.normTypeOptions[0];
            $scope.offerApplicationLogic = $scope.offerApplicationLogicOptions[0];
            $scope.selectedTargetGroup = $scope.targetGroupOptions[0];

            $scope.gpOfferType = $scope.offerTypesOptions[0];
            $scope.gpOfferQty = 1

            // $scope.targetID = data.targetIdCount.split(',')[0];
            // $scope.targetCount = parseInt(data.targetIdCount.split(',')[1]);
            // $scope.groups = data.preRequisites;

            $scope.lineSpecOffer = false;
            $scope.offerValue = 20;
            $scope.targetCount = 100;
            $scope.exactOrUpto = true;
            $scope.targetGroup = {};
            $scope.activationCode = '';
            $scope.offerTier = 1;
            $scope.maxApplicationLimit = 9999

            $scope.groups = []; //Groups
            $scope.qty = []; //Array of group quantities, mapped to $scope.groupiems[]

            $scope.currGroupIndex = -1; // Array index of the current selected group(in $scope.groupiems[])
            $scope.lastGpByLength = $scope.groups.length;
            $scope.groupitems = []; //Group items of the selected group, to be displayed
            $scope.searchterm = ""; //Item Search string
            $scope.searchRes = [] //Search results
            $scope.searchingInProgress = false; //Whether an item search is in progress
            $scope.allowSet = false; //Whether the user is changing the shopId (and ruleId, in case of an edit)
            $scope.invalidFetch = false; //Whether the shopID and ruleID points to an invalid offer

        }).then(() => {
            // Watchers
            $scope.$watchCollection('[startDate, endDate]', () => {
                $scope.happyHours = $scope.startDate.getHours() + ':' + $scope.startDate.getMinutes() + ':00'
                '-' + $scope.endDate.getHours() + ':' + $scope.endDate.getMinutes() + ':00';
            });

            $scope.$watchCollection('[gpOfferType, gpOfferQty]', () => {
                if ($scope.currGroupIndex != -1) {
                    $scope.groups[$scope.currGroupIndex].gpOfferType = $scope.gpOfferType;
                    $scope.groups[$scope.currGroupIndex].gpOfferQty = $scope.gpOfferQty;
                }
            });

            // $scope.$watch('groups', () => {console.log($scope.groups)});
        });

        $scope.paramsFinal = [
            'ruleId',
            'startDate',
            'endDate',
            'selectedOfferType',
            'selectedAppliedOn',
            'selectedPrereqType',
            'selectedNormType',
            'selectedTargetGroup',
            'lineSpecOffer',
            'offerValue',
            'targetCount',
            'exactOrUpto',
            'targetGroup',
            'gpOfferQty',
            'gpOfferType',
            'activationCode',
            'maxApplicationLimit',
            'happyHours',
            'offerTier',
            'offerApplicationLogic',
        ]

        $scope.paramMapping = {
            // offerApplicationLogic: 'intraTierLogic'
            selectedOfferType: 'type',
            selectedAppliedOn: 'appliedOn',
            selectedPrereqType: 'preRequisiteType',
        };

        $scope.getParam = param => {
            return $scope.$eval(param);
        };

        // Load Data and initialize
        // api.fetchData().then((data) => {
        //     $scope.initialData = data;
        //     $scope.startDate = new Date(data.startDate);
        //     $scope.endDate = new Date(data.endDate);

        //     $scope.selectedOfferType = data.type;
        //     $scope.selectedAppliedOn = data.appliedOn;
        //     $scope.selectedPrereqType = data.preRequisiteType;
        //     $scope.selectedNormType = {};
        //     $scope.selectedTargetGroup = {};

        //     // $scope.targetID = data.targetIdCount.split(',')[0];
        //     $scope.targetCount = parseInt(data.targetIdCount.split(',')[1]);

        //     $scope.offerValue = data.offerValue;
        //     $scope.activationCode = data.offerCode;
        //     $scope.maxApplicationLimit = data.maxApplicationLimit;

        //     $scope.groups = data.preRequisites;

        //     $scope.ruleID = Math.random().toString(10).substring(11);
        //     $scope.currGroupIndex = -1;
        //     $scope.gpqty = ($scope.currGroupIndex == -1 ? 0 : parseInt($scope.groups[$scope.currGroupIndex].quantity));
        //     $scope.lastGpByLength = $scope.groups.length;
        //     $scope.summaryText = "";
        //     $scope.groupitems = [];
        //     $scope.searchterm = "";
        //     $scope.searchRes = []
        //     $scope.searchingInProgress = false;
        // });


        $scope.savedata = () => {
            // var data = $scope.initialData;
            var finalData = {};
            $scope.paramsFinal.map((param) => {
                console.log(param);
                var newParam = ($scope.paramMapping.hasOwnProperty(param) ? $scope.paramMapping[param] : param);
                // $scope.paramMapping.hasOwnProperty(param) && (newParam = $scope.paramMapping[param]);
                finalData[newParam] = ($scope.$eval(param).hasOwnProperty('value') ? $scope.$eval(param)['value'] : $scope.$eval(param));
            });

            finalData['preRequisites'] = $scope.groups;
            // finalData['preRequisites'].map((group) => {
            //     if (!$scope.lineSpecOffer) {
            //         delete group['gpOfferQty'];
            //         delete group['gpOfferType'];
            //     }
            // });

            // If target group type is same, delete the target group dropdown value
            ($scope.selectedTargetGroup.value == $scope.targetGroupOptions[0].value) && delete finalData['targetGroup']
            console.log($scope.targetCount);
            console.log(finalData.targetCount);

            console.log(finalData);
            api.save(finalData, $scope.actionType.data.shopId).then((res) => {
                console.log(res);
            });
        }

        var searchTimeOut;

        // ############################################################
        // ###############           Functions          ###############
        // ############################################################

        // Get summary text for each group as a comma joined value of the names of its constituent items
        $scope.getSummaryText = group => {
            // var maxlength = 60;
            var itemlist = group.items.map(item => item.productName).toString();
            // return (itemlist == '' ? "<No Items>" : (itemlist.length > maxlength ? itemlist.substring(0, maxlength) + '...' : itemlist));
            return (itemlist == '' ? "<No Items>" : itemlist);
        }

        // Set group quantity
        $scope.setQty = (groupIndex) => {
            $scope.groups[groupIndex].quantity = $scope.qty[groupIndex];
        }

        // Change current selected group index
        $scope.setGroup = groupIndex => {
            $scope.currGroupIndex = groupIndex;
            $scope.loadGroupItems(groupIndex);
            // $scope.gpqty = parseInt($scope.groups[$scope.currGroupIndex].quantity);
            $scope.gpOfferQty = parseInt($scope.groups[$scope.currGroupIndex].gpOfferQty);
            $scope.gpOfferType = $scope.groups[$scope.currGroupIndex].gpOfferType;
        }

        // Load group items onto the display list
        $scope.loadGroupItems = groupIndex => {
            $scope.groupitems = ($scope.groups.length > 0 && groupIndex > -1 ? $scope.groups[groupIndex].items : [])
        }

        // Create a new group
        $scope.createGroup = () => {
            $scope.groups.push({
                "groupId": $scope.actionType.data.ruleId + String.fromCharCode('a'.charCodeAt() + $scope.lastGpByLength),
                "quantity": 1, //($scope.currGroupIndex == -1 ? $scope.gpqty : 1),
                "items": [],
                "gpOfferQty": ($scope.currGroupIndex == -1 ? $scope.gpOfferQty : 1),
                "gpOfferType": ($scope.currGroupIndex == -1 ? $scope.gpOfferType : $scope.offerTypesOptions[0]),
            });
            $scope.qty.push(1);
            $scope.lastGpByLength = ($scope.lastGpByLength++ < $scope.groups.length ? $scope.groups.length : ($scope.groups.length == 0 ? 0 : $scope.lastGpByLength))
        }

        // Delete a group
        $scope.deleteGroup = (groupIndex) => {
            // console.log(groupIndex)
            $scope.groups.splice(groupIndex, 1); //Remove group from the array
            $scope.qty.splice(groupIndex, 1); //Remove it's mapped quantity
            $scope.loadGroupItems(--$scope.currGroupIndex); //Load the previous group
        }

        // If the current selected group index is not -1, add the clicked item to the group
        $scope.addItem = itemIndex => {
            $scope.currGroupIndex != -1 && $scope.groups[$scope.currGroupIndex].items.push($scope.searchRes[itemIndex]);
        }

        // Delete an item from the current selected group
        $scope.deleteItem = itemIndex => {
            $scope.groups[$scope.currGroupIndex].items.splice(itemIndex, 1);
        }

        // Search the API for items
        $scope.fetchSearchItems = () => {
            if ($scope.searchterm != '') {
                if (searchTimeOut) $timeout.cancel(searchTimeOut);
                $scope.searchingInProgress = true;
                searchTimeOut = $timeout(() => {
                    api.search($scope.searchterm, $scope.actionType.data.shopId).then((data) => {
                        $scope.searchingInProgress = false;
                        $scope.searchRes = data;
                    });

                }, 100); //The timer is to make sure that the search happens only after the user has stopped typing, as a new instance of the timeout cancels the previous one
            } else $scope.searchRes = [];
        }

        $scope.setParams = () => {
            $scope.invalidFetch = false;
            api.fetchOffer($scope.actionType.data.shopId, $scope.actionType.data.ruleId).then((data) => {
                console.log(data);
                $scope.allowSet = false;
            }).catch((err) => {
                console.log(err);
                $scope.invalidFetch = true;
            })
        }
    }]);