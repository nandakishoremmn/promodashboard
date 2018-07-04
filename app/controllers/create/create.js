'use strict';

angular.module('myApp.create', ['ngRoute', 'myApp.factory'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: 'app/controllers/create/create.html',
            controller: 'Create1Ctrl'
        });
    }])

    .controller('Create1Ctrl', ['$scope', '$http', '$timeout', 'api', function ($scope, $http, $timeout, api) {

        // Todo: breadcrumb notifs
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


            $scope.groups = [];
            $scope.qty = [];

            $scope.ruleID = Math.random().toString(10).substring(11);
            $scope.currGroupIndex = -1;
            // $scope.gpqty = ($scope.currGroupIndex == -1 ? 1 : parseInt($scope.groups[$scope.currGroupIndex].quantity));
            $scope.lastGpByLength = $scope.groups.length;
            $scope.summaryText = "";
            $scope.groupitems = [];
            $scope.searchterm = "";
            $scope.searchRes = []
            $scope.searchingInProgress = false;

        }).then(() => {
            // Watchers
            $scope.$watchCollection('[startDate, endDate]', () => {
                $scope.happyHours = $scope.startDate.getHours() + ':' + $scope.startDate.getMinutes() +
                    '-' + $scope.endDate.getHours() + ':' + $scope.endDate.getMinutes();
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
            'ruleID',
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
        //     // $scope.ruleID = '10517844464' + 1;
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
                var newParam = ($scope.paramMapping.hasOwnProperty(param) ? $scope.paramMapping[param] : param );
                // $scope.paramMapping.hasOwnProperty(param) && (newParam = $scope.paramMapping[param]);
                finalData[newParam] = ($scope.$eval(param).hasOwnProperty('value')?$scope.$eval(param)['value']:$scope.$eval(param));
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
            api.save(finalData).then((res) => {
                console.log(res);
            });
        }

        var searchTimeOut;

        // ############################################################
        // ###############           Functions          ###############
        // ############################################################

        $scope.getSummaryText = group => {
            // var maxlength = 60;
            var itemlist = group.items.map(item => item.productName).toString();
            // return (itemlist == '' ? "<No Items>" : (itemlist.length > maxlength ? itemlist.substring(0, maxlength) + '...' : itemlist));
            return (itemlist == '' ? "<No Items>" : itemlist);
        }

        $scope.setQty = (groupIndex) => {
            $scope.groups[groupIndex].quantity = $scope.qty[groupIndex];
        }

        $scope.setGroup = groupIndex => {
            $scope.currGroupIndex = groupIndex;
            $scope.loadGroupItems(groupIndex);
            // $scope.gpqty = parseInt($scope.groups[$scope.currGroupIndex].quantity);
            $scope.gpOfferQty = parseInt($scope.groups[$scope.currGroupIndex].gpOfferQty);
            $scope.gpOfferType = $scope.groups[$scope.currGroupIndex].gpOfferType;
        }

        $scope.loadGroupItems = groupIndex => {
            $scope.groupitems = ($scope.groups.length > 0 && groupIndex > -1 ? $scope.groups[groupIndex].items : [])
        }

        $scope.createGroup = () => {
            $scope.groups.push({
                "groupId": $scope.ruleID + String.fromCharCode('a'.charCodeAt() + $scope.lastGpByLength),
                "quantity": 1, //($scope.currGroupIndex == -1 ? $scope.gpqty : 1),
                "items": [],
                "gpOfferQty": ($scope.currGroupIndex == -1 ? $scope.gpOfferQty : 1),
                "gpOfferType": ($scope.currGroupIndex == -1 ? $scope.gpOfferType : $scope.offerTypesOptions[0]),
            });
            $scope.qty.push(1);
            $scope.lastGpByLength = ($scope.lastGpByLength++ < $scope.groups.length ? $scope.groups.length : ($scope.groups.length == 0 ? 0 : $scope.lastGpByLength))
        }

        $scope.deleteGroup = (groupIndex) => {
            // console.log(groupIndex)
            $scope.groups.splice(groupIndex, 1);
            $scope.qty.splice(groupIndex, 1);
            $scope.loadGroupItems(--$scope.currGroupIndex);
        }

        $scope.addItem = itemIndex => {
            $scope.currGroupIndex != -1 && $scope.groups[$scope.currGroupIndex].items.push($scope.searchRes[itemIndex]);
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