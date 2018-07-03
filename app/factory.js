angular.module('myApp.factory', [])
    .factory('api', ($http) => {
        return {
            fetch: (qry) => $http.get('https://nandu-dot-utils-dot-perpule-qa.appspot.com/offers/14/products/search?q=' + qry).then((resp) => (resp.status == 200 ? resp.data : [])),
            search: (qry) => $http.get('https://nandu-dot-utils-dot-perpule-qa.appspot.com/offers/14/products/search?q=' + qry).then((resp) => (resp.status == 200 ? resp.data : [])),
            save: (data) => 'e'
        };
    });