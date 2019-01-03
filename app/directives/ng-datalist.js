/////////////////////////////////////////////////////////////////////////////////
//                                                                             //
//-----------------------------------------------------------------------------//
//                          ANGULAR DATALIST DIRECTIVE                         //
//-----------------------------------------------------------------------------//
//                                                                             //
/////////////////////////////////////////////////////////////////////////////////

/**------------------------------------------------------------------------------
 * @name ngDatalist
 * @author Przemysław Hardyn
 * @description Simple datalist directive.
 * @license MIT Licence <http://creativecommons.org/licenses/MIT/>
 ------------------------------------------------------------------------------*/

const name = 'ng-datalist';


angular.module(name, [])
    .directive('ngDatalist', ngDatalist);

function ngDatalist($document, $timeout) {
    return {
        restrict: 'E',
        replace: false,
        scope: {
            items: '=items',
            /** @type {Array}   */
            currentItem: '=current',
            /** @type {string}  */
            fieldRequired: '=req',
            /** @type {boolean} */
            styling: '=styling',
            /** @type {boolean} */
            callback: '&callback',
            inputName: '@inputName',
            placeHolder: '@placeHolder'
        },
        link: (scope, elem, attrs)=>{
            // --------------------------------------------------------- //
            //                      SCOPE & VARIABLES                    //
            // --------------------------------------------------------- //
            // Functions binded to the template:
            scope.selectItem = selectItem;
            scope.showList = showList;
            scope.hideList = hideList;
            scope.highlightItem = highlightItem;
            scope.clearHighlightedItem = clearHighlightedItem;

            // Expose dependencies in the directive:
            var document = $document;
            var domReady = $timeout;

            // Set field to not required if attribute set to false
            // or not provided.
            if (scope.fieldRequired !== true) {
                scope.fieldRequired = false;
            }

            if(!scope.placeHolder) {
                scope.placeHolder = '';
            }

            // Basic color config:
            var borderColor = '#DDDDDD';
            var highlightColor = '#DDDDDD';

            // --------------------------------------------------------- //
            //                           STYLES                          //
            // --------------------------------------------------------- //
            // Use default styles only if custom not set:
            if (scope.styling !== false) {
                // Container element styles:
                scope.containerStyle = {
                    'position': 'relative',
                    'width': '232px',
                    'box-sizing': 'border-box',
                    'height': '32px'
                };

                // Input element styles:
                scope.inputStyle = {
                    'box-sizing': 'border-box',
                    'width': '100%',
                    'height': '32px',
                    'padding': '5px',
                    'margin': '0px',
                };

                // List element styles:
                scope.ulStyle = {
                    'list-style-type': 'none',
                    'padding': '0',
                    'margin': '0',
                    'display': 'none',
                    'position': 'absolute',
                    'top': '32px',
                    'left': '0px',
                    'max-height': '190px',
                    'background-color': '#FFFFFF',
                    'z-index': 100,
                    'width': '100%',
                    'overflow-y': 'auto',
                    'border-left': '1px solid ' + borderColor,
                    'border-bottom': '1px solid ' + borderColor,
                    'border-right': '1px solid ' + borderColor
                };

                // List items styles:
                scope.liStyle = {
                    'display': 'block',
                    'width': '100%',
                    'padding': '5px',
                    'cursor': 'pointer',
                    'box-sizing': 'border-box'
                }
            }

            // --------------------------------------------------------- //
            //                          FUNCTIONS                        //
            // --------------------------------------------------------- //
            /**
             * @function selectItem
             * @description Copy data from selected list item to the model.
             * @param {Object} event Click event used to prevent bubbling.
             * @param {string} item  Text to be copied to the model.
             */
            function selectItem(event, item, index) {
                event.stopPropagation();
                scope.currentItem = item;
                elem.find('ul').css('display', 'none');
            }

            /**
             * @function showList
             * @description Show ul DOM element containing the list.
             * @param {Object} event Click event used to prevent bubbling.
             */
            function showList(event) {
                event.stopPropagation();
                elem.find('ul').css('display', 'block');
            }

            /**
             * @function hideList
             * @description Hide ul DOM element containing the list.
             * @param {Object} event Click event used to prevent bubbling.
             */
            function hideList(event) {
                event.stopPropagation();
                elem.find('ul').css('display', 'none');
            }

            /**
             * @function highlightItem
             * @description Highlight hovered list item.
             * @param {Object} event Mouseover event used to prevent bubbling.
             * @param {Number} index Used to locate current list item in the DOM tree.
             */
            function highlightItem(event, index) {
                event.stopPropagation();
                elem.find('li').eq(index).css({
                    'background-color': borderColor
                });
            }

            /**
             * @function clearHighlightedItem
             * @description Remove item highlight on mouseleave.
             * @param {Object} event Mouseleave event used to prevent bubbling.
             */
            function clearHighlightedItem(event) {
                event.stopPropagation();
                elem.find('li').css({
                    'background-color': 'white'
                });
            }

            // --------------------------------------------------------- //
            //                           EVENTS                          //
            // --------------------------------------------------------- //
            // Bind click event to the document to hide list:
            domReady(function () {
                document.on('click', function (event) {
                    scope.hideList(event);
                })
            })

            // Remove document click event on destroy:
            elem.on('$destroy', function () {
                document.off('click');
            });

            scope.$watch('currentItem', (nVal, oVal) => {
                if (angular.isDefined(nVal)) {
                    scope.callback();
                }
            });

        },
        template: `
    <div class="input-group">
        <input type="text" 
            name={{inputName}}
            class="form-control"
            autocomplete="off"
            placeholder={{placeHolder}}
            ng-required="fieldRequired" 
            ng-model="currentItem"
            ng-model-options="{ allowInvalid: true, debounce: 500 }"
            ng-click="showList($event)" 
            ng-style="inputStyle" 
            ng-keydown="($event.keyCode == 13 || 
                        $event.keyCode == 9) && 
                        hideList($event)">
                        <span class="input-group-addon" style="padding-top:5px; padding-bottom:5px;"><i class="fas fa-search"></i></span>
        <ul ng-style="ulStyle" class="ng-datalist-list">
            <li ng-repeat="item in items | filter: currentItem track by $index" 
                class="ng-datalist-item" 
                ng-click="selectItem($event, item, $index)" 
                ng-style="liStyle" 
                ng-mouseover="highlightItem($event, $index)" 
                ng-mouseleave="clearHighlightedItem($event)">{{ item }}
            </li>
        </ul>
    </div>
`
    }
}

export default name;