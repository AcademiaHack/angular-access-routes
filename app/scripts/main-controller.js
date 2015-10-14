/**
 * Created by abraham on 14/10/15.
 */
angular
  .module('app')
  .controller('MainController', function ($scope, TokenService) {

    $scope.exit = function () {
      TokenService.logout();
    };

    $scope.isLogged = function () {
      return TokenService.isLogged();
    };
  });
