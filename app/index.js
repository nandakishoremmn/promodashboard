'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.create',
//   'myApp.edit',
//   'myApp.admin'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
// 
  $routeProvider.otherwise({redirectTo: '/create'});
}]);