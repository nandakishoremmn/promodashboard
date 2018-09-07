'use strict';

angular.module('myApp.offer', ['ngRoute', 'myApp.factory'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/offer/:action', {
            templateUrl: 'app/views/offer.html',
            controller: 'OfferCtrl'
        });
    }])

    .controller('OfferCtrl', ['$scope', '$http', '$timeout', '$routeParams', 'api', function ($scope, $http, $timeout, $routeParams, api) {

        $scope.getOfferTemplate = function () {
            return {
                "activeDays": "1111111",
                "additionalField1": null,
                "additionalField2": null,
                "additionalField3": null,
                "additionalField4": null,
                "allowGroupPartialReturn": 1,
                "appliedOn": "All",
                "billBuster": 0,
                "discountType": "USUAL",
                "endDateTemp": function () { var d = new Date(); d.setHours(23, 59, 0, 0); return d } (),
                "forcedPriority": 1,
                "groupQualifierId": "USUAL",
                "happyHour": 0,
                "hypGrpOfferFlag": 0,
                "intraTierLogic": "BESTBUY",
                "inversePriority": null,
                "lineSpecFlag": 0,
                "maxApplicationLimit": 9999,
                "mix": "allSources",
                "offerCode": "BuyNGetMatZ%offEach",
                "offerId": 150548071,
                "offerValue": 100,
                "preRequisiteType": "N",
                "preRequisites": [],
                "promoPerUnit": 0,
                "quantity": 1,
                "quantityMax": null,
                "ruleId": Math.random().toString(10).substring(11),
                "ruleIdToTrigger": null,
                "secondaryOffer": 0,
                "shopId": 999,
                "startDateTemp":  function () { var d = new Date(); d.setHours(0, 0, 0, 0); return d } (),
                "targetCount": 1,
                "targetGroup": "017297505a",
                "targetGroupOption": "same",
                "targetCountType": "exact",
                "targetIdCount": "1",
                "tierDescription": "Default",
                "tierId": 1,
                "type": "%off",
                "validatedFlag": 1,
                "vatExtra": 0
            }
        };

        $scope.main = function () {
            $scope.offer = $scope.getOfferTemplate();
            if($routeParams.ruleId && $routeParams.shopId){
                $scope.fetch_offer($scope.shopId, $scope.ruleId);
            }
        };

        $scope.main();









        // Todo: breadcrumb notifs
        // Todo: add <loading> when edit loads
        // Todo: Happy Hour
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
                    shopId: $routeParams.shopID || 999,
                    ruleId: Math.random().toString(10).substring(11)
                };
                break;

                // Edit Offer
            case routeActions.edit.value:
                $scope.actionType = routeActions.edit;
                $scope.actionType.data = {
                    shopId: $routeParams.shopID || 999,
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
        api.fetchOptions()
            .then(function(data) {
                for (var key in data) {
                    $scope[key] = data[key];
                }
            })
            // .then(function() {
            //     $scope.loadData()
            // })
            // .then(function() {
            //     // Watchers
            //     $scope.$watchCollection('[startDate, endDate]', function() {
            //         $scope.happyHour = $scope.startDate.getHours() + ':' + $scope.startDate.getMinutes() + ':00' +
            //         '-' + $scope.endDate.getHours() + ':' + $scope.endDate.getMinutes() + ':00';
            //     });
            //
            //     $scope.$watchCollection('[gpOfferType, gpOfferValue]', function() {
            //         if ($scope.currGroupIndex != -1) {
            //             $scope.groups[$scope.currGroupIndex].gpOfferType = $scope.gpOfferType;
            //             $scope.groups[$scope.currGroupIndex].gpOfferValue = $scope.gpOfferValue;
            //         }
            //     });
            //
            //     // $scope.$watch('groups', () => {console.log($scope.groups)});
            // });

        $scope.loadData = function() {
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
            $scope.gpOfferValue = 1

            // $scope.targetID = data.targetIdCount.split(',')[0];
            // $scope.targetCount = parseInt(data.targetIdCount.split(',')[1]);
            // $scope.groups = data.preRequisites;

            $scope.lineSpecFlag = false;
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

            if ($scope.actionType.value == routeActions.edit.value) {
                api.fetchOffer($scope.actionType.data.shopId, $scope.actionType.data.ruleId).then(function(data) {
                    var initialData = data.data;

                    console.log('Initial Data', initialData);
                    $scope.startDate = new Date(initialData.startDate);
                    $scope.endDate = new Date(initialData.endDate);

                    $scope.selectedOfferType = $scope.offerTypesOptions.filter(function(option) { return option.value == initialData.type })[0];
                    $scope.selectedAppliedOn = $scope.appliedOnOptions.filter(function(option) { return option.value ==  initialData.appliedOn })[0];
                    $scope.selectedPrereqType = $scope.prereqTypeOptions.filter(function(option) { return option.value ==  initialData.preRequisiteType })[0];

                    // TODO: Map NormType to API 
                    // $scope.selectedNormType = $scope.normTypeOptions.filter((option) => option.value == initialData.preRequisiteType)[0];
                    $scope.selectedTargetGroup = {};

                    // $scope.selectedNormType = $scope.normTypeOptions[0];
                    $scope.offerApplicationLogic = $scope.offerApplicationLogicOptions[0];
                    $scope.selectedTargetGroup = $scope.targetGroupOptions[0];

                    $scope.gpOfferType = $scope.offerTypesOptions.filter(function(option) { return option.value == initialData.type })[0];
                    $scope.gpOfferValue = 1

                    // $scope.targetID = data.targetIdCount.split(',')[0];
                    // $scope.targetCount = parseInt(data.targetIdCount.split(',')[1]);
                    // $scope.groups = data.preRequisites;

                    $scope.lineSpecFlag = (initialData.lineSpecFlag == 1 ? true : false);
                    $scope.offerValue = 20;
                    $scope.targetCount = 100;
                    $scope.exactOrUpto = true;
                    $scope.targetGroup = {};
                    $scope.activationCode = '';
                    $scope.offerTier = 1;
                    $scope.maxApplicationLimit = 9999

                    $scope.groups = initialData.preRequisites; //Groups
                    $scope.qty = initialData.preRequisites.map(function(gp) { return gp.quantity }); //Array of group quantities, mapped to $scope.groupiems[]

                    $scope.groups.map(function(group) {
                        if ($scope.lineSpecFlag == 1) {
                            // delete group['gpOfferValue'];
        
                            group['gpOfferValue'] = group['offerValue'];
                            group['gpOfferType'] = group['offerType'];

                            console.log('a');
                            console.log(group['gpOfferType']);
                            console.log($scope.offerTypesOptions);
                            console.log($scope.offerTypesOptions.filter(function(option) { return option.value == group['gpOfferType'] })[0]);

                            console.log('b');

                            group['gpOfferType'] = $scope.offerTypesOptions.filter(function(option) { return option.value == group['gpOfferType'] })[0];
                            console.log(group['gpOfferType']);

                            console.log('c');

        
                            delete group['offerType'];
                            delete group['offerValue'];
                        }
                    });
        


                    $scope.currGroupIndex = -1; // Array index of the current selected group(in $scope.groupiems[])
                    $scope.lastGpByLength = $scope.groups.length;
                    $scope.groupitems = []; //Group items of the selected group, to be displayed
                    $scope.searchterm = ""; //Item Search string
                    $scope.searchRes = [] //Search results
                    $scope.searchingInProgress = false; //Whether an item search is in progress
                    $scope.allowSet = false; //Whether the user is changing the shopId (and ruleId, in case of an edit)
                    $scope.invalidFetch = false; //Whether the shopID and ruleID points to an invalid offer

                })
            }
        };
        $scope.ruleId = $scope.actionType.data.ruleId;

        $scope.paramsFinal = [
            'ruleId',
            'startDate',
            'endDate',
            'selectedOfferType',
            'selectedAppliedOn',
            'selectedPrereqType',
            'selectedNormType',
            'selectedTargetGroup',
            'lineSpecFlag',
            'offerValue',
            'targetCount',
            'exactOrUpto',
            'targetGroup',
            'gpOfferValue',
            'gpOfferType',
            'activationCode',
            'maxApplicationLimit',
            // 'happyHour',
            'offerTier',
            'offerApplicationLogic',
        ]

        $scope.paramMapping = {
            // offerApplicationLogic: 'intraTierLogic'
            selectedOfferType: 'type',
            selectedAppliedOn: 'appliedOn',
            selectedPrereqType: 'preRequisiteType',
        };

        $scope.getParam = function(param) {
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


        $scope.savedata = function() {
            $scope.offer.endDate = moment($scope.offer.endDateTemp).add("330", "minutes");
            $scope.offer.startDate = moment($scope.offer.startDateTemp).add("330", "minutes");
            console.log($scope.offer);
            api.save($scope.offer, $scope.offer.shopId).then(function(res) {
                console.log(res);
                $scope.offer = res.data;
                $scope.offer.startDateTemp = moment($scope.offer.startDate).toDate();
                $scope.offer.endDateTemp = moment($scope.offer.endDate).toDate();
                alert("Saved!")
            }, function (err) {
                console.log(err)
                alert("Some error occurred. Please check and try again");
            });
        };

        var searchTimeOut;

        // ############################################################
        // ###############           Functions          ###############
        // ############################################################

        // Get summary text for each group as a comma joined value of the names of its constituent items
        $scope.getSummaryText = function(preRequisites) {
            // var maxlength = 60;
            var itemlist = preRequisites.items.map(function(item) { return item.productName }).toString();
            // return (itemlist == '' ? "<No Items>" : (itemlist.length > maxlength ? itemlist.substring(0, maxlength) + '...' : itemlist));
            return (itemlist == '' ? "<No Items>" : itemlist);
        }

        // Set group quantity
        $scope.setQty = function(groupIndex) {
            $scope.groups[groupIndex].quantity = $scope.qty[groupIndex];
        }

        // Change current selected group index
        $scope.setGroup = function(group) {
            $scope.currGroup = group;
        }

        // Load group items onto the display list
        // $scope.loadGroupItems = function(groupIndex) {
        //     $scope.groupitems = ($scope.groups.length > 0 && groupIndex > -1 ? $scope.groups[groupIndex].items : [])
        // }

        $scope. getNextGroupId = function () {
            var start = $scope.offer.preRequisites.length;
            var groupId;
            while (true) {
                var found = false;
                groupId = $scope.actionType.data.ruleId + String.fromCharCode('a'.charCodeAt(0) + start);
                for (var i = $scope.offer.preRequisites.length - 1; i >= 0; --i) {
                    if ($scope.offer.preRequisites[i].groupId === groupId) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    break;
                } else {
                    start++;
                }
            }
            return groupId;
        };

// Create a new group
        $scope.createGroup = function() {
            var groupId = $scope.getNextGroupId();
            $scope.currGroup = {
                    "groupId": groupId,
                    "quantity": 1, //($scope.currGroupIndex == -1 ? $scope.gpqty : 1),
                    "items": [],
                    "gpOfferValue": null,
                    "gpOfferType": null
            };
            $scope.offer.preRequisites.push($scope.currGroup);

        };

        // Delete a group
        $scope.deleteGroup = function(group) {
            $scope.offer.preRequisites = $scope.offer.preRequisites.filter(function (t) { return t !== group });
        }

        // If the current selected group index is not -1, add the clicked item to the group
        $scope.addItem = function(item) {
            if(!$scope.offer.preRequisites || !$scope.offer.preRequisites.length){
                $scope.createGroup();
            } else if (!$scope.currGroup) {
                $scope.currGroup = $scope.offer.preRequisites[0];
            }
            if($scope.currGroup.items.indexOf(item) < 0){
                $scope.currGroup.items.push(item);
            }
        };

        // Delete an item from the current selected group
        $scope.deleteItem = function(itemIndex) {
            $scope.currGroup.items.splice(itemIndex, 1);
        }

        // Search the API for items
        $scope.fetchSearchItems = function() {
            if ($scope.searchterm != '') {
                if (searchTimeOut) $timeout.cancel(searchTimeOut);
                $scope.searchingInProgress = true;
                searchTimeOut = $timeout(function () {
                    api.search($scope.searchterm, $scope.offer.shopId).then(function (data) {
                        $scope.searchingInProgress = false;
                        $scope.searchRes = data;
                    });

                }, 1000); //The timer is to make sure that the search happens only after the user has stopped typing, as a new instance of the timeout cancels the previous one
            } else $scope.searchRes = [];
        }

        $scope.setParams = function() {
            $scope.invalidFetch = false;
            $scope.allowSet = false;
            // api.fetchOffer($scope.offer.shopId, $scope.actionType.data.ruleId).then(function (data) {
            //     console.log(data);
            //     $scope.allowSet = false;
            // }).catch(function (err) {
            //     console.log(err);
            //     $scope.invalidFetch = true;
            // })
        }
    }]);