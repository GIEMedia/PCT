using System.ComponentModel.DataAnnotations;

namespace PCT.Api.Areas.Help.Models
{
    public class HelpLogin
    {
        [Required]
        [Display(Name = "Username")]
        public string Username { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "Password")]
        public string Password { get; set; }
    }
}