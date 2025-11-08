using MySql.Data.MySqlClient;

namespace ReactJwt.Server.Models
{
    public class UsersContext
    {
        public string ConnectionString { get; set; } = null!;

        public UsersContext(string connectionString)
        {
            this.ConnectionString = connectionString;
            Console.WriteLine(this.ConnectionString);
        }

        private MySqlConnection GetConnection()
        {
            return new MySqlConnection(ConnectionString);
        }
    }
}
