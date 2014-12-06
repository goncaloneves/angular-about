'use strict';

// WordPress REST API URL
var wpUrl = 'http://www.goncaloneves.com/rest/wp-json/';

// App Bootstrap and Dependencies
var app = angular.module('angularApp', ['ngRoute', 'ngSanitize', 'ngTouch', 'directive.autohideNavbar', 'directive.errorView', 'directive.navbarList']);

// WordPress REST API $http Service
app.factory('restAPI', ['$http', '$location', '$q', function($http, $location, $q) {
  function getData(type, slug) {
    var request = '';

    if (type === 'all' || !type) {
      request += '?type[]=post&type[]=page';
    } else {
      request += '?type=' + type;
      if (slug) {
        if (type === 'page') {
          request += '&filter[pagename]=' + slug;
        } else {
          request += '&filter[name]=' + slug;
        }
      }
    }

    // On dev environment set cache to false
    return $http.get(wpUrl + 'posts' + request, {cache: true})
      .then(function(response) {
        if (response.data.length === 0) {
          return $q.reject(response);
        }
        return response.data[0];
      }, function(response) {
        return response.data || 'Request failed.';
      });
  }

  return {
    getData: getData
  };

}]);

// Config Routes
app.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
    .when('/', {
      controller: 'PageCtrl',
      resolve: {
        data: ['restAPI', function(restAPI) {
          return restAPI.getData('page', 'home');
        }]
      },
      templateUrl: 'app/page/page.template.html'
    })
    .when('/home', {
      redirectTo: '/'
    })
    .when('/:pageName', {
      controller: 'PageCtrl',
      error: false,
      resolve: {
        data: ['$route', 'restAPI', function($route, restAPI) {
          return restAPI.getData('page', $route.current.params.pageName);
        }]
      },
      templateUrl: 'app/page/page.template.html'
    }).
    otherwise({
      redirectTo: '/'
    });
  $locationProvider.html5Mode(true).hashPrefix('!');
}]);

// Set Title, variables and control View static renderization
app.run(['$rootScope', '$timeout', '$window', function($rootScope, $timeout, $window) {
  $rootScope.page = {
    menuMobile: false,
    setTitle: function(title) {
      $rootScope.title = title + ' | Gonçalo Neves';
    },
    rendered: false
  };

  // Set Menu Mobile false on resize above small devices width
  var resizeTimeout;
  angular.element($window).on('resize', function() {
    $timeout.cancel(resizeTimeout);
    resizeTimeout = $timeout(function() {
      if ($window.innerWidth >= 768) {
        $rootScope.page.menuMobile = false;
      }
    }, 200);
  });

  // View is loaded for the first time and show static content, after that de-register event
  var pageRendered = $rootScope.$on('$viewContentLoaded', function() {
    $rootScope.page.rendered = true;
    pageRendered();
  });

  // Error view is loaded, set title and and show static content
  $rootScope.$on('errorViewLoaded', function() {
    $rootScope.page.setTitle('Page not found');
    if (!$rootScope.page.rendered) {
      $rootScope.page.rendered = true;
    }
  });
}]);
