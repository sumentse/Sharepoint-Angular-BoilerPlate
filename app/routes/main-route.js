// @ngInject
module.exports = ($stateProvider, $urlRouterProvider, $locationProvider, CONST) => {

    $urlRouterProvider.otherwise("/");
    const viewPath = "views/";

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

    if(CONST.htmlMode){
        $locationProvider.htmlMode(true);
    }
};
