// @ngInject
export default ($stateProvider, $urlRouterProvider, $locationProvider, CONST) => {

    $urlRouterProvider.otherwise('/form');
    $urlRouterProvider.when('/administration');
    const viewPath = 'views/';

    //use this for single pages
    $stateProvider
        .state('form', {
            url: '/form',
            controller: 'form.controller',
            template: 'test'
        })
        .state('error', {
            url: '/404',
            template: `404 - Error`
        });

    //Use this if there will be multiple views in a page
    // $stateProvider
    //     .state('', {
    //         url: '/',
    //         views: {
    //             '': {
    //                 controller: 'parent.controller',
    //                 templateUrl: ''
    //             }

    //         }
    //     })

    if(CONST.htmlMode){
        $locationProvider.htmlMode(true);
    }
};
