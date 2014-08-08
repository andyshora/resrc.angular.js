/**
 * AngularJS Directive - resrc.angular.js v1.0
 * Copyright (c) 2014 Andy Shora, andyshora@gmail.com, andyshora.com
 * Licensed under the MPL License
 */
(function() {

  'use strict';

  angular.module('ReSRC.directives', []);
  angular.module('ReSRC.provider', []);
  angular.module('ReSRC', ['ReSRC.directives', 'ReSRC.provider']);

  // provider loads the global config and external dependencies
  angular.module('ReSRC.provider', [])
    .provider('responsiveImage', function() {

      var startedLoadingScript = false;

      this.config = {
        resrcOnResize: true, // Resize images on browser resize and device rotation.
        resrcOnResizeDown: false, // Resize images when scaled down in size.
        resrcOnPinch: false, // Resize images when gesture pinched. (currently only supported on iOS mobile devices)
        imageQuality: 85, // If no optimization parameter is found a default value is added.
        pixelRounding: 10, // Resize images by rounding to the nearest number of pixels.
        server: 'app.resrc.it', // ReSRC server address.
        ssl: false, // Generates https:// requests.
        resrcClass: 'resrc', // The class name that identifies which elements to ReSRC.
        trial: false // Running in trial mode
      };

      // throw setup error
      this.error = function(str) {
        if ('error' in console) {
          console.error('ResponsiveImage setup error:', str);

        } else if ('log' in console) {
          console.log('ResponsiveImage setup error:', str);
        }
      };

      var self = this;

      function loadAsync(callback) {

        var d = false;
        var r = document.createElement('script');

        var protocol = (/file/.test(window.location.protocol)) ? 'http' : '';
        r.src = protocol + '//use.resrc.it/0.7';
        r.type = 'text/javascript';
        r.async = 'true';

        r.onload = r.onreadystatechange = function () {
          var rs = this.readyState;
          if (d || rs && rs != 'complete' && rs != 'loaded') return;
          d = true;
          try {

            resrc.ready(callback);
          } catch (e) {}
        };
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(r, s);

      }

      // initialise directive with global options. this should be called from app config
      this.init = function(newConfig) {

        // extend config with overrides
        this.config = angular.extend(this.config, newConfig);

        // if in trial mode, ensure trial url is set
        if (this.config.trial) {
          this.config.server = 'trial.resrc.it';
        }
      };

      this.$get = function($injector) {

        var config = this.config;
        var rScope = $injector.get('$rootScope');

        return {
          getConfigItem: function(key) {
            return config[key];
          },
          init: function() {

            // if external deps have already started loading, return
            if (startedLoadingScript) {
              return;
            }
            startedLoadingScript = true;

            // load deps
            loadAsync(function() {

              // Merge the contents of defaults into resrc.options
              resrc.options = resrc.extend(resrc.options, config);

              // let all the components know that the external dependencies have loaded
              rScope.$broadcast('resrc:loaded');
            });
          }

        };
      };
  });
  
  angular.module('ReSRC.directives', [])
    .directive('resrcit', function() {
      return {
        template: '<div class="resrc-wrap"><img alt="{{ alt }}" data-dpi="{{ dpi }}" data-server="{{ server }}" ng-src="{{ placeholder }}" data-src="{{ src }}" class="resrc"></div>',
        replace: true,
        scope: {
          src: '@',
          dpi: '@',
          server: '@',
          alt: '@',
          placeholder: '@',
          onImageLoad: '&'
        },
        restrict: 'AEC',
        link: function (scope, element, attrs) {

          scope.init = function() {
            // make this component responsive via resrc.it lib
            resrc.resrc(element[0].children[0]);
          };

          // if dependencies have already loaded, init straight away
          if ('resrc' in window) {
            scope.init();
          }

          // on image load, apply loaded class and exec callback
          angular.element(element[0].children[0]).bind('load', function() {
            element.addClass('resrc-wrap--loaded');

            // configurable callback
            scope.onImageLoad.apply(this, arguments);
          });

        },
        controller: function($scope, $rootScope, responsiveImage) {

          // when external lib has loaded, init this component
          $rootScope.$on('resrc:loaded', function() {
            $scope.init();
          });

          // if src changes, reinitialise component
          $scope.$watch('src', $scope.init);

          // configure deps
          responsiveImage.init();
        }
      };
  });

})();
