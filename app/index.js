'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.factory',
  'myApp.offer',
  'myApp.list',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
// 
  $routeProvider.otherwise({redirectTo: '/offer/create'});
}]);
