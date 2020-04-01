ALTER TABLE users ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT current_timestamp(3);
ALTER TABLE users ADD COLUMN "lastLoginAt" TIMESTAMP(3) NOT NULL DEFAULT current_timestamp(3);
