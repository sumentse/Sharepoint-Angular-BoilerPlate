if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.directives';
}

((window, angular, undefined)=>{
    // @ngInject
    angular.module("app.directives", [
    		require("./custom.directive"),
			require("angular-ui-router")
            // require("angular-smart-table"),
            // require("angular-touch"),
            // require("ng-file-upload"),
            // require("angular-sanitize"),
			// require("angular-animate"),
			// require("./stTableCustom"),
			// require("angular-ui-bootstrap")
    	])
})(window, window.angular);
