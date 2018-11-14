'use strict';

require("babel-polyfill");
window.moment = require('moment');
window.introJs = require('intro.js');
// window.exporter = require('export-to-csv');
let angular = require("angular");

angular.module('app', [
	require("./controllers/app.controllers"),
	require("./services/app.services"),
	require("./directives/app.directives"),
	require("./filters/app.filters")
])
.constant("CONST", require("./const"))
.config(require("./config"))
// .config(require("./routes/main-route"))
.run(require("./run"));