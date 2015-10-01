/**
 * Created by Makhtar on 29/09/2015.
 */


angular.module('foodstagramApp')
    .factory("Photos", function ($resource) {
        return $resource('http://localhost/foodstagram/web/app_dev.php/api/photos/:page', {page: '@page'});
    });