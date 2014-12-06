'use strict';

(function() {

  /**
   * Module
   */
  var moduleName = 'directive.autohideNavbar';
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
   * Auto Hide Navbar Directive
   *
   * This directive works by adding a scroll event listener and comparing current and last scroll position
   * with a time interval in between and minimum delta distance, taken from navbar-list height. This sets auto
   * show/hide feature on element.
   *
   */
  module.directive('autohideNavbar', ['$document', '$window', '$timeout', function($document, $window, $timeout) {

    // requestAnimationFrame polyfill from http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    (function() {
      var lastTime = 0;
      var vendors = ['webkit', 'moz'];
      for(var x = 0; x < vendors.length && !$window.requestAnimationFrame; ++x) {
        $window.requestAnimationFrame = $window[vendors[x]+'RequestAnimationFrame'];
        $window.cancelAnimationFrame =
          $window[vendors[x]+'CancelAnimationFrame'] || $window[vendors[x]+'CancelRequestAnimationFrame'];
      }

      if (!$window.requestAnimationFrame) {
        $window.requestAnimationFrame = function(callback) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16 - (currTime - lastTime));
          var id = $window.setTimeout(function() { callback(currTime + timeToCall); },
            timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }

      if (!$window.cancelAnimationFrame) {
        $window.cancelAnimationFrame = function(id) {
          clearTimeout(id);
        };
      }
    }());

    return {
      restrict: 'AE',
      link: function(scope, element) {
        var autohideNavbar = {
          height: element[0].offsetHeight,
          document: {
            $: $document[0],
            height: 0
          },
          timeout: false,
          top: 0,
          window: {
            $: $window,
            height: 0,
            lastScroll: 0,
            scrollTop: 0,
            timeout: false
          }
        };

        // Get dimensions
        function getDimensions() {
          autohideNavbar.document.height = Math.max(autohideNavbar.document.$.documentElement.clientHeight, autohideNavbar.document.$.body.scrollHeight, autohideNavbar.document.$.documentElement.scrollHeight, autohideNavbar.document.$.body.offsetHeight, autohideNavbar.document.$.documentElement.offsetHeight);
          autohideNavbar.window.height = autohideNavbar.window.$.innerHeight;
          autohideNavbar.top = element[0].getBoundingClientRect().top + autohideNavbar.window.$.scrollY;
          scrollListener();
        }

        // Get dimensions on $viewContentLoaded
        scope.$on('$viewContentLoaded', function(){
          $timeout(function(){
            getDimensions();
          }, 0);
        });

        // Get dimensions $routeChangeError
        scope.$on('$routeChangeError', function(){
          $timeout(function(){
            getDimensions();
          }, 0);
        });

        // Resize event listener to get window and document dimensions
        angular.element(autohideNavbar.window.$).on('resize', function(){
          angular.element(autohideNavbar.window.$).off('scroll');

          $timeout.cancel(autohideNavbar.window.timeout);
          autohideNavbar.window.timeout = $timeout(function(){
            if (element.hasClass('fixed')) {
              element.removeClass('transition fixed').css({'margin-top': ''});
            }
            getDimensions();
          }, 200);
        });

        // Manage class animations
        function runAnimation(addMargin) {
          // Add or remove margin-top while transition class is set to run animation
          $window.requestAnimationFrame(function() {
            var marginTop;
            if (addMargin) {
              marginTop = -autohideNavbar.height + 'px';
            } else {
              marginTop = '';
            }
            element.css({'margin-top': marginTop});
          });
        }

        // Scroll listener that handles the animation by adding and removing margin-top
        function scrollListener() {
          angular.element(autohideNavbar.window.$).on('scroll', function() {

            // Check if there is scrolling before continuing
            if (autohideNavbar.document.height <= autohideNavbar.window.height) {
              return;
            }

            // Save current scroll position
            autohideNavbar.window.scrollTop = autohideNavbar.window.$.scrollY;

            // Add and remove transition and fixed classes from Navbar
            if (autohideNavbar.window.scrollTop >= autohideNavbar.top) {
              if (!element.hasClass('fixed')) {
                element.addClass('fixed transition');
              }
            } else {
              if (element.hasClass('fixed')) {
                element.removeClass('transition fixed').css({'margin-top': ''});
                return;
              }
            }

            // Check if timeout is false before continuing to timeout
            if (autohideNavbar.timeout) {
              return;
            }

            // Set timeout and go through animation conditions
            autohideNavbar.timeout = $timeout(function(){
              // Calculate scroll distance between current and last positions and run animation or return
              if (Math.abs(autohideNavbar.window.lastScroll - autohideNavbar.window.scrollTop) <= autohideNavbar.height / 2) {
                return;
              }
              // Add margin-top if scrolling down
              if (autohideNavbar.window.scrollTop > autohideNavbar.window.lastScroll && autohideNavbar.window.scrollTop >= autohideNavbar.top + autohideNavbar.height) {
                if (element.hasClass('fixed') && element.css('margin-top') === '') {
                  runAnimation(true);
                }
              }
              // Remove margin-top if scrolling up
              else {
                if (element.hasClass('fixed') && element.css('margin-top') === -autohideNavbar.height + 'px') {
                  runAnimation(false);
                }
              }

              // Save last scroll position with $timeout
              autohideNavbar.window.lastScroll = autohideNavbar.window.$.scrollY;

            }, 50).then(function(){
              // Set false when promise and animation is finished
              $window.requestAnimationFrame(function() {
                autohideNavbar.timeout = false;
              });
            });

          });
        }
      }
    };

  }]);

})();
