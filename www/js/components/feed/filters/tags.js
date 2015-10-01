/**
 * Created by amdiakhate on 30/09/2015.
 */

angular.module('foodstagramApp')

    .filter('tagsFilter', function () {
        return function (items, search) {
            if (!search) {
                return items;
            }
            var result = [];
            angular.forEach(items, function (value, key) {
                angular.forEach(value.tags, function (value2, key2) {
                    if (value2 === search) {
                        result.push(value)
                    }
                })
            })
            console.log(result);
            return result;
        }
    })