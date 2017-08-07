if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.controllers';
}

((window, angular, undefined) => {
    // @ngInject
    angular.module("app.controllers", [])
        .controller("example.controller", require("./example.controller"))

})(window, window.angular);
