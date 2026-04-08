import sql from '@/app/lib/db';

export async function getDashboardData(userId: string) {
  try {
    // 1. 目標金額を取得
    let settings = await sql`
      SELECT value FROM settings 
      WHERE key = 'target_budget' AND user_id = ${userId}
    `;

    // --- 💡 初めてのユーザーなら初期設定をDBに作成する ---
    if (settings.length === 0) {
      await sql`
        INSERT INTO settings (key, value, user_id)
        VALUES ('target_budget', 30000, ${userId})
      `;
      // settings を初期値で上書き
      settings = [{ value: 30000 }];
    }

    const target = settings[0].value;

    // 2. そのユーザーの節約記録を取得
    const records = await sql`
      SELECT id, amount, item, date 
      FROM records 
      WHERE user_id = ${userId}
      ORDER BY date DESC, id DESC
    `;

    return { target, records };
  } catch (error) {
    console.error('Database Error:', error);
    // エラー時はフォールバックデータを返す
    return { target: 30000, records: [] };
  }
}