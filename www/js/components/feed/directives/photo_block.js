/**
 * Created by Makhtar on 29/09/2015.
 */


angular.module('foodstagramApp')
    .directive('photoBlock', function () {
        return {
            restrict: 'E',
            templateUrl: 'js/components/feed/views/photo_block.html'
        }
    });
