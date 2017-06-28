// @ngInject
module.exports = function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/");
    var viewPath = "views/";

    $stateProvider
        .state("", {
            url: "/",
            controller: "",
            templateUrl: ""
        })

    $stateProvider
        .state("", {
            url: "/",
            views: {
                "": {
                    templateUrl: "",
                    controller: ""
                }

            }
        })
};
