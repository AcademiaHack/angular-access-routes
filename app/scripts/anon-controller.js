/**
 * Created by abraham on 14/10/15.
 */
angular
  .module('app')
  .controller('AnonController', function ($scope, TokenService, $state) {

    $scope.users = [
      { user: 'Basilio', token: 123},
      { user: 'Abraham', token: 345}
    ];

    $scope.access = function (user) {
      TokenService.login(user, function () {
        $state.go('user.logged');
      });
    }

  });
