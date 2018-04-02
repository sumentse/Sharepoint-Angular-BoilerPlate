if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.controllers';
}

((window, angular, undefined) => {
    // @ngInject
    angular.module("app.controllers", [
    		require("./administration/administration.module")
    	])
        .controller("parent.controller", require("./parent.controller"))

})(window, window.angular);
