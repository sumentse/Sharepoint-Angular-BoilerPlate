// @ngInject
import angular from 'angular';
import './administration';
import parentController from './parent.controller';

angular.module('app.controllers', [
    'administration.module'
])
.controller('parent.controller', parentController)

export default 'app.controllers';