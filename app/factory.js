angular.module('myApp.factory', [])
    .factory('api', function($http) {
        // const API_ROUTE = 'http://localhost:8080/offers/';
        const API_ROUTE = 'https://utils-dot-perpule-1248.appspot.com/offers/';
        var hdr = {
            headers: {'Authorization': 'Bearer VyEaWG6MAB1Kmz8PPFqNZb6aiXgL3lovZQkPeq8O'}
        };

        return {
            listOffers: function (shopID, arg1, arg2) {
                return $http.get(API_ROUTE + shopID + (args.length > 0 ? '?' + ['limit=' + arg1, 'offset=' + arg2].join('&') : ''), hdr)
                    .then(function (resp) {
                        return (resp.status == 200 ? resp.data : [] );
                    })
            },

            // fetchOffer: (shopID, ruleID) => $http.get(API_ROUTE + shopID + '/' + ruleID).then((resp) => (resp.status == 200 ? resp.data : [])),
            fetchOffer: function(shopID, ruleID) { return $http.get(API_ROUTE + shopID + '/' + ruleID, hdr) },

            fetchOptions: function () {
                return $http.get('/static/options.json')
                .then(function (resp) {
                    return (resp.status == 200 ? resp.data : []);
                })
            },

            search: function (qry, shopID) {
                return $http.get(API_ROUTE + shopID + '/products/search?q=' + qry, hdr)
                    .then(function (resp) {
                        return (resp.status == 200 ? resp.data : []);
                    })
            },
            save: function(data, shopID) {
                finalData = {
                    "activeDays": "1111111",
                    "additionalField1": null,
                    "additionalField2": null,
                    "additionalField3": null,
                    "additionalField4": null,
                    "billBuster": 0,
                    "discountType": "USUAL",
                    "forcedPriority": 1,
                    "groupQualifierId": "USUAL",
                    "hypGrpOfferFlag": 0,
                    "intraTierLogic": "BESTBUY",
                    "inversePriority": null,
                    "lineSpecFlag": 0,
                    "mix": "allSources",
                    "promoPerUnit": 0,
                    "ruleIdToTrigger": null,
                    "secondaryOffer": 0,
                    "shopId": 14,
                    "targetIdCount": "1,1",
                    "tierDescription": "Default",
                    "tierId": 1,
                    "validatedFlag": 1,
                    "vatExtra": 0,
                    "happyHour": 0,

                    "quantityMax": null,
                    "quantity": 2,
                    "allowGroupPartialReturn": 1,

                    "startDate": "Thu, 14 Dec 2017 00:00:00 GMT",
                    "endDate": "Mon, 31 Dec 2018 23:59:59 GMT",

                    // "ruleId": "10517844464",
                    // "type": "%off",
                    // "appliedOn": "All",
                    // "preRequisiteType": "N",
                    // "offerValue": 50,
                    // "activationCode": "BuyNofXatZ%off",
                    // "maxApplicationLimit": 9999,
                    // "preRequisites": [],
                }

                for (var key in data) finalData[key] = data[key];

                return $http.post(API_ROUTE + shopID + '/', finalData, hdr).then(function(res) { return res; });

            },
            update: function(data, shopID, ruleId) { return 'e' }
        };
    });