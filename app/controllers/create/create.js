'use strict';

angular.module('myApp.create', ['ngRoute', 'myApp.factory'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/create', {
            templateUrl: 'app/controllers/create/create.html',
            controller: 'Create1Ctrl'
        });
    }])

    .controller('Create1Ctrl', ['$scope', '$http', '$timeout', 'api', function ($scope, $http, $timeout, api) {

        /* To ask:
            >targetGroups
            >targetId
            >Upto or Exact
            >Normal or Normore
            >weekday offer
            >offer tier
            >offer app logic
            ?
        */
        // Todo: breadcrumb notifs
        // Load Options
        api.fetchOptions().then((data) => {
            // $scope.targetGroups = data.targetGroups;
            $scope.offerTypesOptions = data.offerTypesOptions;
            $scope.appliedOnOptions = data.appliedOnOptions;
            $scope.prereqTypeOptions = data.prereqTypeOptions;
            $scope.normTypeOptions = data.normTypeOptions;
            $scope.targetGroupOptions = data.targetGroupOptions;
        }).then(() => {
            // Initialize

            // From ten days later to a month from that
            $scope.startDate = new Date(Date.now());
            $scope.startDate.setDate($scope.startDate.getDate() + 10);

            $scope.endDate = new Date($scope.startDate);
            $scope.endDate.setMonth($scope.endDate.getMonth() + 1);

            $scope.selectedOfferType = $scope.offerTypesOptions[0];
            $scope.selectedAppliedOn = $scope.appliedOnOptions[0];
            $scope.selectedPrereqType = $scope.prereqTypeOptions[0];
            $scope.selectedNormType = $scope.normTypeOptions[0];
            
            // $scope.selectedTargetGroup = {};

            // $scope.targetID = data.targetIdCount.split(',')[0];
            // $scope.targetCount = parseInt(data.targetIdCount.split(',')[1]);

            // $scope.offerValue = data.offerValue;
            // $scope.activationCode = data.offerCode;
            // $scope.maxApplicationLimit = data.maxApplicationLimit;

            // $scope.groups = data.preRequisites;
            $scope.groups = [];

            $scope.ruleID = Math.random().toString(10).substring(11);
            // $scope.ruleID = '10517844464' + 1;
            $scope.currGroupIndex = -1;
            $scope.gpqty = ($scope.currGroupIndex == -1 ? 0 : parseInt($scope.groups[$scope.currGroupIndex].quantity));
            $scope.lastGpByLength = $scope.groups.length;
            $scope.summaryText = "";
            $scope.groupitems = [];
            $scope.searchterm = "";
            $scope.searchRes = []
            $scope.searchingInProgress = false;


        })

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
            // $scope.startDate = new Date(data.startDate);
            // $scope.endDate = new Date(data.endDate);
            var data = $scope.initialData;
            data.type = $scope.selectedOfferType;
            data.appliedOn = $scope.selectedAppliedOn;
            data.preRequisiteType = $scope.selectedPrereqType;
            // $scope.selectedNormType = {};
            // $scope.selectedTargetGroup = {};

            // $scope.targetID = data.targetIdCount.split(',')[0];
            // $scope.targetCount = parseInt(data.targetIdCount.split(',')[1]);

            data.offerValue = $scope.offerValue;
            data.offerCode = $scope.activationCode;
            data.maxApplicationLimit = $scope.maxApplicationLimit;
            data.preRequisites = $scope.groups;
            data.ruleID = $scope.ruleID;
            api.save(data).then((res) => {
                console.log(res);
            })
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

        $scope.setQty = () => {
            $scope.currGroupIndex != -1 && ($scope.groups[$scope.currGroupIndex].quantity = $scope.gpqty);
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
                "groupId": $scope.ruleID + String.fromCharCode('a'.charCodeAt() + $scope.lastGpByLength),
                "quantity": ($scope.currGroupIndex == -1 ? $scope.gpqty : 1),
                "items": [],
            });
            $scope.lastGpByLength = ($scope.lastGpByLength++ < $scope.groups.length ? $scope.groups.length : ($scope.groups.length == 0 ? 0 : $scope.lastGpByLength))
        }

        $scope.deleteGroup = (groupIndex) => {
            console.log(groupIndex)
            $scope.groups.splice(groupIndex, 1);
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