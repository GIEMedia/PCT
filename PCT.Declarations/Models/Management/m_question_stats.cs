namespace PCT.Declarations.Models.Management
{
    public class m_question_stat : stat
    {
        public string question { get; set; }

        public m_option_stat[] options { get; set; }
    }

    public class m_option_stat : stat
    {
        public string text { get; set; }

        public string image { get; set; }

        public bool correct { get; set; }
    }

    public abstract class stat
    {
        public decimal first_attempt { get; set; }

        public decimal second_attempt { get; set; }

        public decimal third_attempt { get; set; }
    }
}