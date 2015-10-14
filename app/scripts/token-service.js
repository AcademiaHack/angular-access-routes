'use strict';

angular
  .module('app')
  .factory('TokenService', function ($http, $window, $timeout) {
    return {
      authorize: function (accessLevel) {
        if (accessLevel === '*') {
          return true;
        }
        return (accessLevel === 'logged' && !!$window.sessionStorage.user);
      },
      login: function (user, success, error) {
        $window.sessionStorage.user = JSON.stringify(user);
        $window.sessionStorage.token = user.token;

        $timeout(function () {
          success($window.sessionStorage.user);
        }, 500);

      },
      user: function () {
        return JSON.parse($window.sessionStorage.user);
      },
      logout: function () {
        delete $window.sessionStorage.user;
        delete $window.sessionStorage.token;
      },
      isLogged: function () {
        return !!$window.sessionStorage.token;
      }
    };
  });
