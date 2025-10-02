import db from '../db';

export class PostsService {
  async createPost(postData: any) {
    const { userId, content, mediaUrls, mediaType } = postData;
    const query = `
      INSERT INTO posts (user_id, content, media_urls, media_type)
      VALUES ($1, $2, $3, $4)
      RETURNING id, content, created_at;
    `;
    const values = [userId, content, mediaUrls, mediaType];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async getFeedPosts() {
    // For now, this gets all posts. Later, we'll make this a real feed.
    const query = `
      SELECT
        p.id,
        p.content,
        p.media_urls,
        p.media_type,
        p.created_at,
        u.id as user_id,
        pr.full_name,
        pr.avatar_url
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN profiles pr ON p.user_id = pr.id
      ORDER BY p.created_at DESC
      LIMIT 50;
    `;
    const result = await db.query(query);
    return result.rows;
  }
}