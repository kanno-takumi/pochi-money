import sql from '@/app/lib/db';

export async function getDashboardData(userId: string) {
  try {
    // 1. 目標金額を取得
    const settings = await sql`
      SELECT value FROM settings 
      WHERE key = 'target_budget' AND user_id = ${userId}
    `;

    let target: number;

    // データがない場合の処理をより確実に
    if (!settings || settings.length === 0) {
      // 初回アクセス時にDBにレコードを作成
      await sql`
        INSERT INTO settings (key, value, user_id)
        VALUES ('target_budget', 30000, ${userId})
        ON CONFLICT (key, user_id) DO NOTHING
      `;
      target = 30000;
    } else {
      target = Number(settings[0].value);
    }

    // 2. そのユーザーの「使った額（出費）」の全記録を取得
    const records = await sql`
      SELECT id, amount, item, date 
      FROM records 
      WHERE user_id = ${userId}
      ORDER BY date DESC, id DESC
    `;

    // 金額(amount)が文字列で返ってくる場合があるため、数値に変換しておく
    const formattedRecords = records.map(r => ({
      ...r,
      amount: Number(r.amount)
    }));

    return { target, records: formattedRecords };

  } catch (error) {
    console.error('Database Error:', error);
    // 最悪の事態でもアプリを止めないための初期値
    return { target: 10000, records: [] };
  }
}