import Header from "@/components/Header";
import SavingCard from "@/components/SavingCard";
import RecordForm from "@/components/RecordForm";
import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import { updateTarget } from "@/app/actions";

// --- サーバーサイド関数 ---

async function getSavingsData() {
  const filePath = path.join(process.cwd(), "data", "savings.json");
  const jsonData = await fs.readFile(filePath, "utf-8");
  return JSON.parse(jsonData);
}

function getStartOfThisWeek() {
  const now = new Date();
  const day = now.getDay(); 
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export default async function Dashboard({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const data = await getSavingsData();

  

  // 2. 計算ロジック
  const weeklyBudget = data.target; 
  const dailyBudget = Math.floor(weeklyBudget / 7); 
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const startOfWeek = getStartOfThisWeek();

  const weeklyRecords = data.records.filter((r: any) => {
    const recordDate = new Date(r.date);
    return recordDate >= startOfWeek;
  });

  const actualSpentToday = weeklyRecords
    .filter((r: any) => r.date === todayStr)
    .reduce((sum: number, r: any) => sum + r.amount, 0);

  const actualSpentWeek = weeklyRecords.reduce((sum: number, r: any) => sum + r.amount, 0);

  const remainingWeekly = weeklyBudget - actualSpentWeek;
  const remainingToday = dailyBudget - actualSpentToday;

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      <Header 
        userImageUrl="/trophy.png" 
        linkUrl={`/ranking/${id}`} 
      />

      <main className="max-w-md mx-auto p-6 pb-24 w-full">
        {/* 目標金額の設定セクション */}
        <div className="mb-8 text-center">
          <h2 className="text-xl font-black text-gray-800 mb-1">あなたの節約</h2>
          
          <form action={updateTarget} className="mt-3 flex flex-col items-center gap-2">
            <div className="flex items-center bg-white border border-orange-200 rounded-full px-4 py-1.5 shadow-sm">
              <span className="text-gray-500 text-xs font-bold mr-2">今週の目標:</span>
              <input 
                name="targetAmount"
                type="number"
                defaultValue={weeklyBudget}
                className="w-20 bg-transparent text-orange-600 font-bold focus:outline-none text-sm"
              />
              <span className="text-gray-500 text-xs mr-2">円</span>
              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full transition-colors"
              >
                変更
              </button>
            </div>
          </form>
        </div>

        {/* 予算表示カード */}
        <div className="space-y-4">
          <SavingCard 
            label="今日の残り枠" 
            amount={remainingToday} 
          />
          <SavingCard 
            label="今週の残り枠" 
            amount={remainingWeekly} 
          />
        </div>

        {/* 記録フォーム */}
        <section className="mt-10">
          <h2 className="text-sm font-bold text-gray-400 mb-3 ml-1 uppercase tracking-wider">
            節約を記録する
          </h2>
          <RecordForm />
        </section>
      </main>
    </div>
  );
}