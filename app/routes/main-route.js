// @ngInject
module.exports = ($stateProvider, $urlRouterProvider, $locationProvider, CONST) => {

    $urlRouterProvider.otherwise('/');
    $urlRouterProvider.when('/administration');
    const viewPath = 'views/';

    //use this for single pages
    $stateProvider
        .state('', {
            url: '/',
            controller: 'parent.controller',
            templateUrl: ''
        })
        .state('error', {
            url: '/404',
            template: `404 - Error`
        });

    //Use this if there will be multiple views in a page
    $stateProvider
        .state('', {
            url: '/',
            views: {
                '': {
                    controller: 'parent.controller',
                    templateUrl: ''
                }

            }
        })

    if(CONST.htmlMode){
        $locationProvider.htmlMode(true);
    }
};
