import React from 'react';
import Header from "@/components/Header";
import sql from '@/app/lib/db';

export default async function RankingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // 1. 全ユーザーの目標設定（名前も含む）と出費データを取得
  const [settings, records] = await Promise.all([
    // 💡 user_name も取得するように追加
    sql`SELECT user_id, user_name, value FROM settings WHERE key = 'target_budget'`,
    sql`SELECT user_id, amount FROM records`
  ]);

  // 2. ユーザーごとに節約額を計算してランキングを作成
  const rankingData = settings.map((s) => {
    const userId = s.user_id;
    const userName = s.user_name || "ななしさん"; // 💡 名前を表示用に使用
    const target = Number(s.value);
    
    // そのユーザーの合計利用額
    const totalSpent = records
      .filter((r) => r.user_id === userId)
      .reduce((sum, r) => sum + Number(r.amount), 0);
    
    const count = records.filter((r) => r.user_id === userId).length;

    return {
      userId,
      userName, // 💡 オブジェクトに名前を追加
      amount: target - totalSpent,
      count,
      avatar: userId === id ? '✨' : '👤',
    };
  });

  // 3. 節約額が多い順に並び替え
  const sortedRanking = rankingData.sort((a, b) => b.amount - a.amount);

  return (
    <div className="min-h-screen bg-orange-50/30">
      <Header 
        userImageUrl="/people.png" 
        linkUrl={`/create/${id}`} 
      />

      <main className="max-w-md mx-auto p-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-gray-800 flex items-center justify-center gap-2">
            <span>🏆</span> 節約ランキング
          </h2>
          <p className="text-sm text-gray-500 mt-1">みんなの節約実績（目標 - 利用額）</p>
        </div>

        <div className="space-y-4">
          {sortedRanking.map((user, index) => (
            <div 
              key={user.userId} 
              className={`bg-white rounded-2xl p-5 flex items-center shadow-sm border transition-all ${
                user.userId === id 
                  ? 'border-orange-500 ring-2 ring-orange-200 scale-[1.02]' 
                  : 'border-orange-100'
              }`}
            >
              {/* 順位バッジ */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black mr-4 shadow-sm ${
                index === 0 ? 'bg-yellow-400 text-white' : 
                index === 1 ? 'bg-slate-300 text-white' : 
                index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>

              {/* アイコン */}
              <div className="text-2xl mr-3 bg-gray-50 p-2 rounded-xl">
                {user.avatar}
              </div>

              {/* ユーザー名 */}
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg">
                  {/* 💡 user.userId ではなく user.userName を表示 */}
                  {user.userName} {user.userId === id && "(あなた)"}
                </p>
              </div>

              {/* 節約額 */}
              <div className="text-right">
                <p className={`font-black text-xl ${user.amount >= 0 ? 'text-orange-600' : 'text-red-500'}`}>
                  {user.amount.toLocaleString()}<span className="text-xs ml-0.5">円</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}