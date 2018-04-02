// @ngInject
module.exports = ($scope, $state, $stateParams, spService, email) => {
    console.log(new Date, 'in the app.administration ctrl');

    $scope.adminState = {
        $state
    };

};