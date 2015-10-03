/**
 * Created by Makhtar on 29/09/2015.
 */


angular.module('foodstagramApp')
    .factory("Photos", function ($resource) {
        return $resource('http://foodstagram.lifeswift.fr/api/photos/:page/:id_user', {page: '@page',id_user:'@id_user'});
    });