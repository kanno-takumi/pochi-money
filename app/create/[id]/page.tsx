import Header from "@/components/Header";
import SavingCard from "@/components/SavingCard";
import RecordForm from "@/components/RecordForm";
import sql from "@/app/lib/db";
import { updateTarget, updateWishList } from "@/app/actions"; // 💡 updateWishListを追加

// --- サーバーサイド関数 ---
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

  // 1. データベースからデータを取得
  // wish_item と wish_price も一緒に取得
  const settings = await sql`
    SELECT value, wish_item, wish_price FROM settings 
    WHERE key = 'target_budget' AND user_id = ${id}
  `;
  const s = settings[0];
  const weeklyBudget = s?.value || 10000;
  const wishItem = s?.wish_item || "";    // 💡 取得
  const wishPrice = s?.wish_price || 0;   // 💡 取得

  const startOfWeek = getStartOfThisWeek();
  const weeklyRecords = await sql`
    SELECT * FROM records 
    WHERE user_id = ${id} AND date >= ${startOfWeek.toISOString()}
  `;

  // 2. 計算ロジック
  const dailyBudget = Math.floor(weeklyBudget / 7); 
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];

  const actualSpentToday = weeklyRecords
    .filter((r: any) => {
      const rDate = r.date instanceof Date ? r.date.toISOString().split('T')[0] : r.date;
      return rDate === todayStr;
    })
    .reduce((sum: number, r: any) => sum + r.amount, 0);

  const actualSpentWeek = weeklyRecords.reduce((sum: number, r: any) => sum + Number(r.amount), 0);

  const remainingWeekly = weeklyBudget - actualSpentWeek;
  const remainingToday = dailyBudget - actualSpentToday;

  // 💡 「あといくら節約が必要か」の計算
  // 今週の節約額 = 予算 - 実支出
  const currentSavings = weeklyBudget - actualSpentWeek;
  const neededAmount = wishPrice - currentSavings;
// --- 前半のロジック部分は変更なし ---

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      <Header 
        userImageUrl="/trophy.png" 
        linkUrl={`/ranking/${id}`} 
      />

      <main className="max-w-md mx-auto p-6 pb-24 w-full">
        {/* 目標金額・欲しいもの設定セクション */}
        <div className="mb-8 text-center flex flex-col items-center gap-4">
          <h2 className="text-xl font-black text-gray-800 mb-1">あなたの節約</h2>
          
          {/* 💡 共通の幅（w-full max-w-[340px]）を適用 */}
          
          {/* 今週の目標設定フォーム */}
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
                className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                変更
              </button>
            </div>
          </form>

          {/* 欲しいもの設定フォーム（幅を目標フォームと統一）
          <form 
            action={updateWishList.bind(null, id)} 
            className="w-full max-w-[340px]"
          >
            <div className="flex items-center bg-white border border-orange-200 rounded-full px-5 py-2 shadow-sm">
              <span className="text-gray-500 text-xs font-bold mr-3 whitespace-nowrap">欲しいもの:</span>
              <input 
                name="wishItem"
                type="text"
                defaultValue={wishItem}
                placeholder="品名"
                className="flex-1 bg-transparent text-orange-600 font-bold focus:outline-none text-sm min-w-0"
              />
              <input 
                name="wishPrice"
                type="number"
                defaultValue={wishPrice}
                placeholder="金額"
                className="w-20 bg-transparent text-orange-600 font-bold focus:outline-none text-sm text-right"
              />
              <span className="text-gray-500 text-xs mr-3 font-bold">円</span>
              <button 
                type="submit"
                className="bg-orange-500 hover:bg-orange-600 text-white text-[10px] font-bold px-4 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                登録
              </button>
            </div>
          </form> */}
        </div>

        {/* --- 💡 修正：「あといくら？」の可視化カードをシンプルに --- */}
        {/*
        {wishPrice > 0 && (
          <div className="mb-6 px-2">
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100 flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 text-xs font-bold">
                  🛍️ {wishItem || "目標"} まで
                </span>
                <span className="text-orange-600 font-extrabold text-base">
                  あと {Math.max(0, neededAmount).toLocaleString()} 円
                </span>
              </div>
              
            
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-400 h-full transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, (currentSavings / wishPrice) * 100))}%` }}
                />
              </div>
            </div>
          </div>
        )}
        */}

        {/* --- 以下のSavingCardやRecordFormはそのまま --- */}
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
          <h2 className="text-sm font-bold text-gray-400 mb-3 ml-1 uppercase tracking-wider">
            使った額を記録する
          </h2>
          <RecordForm userId={id} />
        </section>
      </main>
    </div>
  );
}