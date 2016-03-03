'use strict';

// var $ = require("jquery");
var angular = require("angular");

//separating angular components
require("./services/app.services");
require("./controllers/app.controllers");


angular.module("app", ["app.controllers", "app.services"]);