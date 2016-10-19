module.exports = angular.module("app.services", [])
	.provider("spService", require("./spRest.service"))