/**
 * AngularJS Directive - resrc.angular.js v1.1
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

      var templateInnerStr = '<img alt="{{ alt }}" data-dpi="{{ dpi }}" data-server="{{ server }}" ng-src="{{ placeholder }}" data-src="{{ src }}" class="resrc">';
      var templateStr = '<div class="resrc-wrap">' + templateInnerStr + '</div>';

      return {
        template: templateStr,
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
            if ('resrc' in window) {
              resrc.resrc(element[0].children[0]);
            }

          };

          scope.createResponsiveImg = function(src) {

            src = src || scope.src;

            if (!src) {
              return;
            }

            element[0].className = element[0].className.replace('resrc-wrap--loaded', '');
            element[0].children[0].remove();

            // create new img programatically
            var $newImg = document.createElement('img');
            $newImg.className = 'resrc';
            $newImg.setAttribute('data-src', src);

            if (scope.dpi) {
              $newImg.setAttribute('data-dpi', scope.dpi);
            }
            if (scope.server) {
              $newImg.setAttribute('data-server', scope.server);
            }
            if (scope.alt) {
              $newImg.setAttribute('alt', scope.alt);
            }

            // remove src, this will get populated by resrcit lib
            $newImg.removeAttribute('src');

            // append to wrapper
            element[0].appendChild($newImg);

            scope.bindImgLoadCallback();

            scope.init();
          }

          scope.listenToSrcChange = function() {
            attrs.$observe('src', scope.createResponsiveImg);
          };

          scope.bindImgLoadCallback = function() {
            // on image load, apply loaded class and exec callback
            angular.element(element[0].children[0]).bind('load', function() {
              element.addClass('resrc-wrap--loaded');

              // configurable callback
              scope.onImageLoad.apply(this, arguments);
            });
          };

          scope.bindImgLoadCallback();


          // if dependencies have already loaded, init straight away
          if ('resrc' in window) {
            scope.createResponsiveImg();
            scope.listenToSrcChange();
          }



        },
        controller: function($scope, $rootScope, responsiveImage) {

          // when external lib has loaded, init this component
          $rootScope.$on('resrc:loaded', function() {
            $scope.createResponsiveImg();
            $scope.listenToSrcChange();
          });

          // configure deps
          responsiveImage.init();
        }
      };
  });

})();
