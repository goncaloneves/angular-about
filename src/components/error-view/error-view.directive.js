'use strict';

(function() {

  /**
   * Module
   */
  var moduleName = 'directive.errorView';
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
   * Error View Directive
   *
   * This directive listen for $routeChangeError event and shows error template
   * It adds Prerender 404 status metatag
   * See https://prerender.io/getting-started#404s
   *
   */
  module.directive('errorView', ['$compile', '$document', function($compile, $document) {
    return {
      restrict: 'AE',
      link: function(scope, element) {

        var ngView;

        // Template content that is going to be appended on element
        var errorTemplate = '<div class="title"><h1 class="text-uppercase">404: Page not found</h1></div>';
        errorTemplate += '<div class="content"><div class="text"><p>This seems <strong>not</strong> to be the page you are looking for.</p><p>Better luck next time !</p></div></div>';
        errorTemplate = angular.element(errorTemplate);

        // Compile errorTemplate to a template function and link to scope
        var errorContent = $compile(errorTemplate)(scope);

        // Head element and Prerender metatag 404 status
        var headElement = angular.element($document[0].getElementsByTagName('head'));
        var metaTagError = '<meta name="prerender-status-code" content="404">';

        /*
         When route is not resolved, remove ngView if exists and append error content to element
         After appending errorContent emit errorViewLoaded to parents listening
          */
        scope.$on('$routeChangeError', function() {
          if (ngView) {
            ngView.children().remove();
          }
          if (element.children().length === 0) {
            headElement.append(metaTagError);
            element.append(errorContent);
          }
          scope.$emit('errorViewLoaded');
        });

        /*
        When route is resolved, remove errorView children
        Cache ngView element for later use
         */
        scope.$on('$routeChangeSuccess', function() {
          if (element.children().length > 0) {
            angular.element($document[0].getElementsByName('prerender-status-code')[0]).remove();
            element.children().remove();
          }
          ngView = angular.element($document[0].querySelector('[ng-view]'));
        });
      }
    };
  }]);

})();
