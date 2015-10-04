/**
 * Created by Makhtar on 29/09/2015.
 */


angular.module('foodstagramApp')
    .factory("Photos", function ($resource,API_URL) {
        return $resource(API_URL + '/photos/:page/:id_user', {page: '@page',id_user:'@id_user'});
    });