import React from 'react';
import Header from "@/components/Header";
import Link from "next/link";

export default async function RankingPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  // 1. URLから現在のIDを取得 (例: b49bcjwc)
  const { id } = await params;

  const MOCK_RANKING = [
    { id: '1', name: 'たろう', amount: 45000, count: 12, avatar: '👤' },
    { id: '2', name: 'はなこ', amount: 32000, count: 8, avatar: '👩' },
    { id: '3', name: 'じろう', amount: 15800, count: 5, avatar: '🧒' },
  ];

  const maxAmount = Math.max(...MOCK_RANKING.map(user => user.amount));

  return (
    <div className="min-h-screen bg-orange-50/30">
      {/* 2. Headerのリンク先を /create/[id] に設定 */}
      {/* これで右上の星 (star.jpg) を押すとホームに戻れます */}
      <Header 
        userImageUrl="/star.jpg" 
        linkUrl={`/create/${id}`} 
      />

      <main className="max-w-md mx-auto p-6 pb-24">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-black text-gray-800 flex items-center justify-center gap-2">
            <span>🏆</span> 節約ランキング
          </h2>
          <p className="text-sm text-gray-500 mt-1">今週の節約実績トップ3</p>
        </div>

        <div className="space-y-4">
          {MOCK_RANKING.map((user, index) => (
            <div key={user.id} className="bg-white rounded-2xl p-5 flex items-center shadow-sm border border-orange-100 transition-transform active:scale-95">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black mr-4 shadow-sm ${
                index === 0 ? 'bg-yellow-400 text-white' : 
                index === 1 ? 'bg-slate-300 text-white' : 
                index === 2 ? 'bg-orange-300 text-white' : 'bg-gray-100 text-gray-400'
              }`}>
                {index + 1}
              </div>
              <div className="text-2xl mr-3 bg-gray-50 p-2 rounded-xl">{user.avatar}</div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg">{user.name}</p>
                <p className="text-xs text-gray-400">{user.count} 回のポチ記録</p>
              </div>
              <div className="text-right">
                <p className="font-black text-orange-600 text-xl">
                  {user.amount.toLocaleString()}<span className="text-xs ml-0.5">円</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 3. 下部ナビゲーションのホームボタンもID付きで設定 */}
      {/* <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-100 flex justify-around p-4 shadow-lg">
        <Link href={`/create/${id}`} className="text-center text-xs font-bold text-gray-400 flex flex-col items-center">
          <span className="text-xl">🏠</span>
          <span>ホーム</span>
        </Link>
        <div className="text-center text-xs font-bold text-orange-500 flex flex-col items-center">
          <span className="text-xl">🏆</span>
          <span>ランク</span>
        </div>
        <div className="text-center text-xs font-bold text-gray-400 flex flex-col items-center">
          <span className="text-xl">⚙️</span>
          <span>設定</span>
        </div>
      </nav> */}
    </div>
  );
}