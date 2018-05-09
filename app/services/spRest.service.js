// @ngInject
module.exports = () => {
    let defaultDomain = "/";
    let digestValue = angular.element(document.querySelector("#__REQUESTDIGEST")).val();
    return {
        urlDomain: (urlLink) => {
            if (angular.isDefined(urlLink)) {
                defaultDomain = urlLink;
                return this;
            } else {
                return defaultDomain;
            }
        },
        $get: /*@ngInject*/ ($http, $q, _) => {
            return {
                encodeString: (theString)=>{
                    return encodeURIComponent(theString).replace(/'/g, "''");                    
                },
                getDigestValue: (complete = () => {}) => {

                    let deferred = $q.defer();

                    if (digestValue != null) {
                        complete(digestValue);
                        deferred.resolve(digestValue);
                    } else {

                        $http({
                            url: `${defaultDomain}/_api/contextinfo`,
                            async: true,
                            method: "POST",
                            headers: {
                                "accept": "application/json;odata=verbose",
                                "contentType": "text/xml"
                            }
                        }).then((response) => {
                            digestValue = response.data.d.GetContextWebInformation.FormDigestValue;
                            complete(digestValue);
                            deferred.resolve(digestValue);

                        }, (response) => {
                            alert("Cannot get digestValue.");
                            deferred.reject(response);

                        });

                    }

                    return deferred.promise;


                },
                downloadAttachment: (downloadLink, options) => {

                    let deffered = $q.defer();

                    //Full File API support.

                    try {

                        if (window.FileReader && window.File && window.FileList && window.Blob) {

                            if (angular.isUndefined(downloadLink) || !angular.isString(downloadLink)) {
                                throw Error('You need to supply a download link');
                            }

                            if (angular.isUndefined(options.type)) {
                                throw Error('You need to supply the type of file for options');
                            }


                            let originalFileName = downloadLink.split('/').pop();

                            $http({
                                url: downloadLink,
                                method: 'GET',
                                responseType: 'arraybuffer'
                            }).then((response) => {

                                //download file logic if Microsoft Internet Explorer
                                let linkElement = document.createElement('a')

                                let ieVersion = -1;
                                let ua, re;
                                if (navigator.appName == 'Microsoft Internet Explorer') {
                                    ua = navigator.userAgent;
                                    re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
                                    if (re.exec(ua) != null)
                                        ieVersion = parseFloat(RegExp.$1);
                                } else if (navigator.appName == 'Netscape') {
                                    ua = navigator.userAgent;
                                    re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
                                    if (re.exec(ua) != null)
                                        ieVersion = parseFloat(RegExp.$1);
                                }

                                if (ieVersion > 0 && ieVersion <= 11) {

                                    window.navigator.msSaveOrOpenBlob(new Blob([response.data], { type: options.type }), options.name ? options.name : originalFileName);

                                } else if (window.navigator.userAgent.indexOf("Edge") > -1) {

                                    window.navigator.msSaveOrOpenBlob(new Blob([response.data], { type: options.type }), options.name ? options.name : originalFileName);

                                } else {
                                    //if not using Internet explorer or Edge
                                    let blob = new Blob([response.data], { type: options.type });
                                    let url = window.URL.createObjectURL(blob);

                                    linkElement.setAttribute('href', url);
                                    linkElement.setAttribute('download', options.name ? options.name : originalFileName);

                                    let clickEvent = new MouseEvent("click", {
                                        "view": window,
                                        "bubbles": true,
                                        "cancelable": false
                                    });

                                    linkElement.dispatchEvent(clickEvent);
                                }

                                deffered.resolve(true);



                            }, (response) => {
                                deffered.reject(response);
                            });

                        } else {
                            throw 'Cannot use these features as they are not supported in this browser';
                        }

                    } catch (err) {
                        deffered.resolve(false);
                        throw Error(err);
                    }

                    return deffered.promise;


                },
                copyItems: function(config = {}, complete = () => {}, failure = () => {}, fileStatus) {
                    //this is use to copy from one sharepoint list to another
                    let dataTransferProcess = $q.defer();

                    this.getListItems(config.url, config.src, config.query,
                        async(response) => {

                            if (response.status === 200) {

                                let sourceData = response.data.d.results;

                                let getData = async() => {
                                    let deffered = $q.defer();
                                    let itemsToAdd = [];
                                    let mapData = _.map(sourceData, (item, index) => {
                                        return _.pickBy(item, (v, k) => {
                                            return _.includes(config.srcFields, k);
                                        });
                                    });

                                    for (let i = 0, totalItems = mapData.length; i < totalItems; i++) {

                                        //check if AttachmentFiles key is there
                                        if (!angular.isUndefined(mapData[i].AttachmentFiles)) {

                                            if (!angular.isUndefined(mapData[i].AttachmentFiles.results)) {
                                                //data show files
                                                let theFiles = mapData[i].AttachmentFiles.results;


                                                if (theFiles.length > 0) {
                                                    //at least one file
                                                    let filesToAttach = [];
                                                    for (let fileIndex = 0, totalFiles = theFiles.length; fileIndex < totalFiles; fileIndex++) {
                                                        let fileData = await this.getFile(theFiles[fileIndex].ServerRelativeUrl, { blob: false });
                                                        filesToAttach.push(fileData);
                                                    }

                                                    delete mapData[i].AttachmentFiles.results;

                                                    angular.extend(mapData[i], {
                                                        AttachmentFiles: filesToAttach
                                                    });

                                                } else {
                                                    delete mapData[i].AttachmentFiles;
                                                }
                                            }

                                        }
                                    }

                                    if (angular.isUndefined(config.keyMap)) {
                                        deferred.resolve(mapData);
                                    } else {

                                        if (!angular.isObject(config.keyMap)) {
                                            throw Error('keyMap must be an object');
                                        }

                                        deffered.resolve(
                                            _.map(mapData, (item) => {
                                                return _.mapKeys(item, (v, k) => {
                                                    return config.keyMap[k] ? config.keyMap[k] : k;
                                                });
                                            })
                                        );
                                    }

                                    return deffered.promise;
                                };


                                let itemsToAdd = await getData();

                                let isDone = await this.addListItems(config.url, config.dest, itemsToAdd,
                                    (response, index) => {
                                        complete(response, index);
                                    },
                                    (response, index) => {
                                        failure(response, index);
                                    },
                                    (response, index) => {
                                        fileStatus(response, index);
                                    }
                                );

                                dataTransferProcess.resolve(isDone);

                            } else {
                                throw Error('Fail to get items');
                                dataTransferProcess.resolve(false);
                            }
                        },
                        (err) => {
                            failure(err);
                        }
                    );

                    return dataTransferProcess.promise;
                },
                countItems: (url, listname, query = '') => {

                    let queryCondition = null;
                    if (query === '' || angular.isUndefined(query)) {
                        queryCondition = '?$top=5000';
                    } else {
                        queryCondition = `${query}&$top=5000`;
                    }

                    let deffered = $q.defer();

                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/items${queryCondition}`,
                        method: 'GET',
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then((response) => {
                        deffered.resolve(response.data.d.results.length);
                    }, (response) => {
                        deffered.reject(response);
                    });

                    return deffered.promise;
                },
                getFileBuffer: (file) => {
                    let deffered = $q.defer();

                    let reader = new FileReader();
                    reader.onload = (e) => {
                        deffered.resolve(e.target.result);
                    }
                    reader.onerror = (e) => {
                        deffered.reject(e.target.error);
                    }
                    reader.readAsArrayBuffer(file);
                    return deffered.promise;

                },
                getFile: (fileURL, options = { blob: true, filename: null }) => {
                    let deffered = $q.defer();

                    $http({
                        url: fileURL,
                        method: 'GET',
                        responseType: 'blob'
                    }).then((response) => {
                        if (options.blob) {
                            deffered.resolve(response);
                        } else {
                            if (options.filename) {
                                let blobObj = response.data;
                                blobObj.lastModifiedDate = new Date();
                                blobObj.name = options.filename;
                                deffered.resolve(blobObj);
                            } else {
                                let blobObj = response.data;
                                blobObj.lastModifiedData = new Date();
                                blobObj.name = fileURL.split('/').pop();
                                deffered.resolve(blobObj);
                            }
                        }
                    }, (response) => {
                        deffered.reject(response);
                    });

                    return deffered.promise;
                },
                searchUser: (url, query, limit, complete = () => {}, failure = () => {}) => {
                    $http({
                        url: `${url}/_api/web/SiteUsers?$filter=Email ne '' and ( substringof('${query}',Title) or substringof('${query}',Email) )&$top=${limit}`,
                        method: 'GET',
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then((response) => {
                        complete(response);
                    }, (response) => {
                        failure(response);
                    });
                },
                addListFileAttachment: async function(url, listname, id, fileName, file, complete = () => {}, failure = () => {}) {

                    //cleans the string to correct name that is acceptable on sharepoint.
                    try {
                        let cleanStrFileName = fileName.replace(/^\.+|([|\/&;$%:#~?^{}*'@"<>()+,])|\.+$/g, "");
                        cleanStrFileName = cleanStrFileName.substr(-128);

                        //you can only add or delete the list item but it will be different in documents
                        $http({
                            url: `${url}/_api/web/lists/GetByTitle('${listname}')/items(${id})/AttachmentFiles/add(FileName='${cleanStrFileName}')`,
                            method: "POST",
                            data: await this.getFileBuffer(file),
                            processData: false,
                            transformRequest: angular.identity,
                            headers: {
                                "Accept": "application/json;odata=verbose",
                                "X-RequestDigest": await this.getDigestValue()
                            }
                        }).then((response) => {
                            complete(response);
                        }, (response) => {
                            failure(response);
                        });


                    } catch (e) {
                        throw Error("Filename was not supply");
                    }


                },
                addListFileAttachments: function(url, listname, id, AttachmentFiles, status) {

                    let deffered = $q.defer();

                    try {
                        let addItem = async(i) => {

                            if (AttachmentFiles.files.length !== i) {

                                let cleanStrFileName = AttachmentFiles.files[i].name.replace(/^\.+|([|\/&;$%:#~?^{}*'@"<>()+,])|\.+$/g, "");
                                cleanStrFileName = cleanStrFileName.substr(-128);

                                //you can only add or delete the list item but it will be different in documents
                                $http({
                                    url: `${url}/_api/web/lists/GetByTitle('${listname}')/items(${id})/AttachmentFiles/add(FileName='${AttachmentFiles.prefix}${cleanStrFileName}')`,
                                    method: "POST",
                                    data: await this.getFileBuffer(AttachmentFiles.files[i]),
                                    processData: false,
                                    transformRequest: angular.identity,
                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                        "X-RequestDigest": await this.getDigestValue()
                                    }
                                }).then((response) => {
                                    status(response, i);
                                    addItem(i + 1);
                                }, (response) => {

                                    deffered.reject(response, i);

                                });



                            } else {
                                deffered.resolve(true);
                            }


                        }

                        addItem(0);

                    } catch (err) {
                        throw Error(err);
                    }


                    return deffered.promise;

                },
                deleteListFileAttachment: async function(url, listname, id, fileName, complete = () => {}, failure = () => {}) {

                    $http({
                        url: `${url}/_api/web/lists/GetByTitle('${listname}')/items(${id})/AttachmentFiles/getByFileName('${fileName}')`,
                        method: "POST",
                        headers: {
                            "Accept": "application/json;odata=verbose",
                            "X-Http-Method": "DELETE",
                            "X-RequestDigest": await this.getDigestValue(),
                        }
                    }).then((response) => {
                        complete(response);
                    }, (response) => {
                        failure(response);
                    });

                },
                deleteListFileAttachments: function(url, listname, id, fileNameList = [], status) {
                    let deffered = $q.defer();

                    try {

                        let deleteItem = async(i) => {
                            if (fileNameList.length !== i) {
                                //check if it's a path or not
                                let file = fileNameList[i];
                                let hasPath = file.split('/').length > 1 ? true : false;
                                let fileName = null;

                                if (hasPath) {
                                    fileName = file.split('/').pop();
                                } else {
                                    fileName = file;
                                }

                                $http({
                                    url: `${url}/_api/web/lists/GetByTitle('${listname}')/items(${id})/AttachmentFiles/getByFileName('${fileName}')`,
                                    method: "POST",
                                    headers: {
                                        "Accept": "application/json;odata=verbose",
                                        "X-Http-Method": "DELETE",
                                        "X-RequestDigest": await this.getDigestValue(),
                                    }
                                }).then((response) => {
                                    status(response, i);
                                    deleteItem(i + 1);
                                }, (response) => {
                                    deffered.reject(response, i);
                                });

                            } else {
                                deffered.resolve(true);
                            }
                        };

                        deleteItem(0);


                    } catch (err) {
                        deffered.reject(err);
                    }

                    return deffered.promise;
                },
                getListItemType: (name) => {
                    return (`SP.Data.${name[0].toUpperCase() + name.substring(1)}ListItem`).replace(/\s/g, "_x0020_");
                },
                getListItem: (url, listname, id, query, complete = () => {}, failure = () => {}) => {

                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/items('${id}')${query}`,
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
                getListItems: (url, listname, query, complete = () => {}, failure = () => {}) => {
                    // Executing our items via an ajax request
                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/items${query}`,
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
                camlQuery: async function(url, listname, xml, complete = () => {}, failure = () => {}) {


                    let data = {
                        "query": {
                            "__metadata": { "type": "SP.CamlQuery" },
                            "ViewXml": xml
                        }
                    };

                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/GetItems`,
                        method: "POST",
                        data: data,
                        headers: {
                            "Content-Type": "application/json;odata=verbose",
                            "Accept": "application/json;odata=verbose",
                            "X-RequestDigest": await this.getDigestValue()
                        }
                    }).then((response) => {
                        complete(response.data.d);
                    }, (response) => {
                        failure(response);
                    });


                },
                getUserByID: function(url, ID) {

                    if (!angular.isNumber(ID)) {
                        throw Error('ID should be type Int');
                    }

                    let deffered = $q.defer();
                    $http({
                        url: `${url}/_api/web/getuserbyid(${ID})`,
                        method: 'GET',
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then(async(response) => {
                        try {
                            let { data: { d: { UserProfileProperties } } } = await this.getUserProfilePropertyFor(url, (response.data.d.LoginName.split('\\').pop()));

                            deffered.resolve(
                                angular.merge(response, {
                                    data: {
                                        d: {
                                            UserProfileProperties
                                        }
                                    }
                                })
                            );

                        } catch (err) {
                            deffered.reject(err);
                        }

                    }, (response) => {
                        deffered.reject(response);
                    })

                    return deffered.promise;
                },
                getUserProfilePropertyFor: (url, accountName) => {

                    if (!angular.isString(accountName)) {
                        throw Error('accountName should be type string');
                    }

                    let deffered = $q.defer();

                    $http({
                        url: `${url}/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName=@v)?@v='mskcc\\${accountName}'&$select=UserProfileProperties`,
                        method: 'GET',
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then(
                        (response) => {

                            try {
                                let { data: { d: { UserProfileProperties: { results } } } } = response;

                                let UserProfileProperties = _.keyBy(results, 'Key');
                                delete response.data.d.UserProfileProperties.results;

                                deffered.resolve(angular.merge(response, {
                                    data: {
                                        d: {
                                            UserProfileProperties
                                        }
                                    }
                                }));

                            } catch (err) {

                                delete response.data.d.GetPropertiesFor;

                                deffered.resolve(angular.merge(response, {
                                    data: {
                                        d: {
                                            UserProfileProperties: null
                                        }
                                    }
                                }));
                            }
                        },
                        (response) => {
                            deffered.reject(response);
                        }
                    );

                    return deffered.promise;
                },
                getCurrentUser: (url, query = '') => {
                    let deffered = $q.defer();

                    $http({
                        url: `${url}/_api/SP.UserProfiles.PeopleManager/GetMyProperties${query}`,
                        method: 'GET',
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then((response) => {



                        let UserProfileProperties = _.keyBy(response.data.d.UserProfileProperties.results, 'Key');
                        delete response.data.d.UserProfileProperties.results;

                        deffered.resolve(angular.merge(response, {
                            data: {
                                d: {
                                    UserProfileProperties
                                }
                            }
                        }));
                    }, (response) => {
                        deffered.reject(response);
                    });

                    return deffered.promise;
                },
                getPermissionLevels: (url, query = '') => {
                    let deffered = $q.defer();

                    $http({
                        url: `${url}/_api/web/currentuser/groups${query}`,
                        method: "GET",
                        headers: {
                            "Accept": "application/json; odata=verbose"
                        }
                    }).then((response) => {
                        deffered.resolve(response);
                    }, (response) => {
                        deffered.reject(response);
                    });

                    return deffered.promise;

                },
                addListItem: async function(url, listname, documents, complete = () => {}, failure = () => {}, fileStatus) {
                    // Prepping our update
                    let item = angular.extend({
                        "__metadata": {
                            "type": this.getListItemType(listname)
                        }
                    }, documents.metadata);

                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/items`,
                        method: "POST",
                        data: angular.toJson(item),
                        headers: {
                            "Content-Type": "application/json;odata=verbose",
                            "Accept": "application/json;odata=verbose",
                            "X-RequestDigest": await this.getDigestValue()
                        }
                    }).then((response) => {
                        if (documents.AttachmentFiles) {
                            if (documents.AttachmentFiles.length === 0) {
                                complete(response);
                            } else {
                                complete(response);
                                this.addListFileAttachments(url, listname, response.data.d.ID, {
                                        files: documents.AttachmentFiles,
                                        prefix: documents.prefix || ''
                                    },
                                    (status, index) => {
                                        fileStatus(response.data.d.ID, status, index);
                                    });

                            }
                        } else {
                            complete(response);
                        }
                    }, (response) => {
                        failure(response);
                    });


                },
                addListItems: function(url, listname, itemsToAdd, complete = () => {}, failure = () => {}, fileStatus) {


                    if (!angular.isArray(itemsToAdd)) {
                        throw Error("Third Param need to be an Array");
                    }

                    if (itemsToAdd.length === 0) {
                        throw Error("Third Param needs element in the Array");
                    }

                    let deffered = $q.defer();

                    let addItem = async(i) => {
                        if (itemsToAdd.length !== i) {

                            let AttachmentFiles = [];

                            //check if there are attachments
                            if (!angular.isUndefined(itemsToAdd[i].AttachmentFiles)) {
                                //there is an attachment
                                AttachmentFiles = itemsToAdd[i].AttachmentFiles;
                                delete itemsToAdd[i].AttachmentFiles;
                            }


                            let item = angular.extend({
                                "__metadata": {
                                    "type": this.getListItemType(listname)
                                }
                            }, itemsToAdd[i]);


                            $http({
                                url: `${url}/_api/web/lists/getbytitle('${listname}')/items`,
                                method: "POST",
                                data: angular.toJson(item),
                                headers: {
                                    "Content-Type": "application/json;odata=verbose",
                                    "Accept": "application/json;odata=verbose",
                                    "X-RequestDigest": await this.getDigestValue()
                                }
                            }).then(async(response) => {

                                if (AttachmentFiles.length === 0) {
                                    complete(response, i);
                                } else {
                                    //there are attachments
                                    complete(response, i);
                                    await this.addListFileAttachments(url, listname, response.data.d.ID, { files: AttachmentFiles, prefix: '' }, (status, index) => {
                                        fileStatus(response.data.d.ID, status, index);
                                    });
                                }

                                addItem(i + 1);

                            }, (response) => {
                                failure(response, i);
                                deffered.resolve(false);
                            });
                        } else {
                            //return a bool if function is done
                            deffered.resolve(true);
                        }
                    };

                    addItem(0);

                    return deffered.promise;

                },
                updateListItem: async function(url, listname, id, metadata, complete = () => {}, failure = () => {}) {

                    //this will update the list item on restful api on sharepoint
                    let item = angular.extend({
                        "__metadata": {
                            "type": this.getListItemType(listname)
                        }
                    }, metadata);

                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/items(${id})`,
                        method: "POST",
                        data: angular.toJson(item),
                        headers: {
                            "Accept": "application/json;odata=verbose",
                            "Content-Type": "application/json;odata=verbose",
                            "X-RequestDigest": await this.getDigestValue(),
                            "X-HTTP-Method": "MERGE",
                            "If-Match": "*"
                        }
                    }).then((response) => {
                        complete(response);
                    }, (response) => {
                        failure(response);
                    });

                },
                updateListItems: function(url, listname, itemsToUpdate, complete = () => {}, failure = () => {}) {

                    if (!angular.isArray(itemsToUpdate)) {
                        throw Error("Third Param need to be an Array");
                    }

                    if (itemsToUpdate.length === 0) {
                        throw Error("Third Param needs element in the Array");
                    }

                    let deffered = $q.defer();

                    let updateItem = async(i) => {

                        if (itemsToUpdate.length !== i) {

                            let ID = itemsToUpdate[i].ID;
                            delete itemsToUpdate[i].ID;

                            let item = angular.extend({
                                "__metadata": {
                                    "type": this.getListItemType(listname)
                                }
                            }, itemsToUpdate[i]);

                            $http({
                                url: `${url}/_api/web/lists/getbytitle('${listname}')/items(${ID})`,
                                method: "POST",
                                data: angular.toJson(item),
                                headers: {
                                    "Accept": "application/json;odata=verbose",
                                    "Content-Type": "application/json;odata=verbose",
                                    "X-RequestDigest": await this.getDigestValue(),
                                    "X-HTTP-Method": "MERGE",
                                    "If-Match": "*"
                                }
                            }).then((response) => {
                                complete(response, i);
                                updateItem(i + 1);
                            }, (response) => {
                                failure(response, i);
                                deffered.resolve(false);
                            });
                        } else {
                            //return a bool if function is done
                            deffered.resolve(true);
                        }

                    }

                    updateItem(0);


                    return deffered.promise;

                },
                deleteListItem: async function(url, listname, id, complete = () => {}, failure = () => {}) {
                    // getting our item to delete, then executing a delete once it's been returned

                    $http({
                        url: `${url}/_api/web/lists/getbytitle('${listname}')/items(${id})`,
                        method: "POST",
                        headers: {
                            "Accept": "application/json;odata=verbose",
                            "X-Http-Method": "DELETE",
                            "X-RequestDigest": await this.getDigestValue(),
                            "If-Match": "*"
                        }

                    }).then((response) => {
                        complete(response);
                    }, (response) => {
                        failure(response);
                    });


                },
                deleteListItems: function(url, listname, itemsToDelete, complete = () => {}, failure = () => {}) {

                    if (!angular.isArray(itemsToDelete)) {
                        throw Error("Third Param need to be an Array");
                    }

                    if (itemsToDelete.length === 0) {
                        throw Error("Third Param needs element in the Array");
                    }

                    let deffered = $q.defer();

                    let deleteItem = async(i) => {

                        if (itemsToDelete.length !== i) {
                            $http({
                                url: `${url}/_api/web/lists/getbytitle('${listname}')/items(${itemsToDelete[i]})`,
                                method: "POST",
                                headers: {
                                    "Accept": "application/json;odata=verbose",
                                    "X-Http-Method": "DELETE",
                                    "X-RequestDigest": await this.getDigestValue(),
                                    "IF-MATCH": "*"
                                }

                            }).then((response) => {
                                complete(response, i);
                                deleteItem(i + 1);
                            }, (response) => {
                                failure(response, i);
                                deffered.resolve(false);
                            });
                        } else {
                            deffered.resolve(true);
                        }

                    }

                    deleteItem(0);


                    return deffered.promise;

                }
            };

        }
    }
};