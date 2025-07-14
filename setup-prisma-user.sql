-- Create a dedicated user for Prisma
-- Run this in your Supabase SQL Editor

-- Create user with a secure password
CREATE USER prisma WITH PASSWORD 'H1nz9xpk3!_prisma';

-- Grant necessary privileges
GRANT USAGE ON SCHEMA public TO prisma;
GRANT CREATE ON SCHEMA public TO prisma;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO prisma;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO prisma;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO prisma;

-- Grant default privileges for future objects
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO prisma;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO prisma;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO prisma;