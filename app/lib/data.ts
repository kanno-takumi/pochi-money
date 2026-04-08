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
        VALUES ('target_budget', 10000, ${userId})
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

export async function getRankingData() {
  try {
    // 1. 全ユーザーの目標設定と出費記録を取得
    const [allSettings, allRecords] = await Promise.all([
      sql`SELECT user_id, value FROM settings WHERE key = 'target_budget'`,
      sql`SELECT user_id, amount FROM records`
    ]);

    // 2. ユーザーごとにデータを集計
    const userStats = allSettings.map((setting) => {
      const userId = setting.user_id;
      const target = Number(setting.value);
      
      // そのユーザーの出費を合計
      const totalSpent = allRecords
        .filter((r) => r.user_id === userId)
        .reduce((sum, r) => sum + Number(r.amount), 0);

      const savings = target - totalSpent;

      return {
        userId,
        target,
        totalSpent,
        savings,
      };
    });

    // 3. 節約額（savings）が大きい順にソート
    return userStats.sort((a, b) => b.savings - a.savings);
  } catch (error) {
    console.error('Ranking Error:', error);
    return [];
  }
}