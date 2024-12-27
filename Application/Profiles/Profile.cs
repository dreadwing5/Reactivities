using System.ComponentModel.DataAnnotations;
using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }

        [Required]
        public string DisplayName { get; set; }
        public string Bio { get; set; }

        public string Image { get; set; }


        public bool Following { get; set; }

        public int FollowersCount { get; set; }

        public int FollowingCount { get; set; }


        public ICollection<Photo> Photos { get; set; }
    }
}