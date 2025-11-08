using System.Security.Cryptography;
using System.Text;

namespace PasswordHasher
{
    public static class PasswordHasher
    {
        // Creates a hashed version of the provided password along with a unique salt.
        // password: The plaintext password to be hashed.
        // passwordHash: Outputs the resulting password hash as a byte array.
        // passwordSalt: Outputs the unique salt used in hashing as a byte array
        public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using (var hmac = new HMACSHA512())
            {
                passwordSalt = hmac.Key;
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                passwordHash = hmac.ComputeHash(passwordBytes);
            }
        }

        // Verifies whether the provided password matches the stored hash using the stored salt.
        // password: The plaintext password to verify.
        // storedHash: The stored password hash to compare against.
        // storedSalt: The stored salt used during the original hashing process.
        // Return: True if the password is valid and matches the stored hash; otherwise,
        public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
        {
            using (var hmac = new HMACSHA512(storedSalt))
            {
                byte[] passwordBytes = Encoding.UTF8.GetBytes(password);
                byte[] computedHash = hmac.ComputeHash(passwordBytes);
                bool hashesMatch = computedHash.SequenceEqual(storedHash);
                return hashesMatch;
            }
        }
    }
}
