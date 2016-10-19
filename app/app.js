'use strict';

// var $ = require("jquery");
var angular = require("angular");

angular.module('app', [
	require("./controllers/app.controllers").name,
	require("./services/app.services").name
])
.constant("CONST", require("./const"))
.config(require("./config"))
.run(require("./run"));