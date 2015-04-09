using System;

namespace PST.Declarations.Interfaces
{
    public interface IEmailGenerationService
    {
        string ForgotPassword(string username, bool management, bool textOnly);

        string ReviewCourse(string name, string email, Guid courseID, string courseTitle);
    }
}