//My library of useful directives
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'custom';
}

((window, angular, undefined) => {

    // @ngInject
    angular.module('custom', [])
        .directive('imageonload', () => {
            return {
                restrict: 'A',
                link: (scope, element, attrs) => {
                    element.bind('error', () => {
                        element
                            .attr('src', attrs['noImage']);
                    });
                }
            };
        })
})(window, window.angular);