import sql from "@/app/lib/db";
import Header from "@/components/Header";

// 今日の開始（0時0分）を計算する関数
function getStartOfToday() {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
}

export default async function DailyRecords({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startOfToday = getStartOfToday();

  // 今日（00:00以降）のデータを取得
  const records = await sql`
    SELECT * FROM records 
    WHERE user_id = ${id} AND date >= ${startOfToday.toISOString()}
    ORDER BY id DESC
  `;

  return (
    <div className="min-h-screen bg-orange-50/30 pb-10">
      <Header userImageUrl="/people.png" linkUrl={`/create/${id}`} />
      
      <main className="max-w-md mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-800">📋 今日の記録</h2>
          <p className="text-xs text-gray-400 mt-1">本日使ったお金の履歴</p>
        </div>

        <div className="space-y-3">
          {records.length > 0 ? (
            records.map((r: any) => (
              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-orange-50">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700">{r.item}</span>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded w-fit">
                    今日
                  </span>
                </div>
                <span className="font-black text-orange-600">-{Number(r.amount).toLocaleString()}円</span>
              </div>
            ))
          ) : (
            /* 💡 データがない場合の表示 */
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-orange-100">
              <p className="text-gray-400 text-sm italic">今日の記録はまだありません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}