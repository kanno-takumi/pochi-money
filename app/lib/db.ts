import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL が設定されていません。vercel env pull を実行しましたか？');
}

// データベース接続用のクライアントを作成
// Neonを使う場合は SSL: 'require' が必須です
const sql = postgres(connectionString, { ssl: 'require' });

export default sql;