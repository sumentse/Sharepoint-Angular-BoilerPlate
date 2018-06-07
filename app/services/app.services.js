if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.services';
}

((window, angular, undefined) => {
    // @ngInject

	require('angular-async-await');

    angular.module("app.services", ['angular-async-await'])
        .provider("spService", require("./spRest.service"))
        .provider("spFolder", require("./spFolder.service"))
        .provider("email", require("./email.service"))
        .factory("_", () => require("lodash"))
        .factory("naturalSort", () => require("javascript-natural-sort"))
})(window, window.angular);