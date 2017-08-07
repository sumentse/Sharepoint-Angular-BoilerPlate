if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.services';
}

((window, angular, undefined) => {
    // @ngInject
    angular.module("app.services", [])
		.provider("spService", require("./spRest.service"))
		.provider("spFolder", require("./spFolder.service"))
		.provider("email", require("./email.service"))
		.factory("_", function(){
			return require("lodash");
		})
})(window, window.angular);

