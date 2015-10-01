/**
 * Created by Makhtar on 29/09/2015.
 */


angular.module('foodstagramApp')
    .directive('photoBlock', function ($http) {
        return {
            restrict: 'E',
            templateUrl: 'js/components/feed/views/photo_block.html',
            link: function (scope, element, attrs) {
                //Upvoting
                element.find('.like').bind('click', function () {
                    var url = "http://localhost/foodstagram/web/app_dev.php/api"
                    $http.post(url + '/photo/upvote', {
                        'id_photo': scope.photo.id_photo
                    }).then(
                        function (response) {
                            scope.nextPhoto();
                        }
                    )

                })
                //Downvoting
                element.find('.dislike').bind('click', function () {
                    var url = "http://localhost/foodstagram/web/app_dev.php/api"
                    $http.post(url + '/photo/downvote', {
                        'id_photo': scope.photo.id_photo
                    }).then(
                        function (response) {
                            scope.nextPhoto();
                        }
                    )

                })
            }
        }
    });
