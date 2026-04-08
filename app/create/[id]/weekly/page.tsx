import sql from "@/app/lib/db";
import Header from "@/components/Header";

// 週の開始日（月曜日）を計算する関数
function getStartOfThisWeek() {
  const now = new Date();
  const day = now.getDay(); 
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default async function WeeklyRecords({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const startOfWeek = getStartOfThisWeek();

  // 月曜日以降のデータをすべて取得
  const records = await sql`
    SELECT * FROM records 
    WHERE user_id = ${id} AND date >= ${startOfWeek.toISOString()}
    ORDER BY date DESC, id DESC
  `;

  return (
    <div className="min-h-screen bg-orange-50/30 pb-10">
      <Header userImageUrl="/star.jpg" linkUrl={`/create/${id}`} />
      
      <main className="max-w-md mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-xl font-black text-gray-800">📅 今週の記録一覧</h2>
          <p className="text-xs text-gray-400 mt-1">月曜日からの全履歴</p>
        </div>

        <div className="space-y-3">
          {records.map((r: any) => {
            const date = new Date(r.date);
            const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
            
            return (
              <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between items-center border border-orange-50">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-700">{r.item}</span>
                  <span className="text-[10px] text-gray-400 font-medium bg-gray-50 px-2 py-0.5 rounded w-fit">
                    {dateLabel}
                  </span>
                </div>
                <span className="font-black text-orange-600">-{Number(r.amount).toLocaleString()}円</span>
              </div>
            );
          })}

          {records.length === 0 && (
            <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-orange-100">
              <p className="text-gray-400 text-sm italic">今週の記録はまだありません</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}