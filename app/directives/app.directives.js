if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.directives';
}

((window, angular, undefined)=>{
    // @ngInject

    require("angular-timeago");

    angular.module("app.directives", [
    		require("./custom.directive"),
			require("angular-ui-router"),
            require("ng-file-upload"),
            require("checklist-model"),
            'yaru22.angular-timeago',
            require("angular-smart-table"),
            require("angular-touch"),
            require("angular-sanitize"),
			require("angular-animate"),
			require("./stTableCustom"),
			require("angular-ui-bootstrap")
    	])
})(window, window.angular);
