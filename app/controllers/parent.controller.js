// @ngInject
module.exports = ($scope, spService, email, _, $async) => {
    $scope.message = `Works`;

    $scope.pageState = {
        totalCount: 0,
        data: [],
        pageInformation: '0-0',
        pages: []
    };

    // let query = new spService.camlQuery('/', { listName: '', pageSize: 10 });
    // query.setXML(
    //     `
    //     <Query>
    //         <ViewFields>
    //             <FieldRef Name='ID'/>
    //             <FieldRef Name='Title' JSON='false'/>
    //         </ViewFields>
    //         <OrderBy>
    //             <FieldRef Name="Title" Ascending='true' />
    //         </OrderBy>
    //     </Query>
    // `);

    $scope.startPager = $async(async() => {

        let { items, pageInformation } = await query.GetListItems(0);
        let { total, pages } = await query.getPaginationCount();

        angular.extend($scope.pageState, {
            totalCount: total,
            pageInformation,
            data: items,
            pages
        });

    });

    $scope.goTo = $async(async(pos) => {
        let { items, pageInformation } = await query.GetListItems(pos);

        if (items.length !== 0) {
            angular.extend($scope.pageState, {
                pageInformation,
                data: items
            });

        }


    });

    $scope.next = $async(async() => {

        try {
            let { items, pageInformation } = await query.next();

            angular.extend($scope.pageState, {
                pageInformation,
                data: items
            });

            $scope.$apply();

        } catch (err) {

        }

    });

    $scope.back = $async( async() => {

        try {
            let { items, pageInformation } = await query.back();


            angular.extend($scope.pageState, {
                pageInformation,
                data: items
            });

            $scope.$apply();
        } catch (err) {

        }

    });

    $scope.uploadFiles = (file, invalid) => {

    };

    $scope.downloadFile = () => {

    };

    $scope.init = $async(async()=>{
        console.log('starting init');
    });

    $scope.init();


};