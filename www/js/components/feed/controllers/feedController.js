/**
 * Created by Makhtar on 29/09/2015.
 */

angular.module('foodstagramApp').controller('feedCtrl', ['API_URL','$scope', 'Photos', 'localStorageService', '$http', '$q', '$rootScope', function (API_URL,$scope, Photos, localStorageService, $http, $q, $rootScope) {


    var url = API_URL;
    $scope.page = 1;

    if (!localStorageService.get('photos')) {
        localStorageService.set('photos', []);
    }

    /**
     * Returns the user id
     * @returns {*}
     */
    $scope.getUser = function () {
        var deferred = $q.defer();
        //It's a promise, when resolved we can proceed cuz we know we have a user in the scope
        if (!localStorageService.get('user')) {
            //IF no user, we create a new one
            $http.post(url + '/user/new', {}).then(
                function (response) {
                    $scope.id_user = response.data.id;
                    localStorageService.set('user', JSON.stringify(response));
                    deferred.resolve();
                }, function (error) {
                    console.log('error',error);
                }
            )
        } else {
            var user = localStorageService.get('user');
            user = JSON.parse(user);
            $scope.id_user = user.data.id;
            deferred.resolve();
        }
        return deferred.promise;
    }

    //This function loads the photos
    $scope.loadMore = function () {
        var promise = $scope.getUser();
        promise.then(function () {
            console.log('sucess', $scope.id_user);
            Photos.query({page: $scope.page, id_user: $scope.id_user}, function (data) {
                $rootScope.$broadcast('loading:show');
                //No photos at the beginning
                $scope.photos = [];
                if (data.length > 0) {

                    for (var i = 0; i < data.length; i++) {
                        $scope.photos.push(data[i]);
                    }
                    $scope.page++;

                    var photo = $scope.photos.shift();
                    $scope.photo = [photo];
                } else {
                    $('.load-more').text('No more data');
                }
                $rootScope.$broadcast('loading:hide');

            })
        })

    };
    $scope.loadMore();

    /**
     * This function loads the next photo
     */
    $scope.nextPhoto = function () {
        if (!localStorageService.get('photos')) {
            localStorageService.set('photos', []);
        }
        if ($scope.photos.length > 0) {
            console.log('nextphoto')
            var photo = $scope.photos.shift();
            $scope.photo = [photo];

        } else {
            $scope.loadMore();
        }
    }


    //Upvoting
    $scope.upvote = function (id_photo) {
        console.log('upvoted', id_photo)
        $http.post(url + '/photo/upvote', {
            'id_photo': id_photo,
            'id_user': $scope.id_user
        }).then(
            function (response) {
                //$scope.nextPhoto();
            }, function (error) {
                //On upvoting error, we hide the loading so the UI doesn't get stuck
                console.log('error upvote',error);
                $rootScope.$broadcast('loading:hide')

            }
        )

    }

    //Downovting
    $scope.downvote = function (id_photo) {
        console.log('downvoted', id_photo)
        $http.post(url + '/photo/downvote', {
            'id_photo': id_photo,
            'id_user': $scope.id_user
        }).then(
            function (response) {
                //$scope.nextPhoto();
            },function(error) {
                //On downvoting error, we hide the loading so the UI doesn't get stuck
                console.log('error downvote',error);
                $rootScope.$broadcast('loading:hide')
            }
        )

    }

    /**
     * On destroy (it means that the swipe hasn't been really understood,
     * we tried to load the next photo anyway
     * so the UI doesn't get stuck)
     */
    $scope.ondestroy = function () {
        console.log('ondestroy');
        $scope.nextPhoto();
    }


}]);
