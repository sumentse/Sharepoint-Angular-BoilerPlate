// @ngInject
export default ($scope, $state, $filter, $async, $stateParams, spService, email, IE, CONST) => {

    angular.merge($scope, {
        $state,
        filterState: {
            searchTitle: '',
            status: ''
        },
        tableState: {
          colLength: (document.querySelector('#column-names')) ? document.querySelector('#column-names').childElementCount : 0,
          display: []
        }
    });

    $scope.refreshTable = () => {
        let ieVersion = IE.version();
    
        if (ieVersion > 0 && ieVersion <= 11) {
          $scope.$broadcast('ie_refreshTable');
    
        } else if (window.navigator.userAgent.indexOf("Edge") > -1) {
          $scope.$broadcast('ie_refreshTable');
    
        } else {
          //if not using Internet explorer or Edge
          return;
        }
      }    

    $scope.deleteItem = (id) => {
        modal.confirmation($async(async (userAnswer) => {
    
          if (userAnswer === true) {
    
            await spService.deleteListItem(CONST.rootFolder, CONST.LISTS.form, id);
    
            $scope.$broadcast('refreshTable', {
              Title: $scope.filterState.searchTitle,
              status: $scope.filterState.status
            });
            
          }
    
        }));
      };

      $scope.clearFilters = () => {

        angular.extend($scope.filterState, {
          Title: '',
          status: ''
        });
    
        //needs to do a broadcast
        $scope.$broadcast('refreshTable', {
          Title: $scope.filterState.searchTitle,
          status: $scope.filterState.status
        });
    
      };
      
      $scope.customPipe = $async(async (tableState) => {
        let {
          pagination,
          search,
          sort
        } = tableState;

        let start = pagination.start || 0;
        let number = pagination.number || 25;
        let where = '';
    
        if ($scope.filterState.status) {
          where = `
            <Where>
              <Eq>
                <FieldRef Name='status'></FieldRef>
                <Value Type='text'>${$scope.filterState.status}</Value>
              </Eq>
            </Where>
          `;
        }
    
        let query = new spService.camlQuery(CONST.rootFolder, {
          listName: CONST.LISTS.form,
          pageSize: 1000
        });
        query.setXML(
          `
            <Query>
                <ViewFields>
                    <FieldRef Name='ID'/>
                    <FieldRef Name='Title'/>
                    <FieldRef Name='status'/>
                </ViewFields>
                ${where}
            </Query>
        `);
    
        try {
          const {
            items
          } = await query.GetListItems(0);
    
          angular.extend($scope.tableState, {
            display: search.predicateObject ? $filter('filter')(items, search.predicateObject) : items
          });
    
          //Handles sorting for column headers
          if (sort.predicate) {
            angular.extend(
              $scope.tableState, {
                display: $filter('orderBy')($scope.tableState.display, sort.predicate, sort.reverse)
              }
            );
          }
    
          //Handle pagination
          angular.merge(tableState, {
            pagination: {
              totalItemCount: $scope.tableState.display.length,
              numberOfPages: Math.ceil($scope.tableState.display.length / number)
            }
          });
    
          angular.extend(
            $scope.tableState, {
              display: $scope.tableState.display.slice(start, start + number)
            }
          );
    
        } catch (err) {
            
        }
    
      });      

};