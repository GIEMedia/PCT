require("./node-cs")({
    apiHost: "pct.prototype1.io",
    startPoints: [
        {
            file: "Views/Shared/_Layout.cshtml",
            replaces: [
                {
                    from: "@MvcApplication.HtmlVersion",
                    to: "dev"
                },
                {
                    from: "@MvcApplication.IdleDurationSecs",
                    to: "300"
                }
            ]
        },
        {
            file: "Areas/Management/Views/Shared/_Layout.cshtml",
            url : "/Management"
        }
    ],
    injectJs: [
        {
            bundleFile: "App_Start/BundleConfig.cs",
            dir: "app/spa",
            injectName: "front-end"
        },
        {
            bundleFile: "App_Start/BundleConfig.cs",
            dir: "Areas/Management/app/spa",
            injectName: "back-end"
        }
    ]
}).start();

require("node-common/compiler/sass")({
    from: "app/scss/style.scss",
    into: "app/css/style.css",
    watches: ["app/**/*.scss"]
});

require("node-common/compiler/sass")({
    from: "Areas/Management/app/scss/style.scss",
    into: "Areas/Management/app/css/style.css",
    watches: ["Areas/Management/app/**/*.scss"]
});

//compileScss: [
//    {
//        from: "app/scss/style.scss",
//        to: "app/css/style.css",
//        watches: ["app/scss"],
//        appScss: "app/spa"
//    },
//    {
//        from: "Areas/Management/app/scss/style.scss",
//        to: "Areas/Management/app/css/style.css",
//        watches: ["Areas/Management/app/scss"],
//        appScss: "Areas/Management/app/spa"
//    }
//],