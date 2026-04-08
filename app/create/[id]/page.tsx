import Header from "@/components/Header";
import SavingCard from "@/components/SavingCard"; // 💡 内部で画像表示するようになった
import RecordForm from "@/components/RecordForm";
import sql from "@/app/lib/db";
import { updateTarget } from "@/app/actions";

// --- サーバーサイド関数 ---
function getStartOfThisWeek() {
  const now = new Date();
  const day = now.getDay(); 
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default async function Dashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. データベースからデータを取得
  const settings = await sql`
    SELECT value FROM settings 
    WHERE key = 'target_budget' AND user_id = ${id}
  `;
  const s = settings[0];
  const weeklyBudget = s?.value || 10000;

  const startOfWeek = getStartOfThisWeek();
  const weeklyRecords = await sql`
    SELECT * FROM records WHERE user_id = ${id} AND date >= ${startOfWeek.toISOString()}
  `;

  // 2. 計算ロジック
  const dailyBudget = Math.floor(weeklyBudget / 7); 
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const actualSpentToday = weeklyRecords
    .filter((r: any) => (r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date) === todayStr)
    .reduce((sum: number, r: any) => sum + r.amount, 0);

  const actualSpentWeek = weeklyRecords.reduce((sum: number, r: any) => sum + Number(r.amount), 0);

  const remainingWeekly = weeklyBudget - actualSpentWeek;
  const remainingToday = dailyBudget - actualSpentToday;

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      <Header 
        userImageUrl="/trophy.png" 
        linkUrl={`/ranking/${id}`} 
      />

      <main className="max-w-md mx-auto p-6 pb-24 w-full">
        {/* 目標金額設定セクション */}
        <div className="mb-8 text-center flex flex-col items-center gap-4">
          <h2 className="text-xl font-black text-gray-800 mb-1">あなたの節約</h2>
          
          <form 
            action={updateTarget.bind(null, id)} 
            className="w-full max-w-[340px]"
          >
            <div className="flex items-center bg-white border border-orange-200 rounded-full px-5 py-2 shadow-sm">
              <span className="text-gray-500 text-xs font-bold mr-3 whitespace-nowrap">今週の目標:</span>
              <input 
                name="targetAmount"
                type="number"
                defaultValue={weeklyBudget}
                className="flex-1 bg-transparent text-orange-600 font-bold focus:outline-none text-sm min-w-0"
              />
              <span className="text-gray-500 text-xs mr-3 font-bold">円</span>
              <button 
                type="submit"
                className="bg-orange-500 text-white text-[10px] font-bold px-4 py-1.5 rounded-full"
              >
                変更
              </button>
            </div>
          </form>
        </div>

        {/* 💡 SavingCardの中に画像が入った状態で表示 */}
        <div className="flex flex-col gap-4 w-full px-2">
          <SavingCard 
            label="今日の残り枠" 
            amount={remainingToday} 
            href={`/create/${id}/today`}
          />
          <SavingCard 
            label="今週の残り枠" 
            amount={remainingWeekly} 
            href={`/create/${id}/weekly`}
          />
        </div>

        <section className="mt-10">
          <h2 className="text-sm font-bold text-gray-400 mb-3 ml-1 uppercase tracking-wider text-center">
            使った額を記録する
          </h2>
          <RecordForm userId={id} />
        </section>
      </main>
    </div>
  );
}