"use strict";

(function () {

    angular.module("pct.management.template-opener", [
    ])

        .factory("TemplateOpener", ["$compile", "$http", "$q", "$templateCache", "$controller", "$rootScope", function($compile, $http, $q, $templateCache, $controller, $rootScope) {

            function getTemplateContent(options) {
                if (options.elem) {
                    return $q.when(options.elem);
                } else if (options.template) {
                    return $q.when(angular.element(options.template));
                } else {
                    return $http.get(options.templateUrl, {cache: $templateCache}).then(function (resp) {
                        return angular.element(resp.data);
                    });
                }
            }

            return {
                getTemplateContent: getTemplateContent,
                openTemplate: function(options) {

                    return getTemplateContent(options).then(function (rawElem) {

                        var $scope = options.parentScope ? options.parentScope.$new() :
                            options.scope ? options.scope :
                            $rootScope.$new(true);

                        var postCompile = options.link;
                        if (options.compile) {
                            var compiler = options.compile(rawElem);
                            if (compiler && compiler.pre) {
                                compiler.pre($scope);
                            }
                            postCompile = compiler.post;
                        }

                        if (options.controller) {
                            var params = {
                                '$scope': $scope
                            };
                            if (options.resolve) {
                                for (var k in options.resolve) {
                                    params[k] = options.resolve[k]();
                                }
                            }
                            $controller(options.controller, params);
                        }

                        var compiledElem = $compile(rawElem)($scope);
                        if (postCompile) {
                            postCompile($scope, compiledElem);
                        }
                        return {
                            elem: compiledElem,
                            scope: $scope
                        };
                    });
                }
            };
        }])


    ;

})();