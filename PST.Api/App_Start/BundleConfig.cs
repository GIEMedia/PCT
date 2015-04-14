using System.Web;
using System.Web.Optimization;

namespace PST.Api
{
    public class BundleConfig
    {
        public static void RegisterBundles(BundleCollection bundles)
        {
            BundleTable.EnableOptimizations =
                !HttpContext.Current.IsDebuggingEnabled
                || System.Configuration.ConfigurationManager.AppSettings["OnServer"] == "true";

            bundles.UseCdn = false;

            var cssFrontEnd = new StyleBundle("~/bundles/css/site.css");
            cssFrontEnd.Include(
                "~/app/css/fonts/font-awesome.min.css",
                "~/app/css/magnific-popup.css",
                "~/app/css/jquery.fs.selecter.css",
                "~/app/css/tooltipster.css",
                "~/app/css/style.css",
                "~/app/css/responsive.css"
                );
            bundles.Add(cssFrontEnd);

            var cssManagement = new StyleBundle("~/bundles/css/management.css");
            cssManagement.Include(
                "~/app/css/fonts/font-awesome.min.css",
                "~/Areas/Management/app/css/fonts/icomoon.css",
                "~/Areas/Management/app/css/selectboxit.css",
                "~/Areas/Management/app/css/jquery.fancybox.css",
                "~/Areas/Management/app/css/style.css"
                );
            bundles.Add(cssManagement);

            var jsLib = new ScriptBundle("~/bundles/js/lib.js");
            jsLib.Include(
                "~/app/js/jquery-1.11.2.min.js",
                "~/app/js/angular_1.3.1/angular.js",
                "~/app/js/angular_1.3.1/angular-resource.min.js",
                "~/app/js/angular_1.3.1/angular-sanitize.min.js",
                "~/app/js/angular_1.3.1/angular-animate.min.js",
                "~/app/js/angular-ui-router.min.js",
                "~/app/js/common-utils.js",
                "~/Areas/Management/app/spa/security/SecurityService.js"
                );
            bundles.Add(jsLib);

            var jsFrontEnd = new ScriptBundle("~/bundles/js/site.js");
            jsFrontEnd.Include(
                "~/app/js/jquery.fs.selecter.min.js",
                "~/app/js/jquery.magnific-popup.min.js",
                "~/app/js/jquery.nicescroll.min.js",
                "~/app/js/jquery.tooltipster.min.js",
                "~/app/js/jquery.panzoom.min.js",
                "~/app/spa/api/AccountService.js",
                "~/app/spa/api/CertificateData.js",
                "~/app/spa/api/CertificateService.js",
                "~/app/spa/api/CourseService.js",
                "~/app/spa/api/ForgotpasswordService.js",
                "~/app/spa/api/ManagerService.js",
                "~/app/spa/api/StateLicensureService.js",
                "~/app/spa/api/StateService.js",
                "~/app/spa/api/TestService.js",
                "~/app/spa/app.js",
                "~/app/spa/authen/authen.js",
                "~/app/spa/authen/UserInfo.js",
                "~/app/spa/certificates/Certificates.js",
                "~/app/spa/common/Markup.js",
                "~/app/spa/course/Course.js",
                "~/app/spa/course/CourseControls.js",
                "~/app/spa/course/CourseQuestion.js",
                "~/app/spa/course/CourseQuestionsContainer.js",
                "~/app/spa/course/CourseSectionSlider.js",
                "~/app/spa/dashboard/Dashboard.js",
                "~/app/spa/forgotpassword/Forgotpassword.js",
                "~/app/spa/landing/Landing.js",
                "~/app/spa/landing/Signup.js",
                "~/app/spa/local/PreferenceService.js",
                "~/app/spa/profile/Profile.js",
                "~/app/spa/test/certificate/Certificate.js",
                "~/app/spa/test/licensures/SubmitCEU.js",
                "~/app/spa/test/Test.js",
                "~/app/spa/test/TestQuestionsContainer.js",
                "~/app/spa/theme.js",
                "~/app/spa/layout/ErrorContainer.js",
                "~/app/spa/layout/Layout.js"
                );
            bundles.Add(jsFrontEnd);

            var jsManagement = new ScriptBundle("~/bundles/js/management.js");
            jsManagement.Include(
                "~/Areas/Management/app/js/jquery-ui-1.11.4.min.js",
                "~/Areas/Management/app/js/selectboxit.js",
                "~/Areas/Management/app/js/jquery.fancybox.pack.js",
                "~/Areas/Management/app/js/jquery.numeric.js",
                "~/Areas/Management/app/js/moment.min.js",
                "~/app/js/jquery-textrange.js",
                "~/Areas/Management/app/js/angular-file-upload/angular-file-upload-shim.min.js",
                "~/Areas/Management/app/js/angular-file-upload/angular-file-upload.min.js",
                "~/Areas/Management/app/spa/api/CategoryService.js",
                "~/Areas/Management/app/spa/api/CourseService.js",
                "~/Areas/Management/app/spa/api/QuestionService.js",
                "~/Areas/Management/app/spa/api/ReportService.js",
                "~/Areas/Management/app/spa/api/SectionService.js",
                "~/Areas/Management/app/spa/api/StateService.js",
                "~/Areas/Management/app/spa/api/UserService.js",
                "~/Areas/Management/app/spa/app.js",
                "~/Areas/Management/app/spa/common/Fancybox.js",
                "~/Areas/Management/app/spa/common/Markup.js",
                "~/Areas/Management/app/spa/common/Sorter.js",
                "~/Areas/Management/app/spa/common/Theme.js",
                "~/Areas/Management/app/spa/courses/Courses.js",
                "~/Areas/Management/app/spa/course_edit/CourseEdit.js",
                "~/Areas/Management/app/spa/course_edit/information/Information.js",
                "~/Areas/Management/app/spa/course_edit/information/InformationCategories.js",
                "~/Areas/Management/app/spa/course_edit/information/InformationStates.js",
                "~/Areas/Management/app/spa/course_edit/publish/Publish.js",
                "~/Areas/Management/app/spa/course_edit/questions/Questions.js",
                "~/Areas/Management/app/spa/course_edit/review_invite/ReviewInvite.js",
                "~/Areas/Management/app/spa/course_edit/sections/detail/SectionsDetail.js",
                "~/Areas/Management/app/spa/course_edit/sections/list/SectionsList.js",
                "~/Areas/Management/app/spa/course_edit/sections/Sections.js",
                "~/Areas/Management/app/spa/course_edit/test/Test.js",
                "~/Areas/Management/app/spa/layout/Layout.js",
                "~/Areas/Management/app/spa/login/Login.js",
                "~/Areas/Management/app/spa/report/Report.js",
                "~/Areas/Management/app/spa/report/ReportDetail.js",
                "~/Areas/Management/app/spa/report/ReportList.js",
                "~/Areas/Management/app/spa/settings/Settings.js",
                "~/Areas/Management/app/spa/settings/Manufaturers.js"
                "~/Areas/Management/app/spa/settings/Categories.js"
                "~/Areas/Management/app/spa/user/User.js",
                "~/Areas/Management/app/spa/user/UserDetail.js",
                "~/Areas/Management/app/spa/user/UserList.js"
                );
            bundles.Add(jsManagement);
        }
    }
}