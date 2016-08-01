"use strict";

(function () {

    angular.module("pct.elearning.certification.print-service", [
    ])

        .factory("PrintService", ["TemplateOpener", function (TemplateOpener) {
            return {
                print: function (popupWin, options) {
                    TemplateOpener.openTemplate(options).then(function (view) {
                        setTimeout(function () {

                            var html = view.elem[0].outerHTML;
                            view.scope.$destroy();
                            popupWin.document.open();

                            popupWin.document.write('<html><head>' +
                                '<link href="https://fonts.googleapis.com/css?family=Archivo+Narrow:400,700,400italic" rel="stylesheet" type="text/css">' +
                                '<link href="/app/css/style.css" rel="stylesheet">' +
                                '<script src="../../../app/js/jquery-1.11.2.min.js"></script>' +
                                '<script src="../../../app/js/html2canvas.js"></script>' +
                                '</head>' +
                                '<body>' + html + '<div id="canvas" style="width: 980px; margin: 0 auto;"></div></body>' +
                                '</html>');
                            popupWin.document.close();
                            //popupWin.onload = function () {
                            //    if (options.autoPrint != false) {
                            //        var body = popupWin.$("body");
                            //        popupWin.html2canvas(body[0], {
                            //            onrendered: function (canvas) {
                            //                popupWin.document.getElementById("canvas").appendChild(canvas);
                            //
                            //                popupWin.setTimeout(function () {
                            //                    body.find("div:first-child").hide();
                            //                    popupWin.print();
                            //                }, 500);
                            //            }
                            //        });
                            //    }
                            //};
                        }, 100);

                    });
                }
            };
        }])

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