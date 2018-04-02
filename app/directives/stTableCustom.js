if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'stTableCustom';
}

((window, angular, undefined) => {

    // @ngInject
    angular.module('stTableCustom', [])
        .directive('myEnter', () => {
            return (scope, element, attrs) => {
                //prevents double click on keypress enter
                element.bind("keydown keypress", (event) => {
                    if (event.which === 13) {
                        scope.$apply(() => {
                            scope.$eval(attrs.myEnter);
                        });

                        event.preventDefault();
                    }
                });
            };
        })
        .directive('pageSelect', () => {
            //this directive controls the pagination on tables
            return {
                restrict: 'E',
                template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
                link: (scope, element, attrs) => {
                    scope.$watch('currentPage', (c) => {
                        scope.inputPage = c;
                    });

                    scope.$on('currentPage', (event, args)=>{
                        console.log(scope);
                        console.log(args, 'num of pages');
                        console.log(scope.inputPage, scope.numPages);
                        if(scope.currentPage < scope.numPages){
                            console.log("this should execute");
                            scope.selectPage(scope.pages[scope.pages.length - 1]);
                        }
                        
                    });
                }
            }
        })
})(window, window.angular);