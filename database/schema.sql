-- Create custom types for roles and privacy settings
CREATE TYPE community_role AS ENUM ('admin', 'moderator', 'member');
CREATE TYPE community_privacy AS ENUM ('public', 'private');

-- User Profiles Table
CREATE TABLE "profiles" (
  "id" uuid NOT NULL PRIMARY KEY, -- This will be the same as the auth user ID
  "username" text UNIQUE NOT NULL,
  "full_name" text,
  "avatar_url" text,
  "banner_url" text,
  "bio" text,
  "created_at" timestamptz DEFAULT now(),
  CONSTRAINT "username_length" CHECK (char_length(username) >= 3)
);

-- User Follows (Social Graph)
CREATE TABLE "follows" (
  "follower_id" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "following_id" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "created_at" timestamptz DEFAULT now(),
  PRIMARY KEY ("follower_id", "following_id")
);

-- Communities Table
CREATE TABLE "communities" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "creator_id" uuid NOT NULL REFERENCES "profiles"(id),
  "name" text NOT NULL,
  "description" text,
  "icon_url" text,
  "privacy" community_privacy DEFAULT 'public',
  "created_at" timestamptz DEFAULT now()
);

-- Community Members Table
CREATE TABLE "community_members" (
  "community_id" uuid NOT NULL REFERENCES "communities"(id) ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "role" community_role DEFAULT 'member',
  "joined_at" timestamptz DEFAULT now(),
  PRIMARY KEY ("community_id", "user_id")
);

-- Posts Table (for text, images, and videos)
CREATE TABLE "posts" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "user_id" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "community_id" uuid REFERENCES "communities"(id) ON DELETE SET NULL, -- A post can belong to a community or be public
  "content" text,
  "media_urls" text[], -- Array of URLs for images or videos from Cloudinary
  "media_type" text CHECK (media_type IN ('image', 'video')),
  "created_at" timestamptz DEFAULT now()
);

-- Post Likes
CREATE TABLE "post_likes" (
  "post_id" uuid NOT NULL REFERENCES "posts"(id) ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "created_at" timestamptz DEFAULT now(),
  PRIMARY KEY ("post_id", "user_id")
);

-- Post Comments
CREATE TABLE "post_comments" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  "post_id" uuid NOT NULL REFERENCES "posts"(id) ON DELETE CASCADE,
  "user_id" uuid NOT NULL REFERENCES "profiles"(id) ON DELETE CASCADE,
  "parent_comment_id" uuid REFERENCES "post_comments"(id) ON DELETE CASCADE, -- For threaded replies
  "content" text NOT NULL,
  "created_at" timestamptz DEFAULT now()
);