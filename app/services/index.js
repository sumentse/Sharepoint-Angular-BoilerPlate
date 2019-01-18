// @ngInject
import 'angular-async-await';
import naturalSort from 'javascript-natural-sort';
import lodash from 'lodash';
import CSV from './csv.exporter';
import modal from './modal.service';
import spRest from './spRest.service';
import spFolder from './spFolder.service';
import spEmail from './email.service';

angular.module('app.services', ['angular-async-await'])
    .provider('spService', spRest)
    .provider('spFolder', spFolder)
    .provider('email', spEmail)
    .provider('modal', modal)
    .provider('CSV', CSV)
    .factory("_", () => lodash)
    .factory('IE', () => {

        return {
            version: () => {
                let rv = -1;
                let ua, re;
                if (navigator.appName == 'Microsoft Internet Explorer') {
                    ua = navigator.userAgent;
                    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null)
                        rv = parseFloat(RegExp.$1);
                } else if (navigator.appName == 'Netscape') {
                    ua = navigator.userAgent;
                    re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                    if (re.exec(ua) != null)
                        rv = parseFloat(RegExp.$1);
                }
                return rv;

            }
        }

    })    
    .factory("naturalSort", () => naturalSort)

export default 'app.services';