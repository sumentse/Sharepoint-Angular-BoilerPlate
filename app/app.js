'use strict';

// var $ = require("jquery");
var angular = require("angular");

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