"use strict";

(function () {

    angular.module('pct.elearning.api.ForgotpasswordService', [
    ])

        .factory("ForgotpasswordService", ["Api", function(Api) {
            return {
                requestResetPasswordEmail: function(email) {
                    return Api.post("api/account/forgot_password?username=" + email + "&management=false");
                },
                resetPassword: function(username, securityKey, newPassword) {
                    return Api.post("api/account/reset_password", {
                        "username": username,
                        "security_key": securityKey,
                        "new_password": newPassword
                    });
                }
            };
        }])
    ;

})();