/**
 * Created by Makhtar on 29/09/2015.
 */

angular.module('foodstagramApp').controller('feedCtrl', ['$scope', 'Photos', 'localStorageService', function ($scope, Photos, localStorageService) {

    $scope.loading = true;
    $scope.searchText = '';
    $scope.page = 1;
    //No photos at the beginning
    $scope.photos = [];
    $scope.photo = null;

    if (!localStorageService.get('photos')){
        localStorageService.set('photos', []);
    }

    //This function loads the photos
    $scope.loadMore = function () {
        Photos.query({page: $scope.page}, function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    $scope.photos.push(data[i]);
                }
                $scope.loading = false;
                $scope.page++;

                var photo = $scope.photos.shift();
                //Everytime we show a new photo, we add it to the localStorage
                if (checkPhoto(photo)) {
                    $scope.photo = photo;
                } else {
                    $scope.nextPhoto();
                }
            } else {
                $('.load-more').text('No more data');
            }

        })
    };
    $scope.loadMore();

    /**
     * This function loads the next photo
     */
    $scope.nextPhoto = function () {
        if ($scope.photos.length > 0) {
            var photo = $scope.photos.shift();
            if (checkPhoto(photo)) {
                $scope.photo = photo;
            } else {
                $scope.nextPhoto();
            }
        } else {
            $scope.loadMore();
        }
    }

    //Search by clicking on tags
    $scope.updateSearch = function (tag) {
        $scope.searchText = tag;
    }

    function checkPhoto(photo) {
        var storage = localStorageService.get('photos');
        var id_photo = photo.id_photo;
        if (storage.length == 0) {
            var storedPhotos = [id_photo];
            localStorageService.set('photos', JSON.stringify(storedPhotos));
        } else {
            var storedPhotos = JSON.parse(storage);
            if (storedPhotos.indexOf(id_photo) == -1) {
                //We don't find the photo, we show it
                storedPhotos.push(id_photo);
                localStorageService.set('photos', JSON.stringify(storedPhotos));
                return true;
            } else {
                //We find it, we should pass to the next photo
                return false;
            }
        }
        return true;

    }

}]);