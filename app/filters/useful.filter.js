if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports) {
    module.exports = 'useful.filters';
}

((window, angular, undefined) => {
    // @ngInject
    angular.module("useful.filters", [])
        .filter('bytes', () => {
            return (bytes, precision) => {
                if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
                if (typeof precision === 'undefined') precision = 1;
                let units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                    number = Math.floor(Math.log(bytes) / Math.log(1024));
                return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
            }
        })
        .filter('regex', () => {
            return (input, field, regex) => {
                let patt = new RegExp(regex);
                let out = [];
                for (let i = 0; i < input.length; i++) {
                    if (patt.test(input[i][field]))
                        out.push(input[i]);
                }
                return out;
            };
        });

})(window, window.angular);