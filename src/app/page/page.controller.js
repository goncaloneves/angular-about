'use strict';

angular.module('angularApp')
  .controller('PageCtrl', ['$scope', '$sanitize', 'data', function ($scope, $sanitize, data) {
    $scope.page.setTitle(data.title);
    $scope.page.title = data.title;
    $scope.page.content = $sanitize(data.content);

    if (data.featured_image) {
      $scope.page.featured = {
        alt: data.featured_image.title,
        height: data.featured_image.attachment_meta.height,
        src: data.featured_image.source,
        width: data.featured_image.attachment_meta.width
      };
    }
  }]);
