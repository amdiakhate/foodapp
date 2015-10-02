/**
 * Created by Makhtar on 29/09/2015.
 */

angular.module('foodstagramApp').controller('feedCtrl', ['$scope', 'Photos', 'localStorageService', '$http', '$ionicLoading', function ($scope, Photos, localStorageService, $http, $ionicLoading) {

  var url = "http://localhost:8082/foodstagram/web/app_dev.php/api";
  $scope.page = 1;
  //$scope.photo = null;

  if (!localStorageService.get('photos')) {
    localStorageService.set('photos', []);
  }

  //IF no user, we create a new one
  if (!localStorageService.get('user')) {
    $http.post(url + '/user/new', {}).then(
      function (response) {
        localStorageService.set('user', JSON.stringify(response));
      }
    )

  }

  //This function loads the photos
  $scope.loadMore = function () {

    Photos.query({page: $scope.page}, function (data) {
      //No photos at the beginning
      $scope.photos = [];
      if (data.length > 0) {

        for (var i = 0; i < data.length; i++) {
          $scope.photos.push(data[i]);
        }
        $scope.page++;

        var photo = $scope.photos.shift();
        ////Everytime we show a new photo, we add it to the localStorage
        if (checkPhoto(photo)) {
          $scope.photo = [photo];
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
    if (!localStorageService.get('photos')) {
      localStorageService.set('photos', []);
    }
    if ($scope.photos.length > 0) {
      console.log('nextphoto')
      var photo = $scope.photos.shift();
      if (checkPhoto(photo)) {
        $scope.photo = [photo];
      } else {
        $scope.nextPhoto();
      }
    } else {
      $scope.loadMore();
    }
  }

  function checkPhoto(photo) {
    var storage = localStorageService.get('photos') || [];
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

  //Upvoting
  $scope.upvote = function (id_photo) {
    console.log('upvoted', id_photo)
    $http.post(url + '/photo/upvote', {
      'id_photo': id_photo
    }).then(
      function (response) {
        $scope.nextPhoto();
      }
    )

  }

  //Downovting
  $scope.downvote = function (id_photo) {
    console.log('downvoted', id_photo)
    $http.post(url + '/photo/downvote', {
      'id_photo': id_photo
    }).then(
      function (response) {
        $scope.nextPhoto();
      }
    )

  }

}]);
