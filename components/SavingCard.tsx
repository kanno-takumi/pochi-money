"use client";

import Link from "next/link";

const UNITS = [
  { id: "plain",    price: 10000, img: "/plain.png" },
  { id: "yakiniku",  price: 5000,  img: "/yakiniku.png" },
  { id: "curry",     price: 1000,  img: "/curry.png" },
  { id: "coffee",    price: 500,   img: "/coffee.png" },
  { id: "petbottle", price: 100,   img: "/petbottle.png" },
];

interface SavingCardProps {
  label: string;
  amount: number;
  href: string;
}

export default function SavingCard({ label, amount, href }: SavingCardProps) {
  // 最大単位のアイテムを特定
  const unit = UNITS.find((u) => amount >= u.price);
  const count = unit ? Math.floor(amount / unit.price) : 0;
  const displayCount = Math.min(count, 5); 

  return (
    <Link href={href} className="block">
      <div className="bg-white p-5 rounded-[32px] shadow-sm border border-orange-100 flex items-center justify-between hover:bg-orange-50/50 transition-colors h-[90px]">
        
        {/* 左側：テキスト情報 */}
        <div className="flex flex-col justify-center min-w-[110px]">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
            {label}
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-2xl font-black tracking-tight ${amount < 0 ? "text-red-500" : "text-gray-800"}`}>
              {amount.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-gray-400">円</span>
          </div>
        </div>

        {/* 右側：画像表示 または 慰めメッセージ */}
        <div className="flex -space-x-6 items-center justify-end overflow-visible pr-1">
          {amount >= 100 ? (
            <>
              {unit && [...Array(displayCount)].map((_, i) => (
                <img
                  key={i}
                  src={unit.img}
                  alt={unit.id}
                  className="w-12 h-12 object-contain drop-shadow-md"
                  style={{ zIndex: 10 - i }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              ))}
              {count > 5 && (
                <span className="text-[11px] font-black text-orange-400 ml-8 whitespace-nowrap">
                  +{count - 5}
                </span>
              )}
            </>
          ) : amount >= 0 ? (
            /* 0円〜99円の時 */
            <span className="text-[11px] font-bold text-gray-300 italic">あと少し！</span>
          ) : (
            /* 0円未満（赤字）の時 💡 追加箇所 */
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-red-400 leading-tight">どんまい！</span>
              <span className="text-[12px] font-black text-red-500 tracking-tighter">次は節約がんばろ🔥</span>
            </div>
          )}
        </div>

      </div>
    </Link>
  );
}