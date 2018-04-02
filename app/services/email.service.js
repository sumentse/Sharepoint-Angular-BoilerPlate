'use strict';

// @ngInject
module.exports = () => {
    var digestValue = angular.element(document.querySelector("#__REQUESTDIGEST")).val();
    return {
        $get: /*@ngInject*/ ($http, $q) =>  {
            return {
                getDigestValue: (url, complete) =>  {

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
                /**
                 * @param  {String} url Sharepoint domain url
                 * @param  {Array} to Email addresses to send to
                 * @param  {String} from Original sender.
                 * @param  {String} body Message to send
                 * @param  {String} subject Email subject
                 * @param  {Promise} complete Response from server when email is successful
                 * @param  {Promise} failure Response from server when email did not send
                 * @return {Void}
                 */
                send: (url, to, from, body, subject, complete, failure) => {

                    try {
                        if (!url) throw "You need to supply an url";
                        if (!to) {
                            throw ("There is no email to be send to");
                        } else if (!angular.isArray(to)) {
                            throw ("The to variable needs to be an array");
                        }
                        if (!body) throw "There is no message in the body";
                    } catch (e) {
                        console.log(e);
                        return;
                    }

                    var mail = {
                        properties: {
                            __metadata: { "type": "SP.Utilities.EmailProperties" },
                            From: (from) ? from : "",
                            To: { "results": to },
                            Body: body,
                            Subject: subject
                        }
                    };

                    this.getDigestValue(url,  (digestValue) => {

                        $http({
                            url: url + "/_api/SP.Utilities.Utility.SendEmail",
                            method: "POST",
                            data: JSON.stringify(mail),
                            headers: {
                                "Content-Type": "application/json;odata=verbose",
                                "Accept": "application/json;odata=verbose",
                                "X-RequestDigest": digestValue
                            }
                        }).then( (response) => {
                            complete(response);
                        },  (response) => {
                            failure(response);
                        });


                    });

                }
            };

        }
    }
};