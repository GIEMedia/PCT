namespace PCT.Declarations.Models
{
    public abstract class questioned<TQuestion>
        where TQuestion : question_base
    {
        public string title { get; set; }

        public TQuestion[] questions { get; set; }
    }
}