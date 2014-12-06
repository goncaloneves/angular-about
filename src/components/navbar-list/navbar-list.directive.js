'use strict';

(function() {

  /**
   * Module
   */
  var moduleName = 'directive.navbarList';
  var module;
  try {
    // Module exist, use it
    module = angular.module(moduleName);
  } catch(err) {
    // Module does not exist, create new one
    module = angular.module(moduleName, []);
  }

  /**
   *
   * Navbar List Directive
   *
   * This directive adds the list of navbar items for both desktop and mobile
   *
   */
  module.directive('navbarList', function() {
    return {
      restrict: 'AE',
      templateUrl: 'components/navbar-list/navbar-list.template.html'
    };
  });

})();
