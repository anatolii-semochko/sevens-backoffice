# Docker Secrets Configuration

This directory contains example files for Docker secrets configuration.

## Setup Instructions

1. Copy this directory to `secrets/` (without the `.example` suffix):
   ```bash
   cp -r docker/development/secrets.example docker/development/secrets
   ```

2. Replace the placeholder values in each file with your actual secrets:
   - `api_db_password` - Database password
   - `api_mailer_password` - Email service password
   - `backup_aws_secret_access_key` - AWS secret access key
   - `jwt_encryption_key` - JWT encryption key

3. Generate JWT keys:
   ```bash
   # Generate private key
   openssl genpkey -algorithm RSA -out api/config/jwt/private.pem -aes256 -pass pass:your_passphrase

   # Generate public key
   openssl pkey -in api/config/jwt/private.pem -out api/config/jwt/public.pem -pubout -passin pass:your_passphrase
   ```

## Security Note

Never commit the actual `secrets/` directory to version control. The `.gitignore` file is configured to exclude it.