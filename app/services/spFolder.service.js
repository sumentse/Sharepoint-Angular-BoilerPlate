// @ngInject
module.exports = () => {
    var digestValue = angular.element(document.querySelector("#__REQUESTDIGEST")).val();
    return {
        $get: /*@ngInject*/ ($http, $q) => {
            return {
                getDigestValue: (url, complete) => {

                    if (digestValue != null) {
                        complete(digestValue);
                    } else {

                        $http({
                            url: url + "/_api/contextinfo",
                            async: true,
                            method: "POST",
                            headers: {
                                "accept": "application/json;odata=verbose",
                                "contentType": "text/xml"
                            }
                        }).then((response) => {
                            digestValue = response.data.d.GetContextWebInformation.FormDigestValue;
                            complete(digestValue);
                        }, (response) => {
                            alert("Cannot get digestValue.");
                        });

                    }

                },
                getFolderItems: (url, folderPath, query, complete, failure) => {
                    //folderpath should start with /sites/domain/foldername
                    $http({
                        url: url + "/_api/web/getFolderByServerRelativeUrl('" + folderPath + "')/Files" + query,
                        method: "GET",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then((response) => {
                        complete(response);
                    }, (response) => {
                        failure(response);
                    });
                },
                getFolders: (url, folderPath, query, complete, failure) => {
                    $http({
                        url: url + "/_api/web/getFolderByServerRelativeUrl('" + folderPath + "')/Folders" + query,
                        method: "GET",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then((response) => {
                        complete(response);
                    }, (response) => {
                        failure(response);
                    });
                }
            };

        }
    }
};