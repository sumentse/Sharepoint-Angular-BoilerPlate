//My library of useful directives
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'custom';
}

((window, angular, undefined) => {

    // @ngInject
    angular.module('custom', [])
        .directive('imageonload', () => {
            return {
                restrict: 'A',
                link: (scope, element, attrs) => {
                    element.bind('error', () => {
                        element
                            .attr('src', attrs['noImage']);
                    });
                }
            };
        })
        .directive('progressButton', ($timeout) => {
            return {
                restrict: 'EA',
                template: `
                    <div class="btn progress-button ng-class:{'initial btn-success': buttonStatus === 'initial', 'pending btn-primary':buttonStatus === 'pending', 'btn-success':buttonStatus === 'complete'}">
                        <span class="ng-class:{'hide': buttonStatus === 'pending' || buttonStatus === 'complete'}" ng-bind="buttonName"></span>
                        <span class="fas fa-spinner fa-spin ng-class:{'hide':buttonStatus === 'initial' || buttonStatus === 'complete'}"></span>
                        <span class="fas fa-check ng-class:{'hide': buttonStatus === 'initial' || buttonStatus === 'pending'}"></span>
                    </div>
                `,
                link: (scope, element, attrs) => {

                    let button = element.children();
                    let completeTimer = null;
                    let initialTimer = null;

                    scope.setup = ()=>{
                        angular.extend(scope, {
                            buttonName: 'Submit',
                            buttonStatus: 'initial',
                            disableBtn: false
                        });
                    };

                    element.bind('click', (event) => {

                        event.preventDefault();

                        if(scope.disableBtn){
                            return;
                        }

                        scope.$apply(async() => {
                            angular.extend(scope, {
                                buttonStatus: 'pending',
                                disableBtn: true
                            });

                            let status = await scope.$eval(attrs.asyncClick);
                            if (status) {

                                $timeout.cancel(completeTimer);
                                $timeout.cancel(initialTimer);

                                completeTimer = $timeout(() => {
                                    angular.extend(scope, {
                                        buttonStatus: 'complete'
                                    });


                                    initialTimer = $timeout(() => {
                                        angular.extend(scope, {
                                            buttonStatus: 'initial',
                                            disableBtn: false
                                        });
                                    }, 1500);

                                }, 1000);

                            }
                        });


                    });

                    scope.setup();





                }
            }
        })
        .directive('myEnter', () => {
            return (scope, element, attrs) => {
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
        .directive('listBox', (_) => {
            return {
                restrict: 'EA',
                template: `
                    <div class="animated insight well listbox-container" ng-show="listBoxReady">
                        <div class="input-group">
                            <input type="text" class="form-control input-box" my-enter="add(userInput)" ng-model="userInput" placeholder="{{uiState.placeholder}}" />
                            <div class="input-group-btn">
                                <span class="btn btn-primary" ng-click="add(userInput)" style="padding-bottom:7px">Add</span>
                            </div>
                        </div>
                        <div class="scroll-container" ng-style="{'height': uiState.scrollHeight + 'px'}">
                            <p id="no-items" ng-show="items.length === 0">No items added</p>
                            <div class="animate-row listbox-items" ng-repeat="item in items | limitTo: uiState.maxSize track by $index">
                                <div ng-bind="item"></div>
                                <i class="fas fa-minus-circle text-danger clickable" ng-click="remove(item)"></i>
                            </div>
                        </div>
                    </div>
                `,
                scope: {
                    items: '=ngModel'
                },
                link: (scope, element, attrs) => {

                    scope.setup = () => {
                        angular.extend(scope, {
                            items: scope.items.sort(),
                            userInput: '',
                            uiState: {
                                maxSize: angular.isDefined(attrs.maxSize) ? parseInt(attrs.maxSize, 10) : 50,
                                scrollHeight: angular.isDefined(attrs.scrollHeight) ? attrs.scrollHeight : 200,
                                unique: angular.isDefined(attrs.unique) ? attrs.unique == 'true' : true,
                                placeholder: angular.isDefined(attrs.placeholder) ? attrs.placeholder : '',
                            },
                            listBoxReady: true
                        });
                    };

                    scope.add = (userInput) => {

                        if (userInput !== '') {
                            angular.extend(scope, {
                                items: scope.uiState.unique ? _.sortedUniq((scope.items.concat(userInput)).sort()) : (scope.items.concat(userInput)).sort(),
                                userInput: ''
                            });
                        }


                    };

                    scope.remove = (item) => {

                        angular.extend(scope, {
                            items: _.filter(scope.items, (o) => o !== item)
                        });

                    };

                    scope.setup();
                }
            }
        })        

})(window, window.angular);