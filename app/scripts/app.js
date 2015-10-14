/**
 * Created by abraham on 14/10/15.
 */


angular.module('app', [
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push(['$q', '$window', function($q, $window, $rootScope) {
      return {
        request: function(config) {
          config.headers = config.headers || {};
          if ($window.sessionStorage.token) {
            config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
          }
          return config;
        },

        response: function(response) {
          return response || $q.when(response);
        },

        responseError: function(rejection){

          if(rejection.status === 401){
            $rootScope.$broadcast('$notAuthorized');
          }
          return $q.reject(rejection);
        }
      };
    }]);

    $stateProvider
      .state('anon', {
        abstract: true,
        template: '<div ui-view/>',
        data: {
          access: '*'
        }
      })
      .state('anon.main', {
        url: '/main',
        templateUrl: 'views/anon.html',
        controller: 'AnonController'
      });

    $stateProvider
      .state('user', {
        abstract: true,
        template: '<div ui-view/>',
        data: {
          access: 'logged'
        }
      })
      .state('user.logged',{
        url: '/logged',
        templateUrl: 'views/logged.html',
        controller: 'LoggedController'
      });

    $urlRouterProvider.otherwise('/logged', 'views/logged.html');

  })
  .run(function ($rootScope, $state, TokenService, $urlRouter) {

    if (!TokenService.isLogged()) {
      $state.go('anon.main');
    }

    $rootScope.$on('$notAuthorized', function () {
      $state.go('anon.main');
    });

    $rootScope.$on('$locationChangeSuccess', function(evt) {
      // Halt state change from even starting
      // TODO https://github.com/angular-ui/ui-router/wiki/Quick-Reference#urlroutersync
      evt.preventDefault();
      console.log("switched");
      // Perform custom logic
      $urlRouter.sync();
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){

      if (!('data' in toState) || !('access' in toState.data)) {
        event.preventDefault();
        $rootScope.error = 'Access undefined for this state';
      }

      if (!TokenService.authorize(toState.data.access)) {
        event.preventDefault();

        if(fromState.url === '^') {
          if(TokenService.isLogged())
            $state.go('user.logged');
          else {
            $state.go('anon.main');
          }
        }
      }
    });
  });

