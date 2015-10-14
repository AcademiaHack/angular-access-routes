/**
 * Created by abraham on 14/10/15.
 */
angular
  .module('app')
  .controller('LoggedController', function ($scope, TokenService) {

    $scope.user = TokenService.user();

  });
