if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'app.filters';
}

((window, angular, undefined)=>{
    // @ngInject
    angular.module("app.filters", [
    		require("./useful.filter")
    	])
    
})(window, window.angular);
