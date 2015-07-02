namespace PCT.Declarations.Models
{
    public abstract class category
    {
        public string title { get; set; }
    }

    public class main_category : category
    {
        public sub_category[] categories { get; set; }
    }

    public class sub_category : category
    {
        public course_overview[] courses { get; set; }
    }
}