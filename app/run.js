import introJS from 'intro.js';
// @ngInject
export default ($rootScope) => {
	//enable only with ui router
    // $rootScope.$on('$stateChangeSuccess', (event, toState, toParams, fromState, fromParams) => {
    //     if ($rootScope.currentBackgroundTheme) {
    //         document.querySelector('body').classList.remove($rootScope.currentBackgroundTheme);
    //     }

    //     $rootScope.currentBackgroundTheme = toState.data.backgroundTheme;
    //     document.querySelector('body').classList.add($rootScope.currentBackgroundTheme);
    // });
    
    $rootScope.stopGuide = () => {
    	introJS().exit();
    };

    $rootScope.stopGuide = () => {
    	introJS().start();
    };
    
};