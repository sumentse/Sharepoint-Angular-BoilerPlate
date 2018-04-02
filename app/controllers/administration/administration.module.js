if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'administration.module';
}

((window, angular, undefined) => {
    // @ngInject
    angular.module("administration.module", [])
        .controller("administration.controller", require("./components/administration.controller"))
        .controller("administration.settings.controller", require("./components/administration.settings.controller"))

})(window, window.angular);
