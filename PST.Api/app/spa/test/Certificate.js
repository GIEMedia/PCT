"use strict";

(function () {

    angular.module('pct.elearning.certificate', [
            'ui.router'
    ])
    
        .config(function ($stateProvider) {

            $stateProvider
                .state('certificate', {
                    url: '/certificate',
                    templateUrl: "/app/spa/test/Certificate.html",
                    controller: "certificate.Ctrl"
                })
            ;
        })

        .controller("certificate.Ctrl", function ($scope) {
        })

    ;

})();