namespace ArcgisHub.Server.models
{
    public class UsersModels
    {
        public int Id { get; set; }
        public string userName { get; set; } = null!;
        public string password_hash { get; set; } = null!;
        public string password_salt { get; set; } = null!;
        public string rol { get; set; } = null!;
        public string team { get; set; } = null!;
    }
}
