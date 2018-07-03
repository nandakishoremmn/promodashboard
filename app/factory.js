angular.module('myApp.factory', [])
    .factory('api', ($http) => {
        return {
            fetchData: () => $http.get('https://nandu-dot-utils-dot-perpule-qa.appspot.com/offers/14/10517844464').then((resp) => (resp.status == 200 ? resp.data : [])),
            fetchOptions: () => $http.get('/static/data.json').then((resp) => (resp.status == 200 ? resp.data : [])),
            search: (qry) => $http.get('https://nandu-dot-utils-dot-perpule-qa.appspot.com/offers/14/products/search?q=' + qry).then((resp) => (resp.status == 200 ? resp.data : [])),
            save: (data) => {
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

                for(var key in data) finalData[key]=data[key];

                return $http.post('https://nandu-dot-utils-dot-perpule-qa.appspot.com/offers/14/', finalData).then((res) => res);

            },
            update: (data) => 'e'
        };
    });