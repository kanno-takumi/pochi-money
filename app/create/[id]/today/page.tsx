import sql from "@/app/lib/db";
import Header from "@/components/Header";

export default async function TodayRecords({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const todayStr = new Date().toISOString().split('T')[0];

  const records = await sql`
    SELECT * FROM records 
    WHERE user_id = ${id} AND date::text LIKE ${todayStr + '%'}
    ORDER BY id DESC
  `;

  return (
    <div className="min-h-screen bg-orange-50/30">
      <Header userImageUrl="/star.jpg" linkUrl={`/create/${id}`} />
      <main className="max-w-md mx-auto p-6">
        <h2 className="text-xl font-black text-gray-800 mb-6">☀️ 今日の記録一覧</h2>
        <div className="space-y-3">
          {records.map((r: any) => (
            <div key={r.id} className="bg-white p-4 rounded-2xl shadow-sm flex justify-between">
              <span className="font-bold text-gray-700">{r.item}</span>
              <span className="font-black text-orange-600">-{r.amount}円</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}