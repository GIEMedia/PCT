namespace PST.Declarations.Models.Management
{
    public class m_validation_error
    {
        public m_validation_error()
        {
        }

        public m_validation_error(Severity severity, string message, params object[] args)
        {
            this.severity = severity;
            this.message = string.Format(message, args);
        }

        public Severity severity { get; set; }

        public string message { get; set; }
    }
}