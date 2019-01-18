import introJS from 'intro.js';
// @ngInject
export default ($rootScope, $transitions) => {
    const webPageConfiguration = {
        pageName: ''
    };

    $transitions.onBefore({}, async(trans)=>{
        const permissionedPages = [];
        //permissioned pages
        if( permissionedPages.includes(trans.to().name) ){
            const permissions = await spService.getPermissionLevels(CONST.rootFolder, ``);
            
            if(permissions.length === 0){
                await new Promise((resolve)=>{
                    modal.displayWarning('You do not have access to this page.', ()=>resolve());
                });
                return trans.router.stateService.target('form');
            }
        }
    });

    angular.merge($rootScope, webPageConfiguration);
    
    $rootScope.stopGuide = () => {
    	introJS().exit();
    };

    $rootScope.stopGuide = () => {
    	introJS().start();
    };
    
};