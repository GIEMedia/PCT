using System;

namespace PCT.Declarations.Interfaces
{
    public interface IEmailGenerationService
    {
        string ForgotPassword(string username, bool management, bool textOnly);

        string ManagerNotification(string name, string courseTitle, Guid certificateID);

        string ReviewCourse(string name, string email, Guid courseID, string courseTitle);
    }
}