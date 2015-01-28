namespace PST.Declarations.Interfaces
{
    public interface IEmailGenerationService
    {
        string ForgotPassword(string username, bool management, bool textOnly);
    }
}