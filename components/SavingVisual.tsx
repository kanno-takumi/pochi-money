"use client";

import React from "react";

const UNITS = [
  { id: "plain",    price: 10000, img: "/plain.png" },
  { id: "yakiniku",  price: 5000,  img: "/yakiniku.png" },
  { id: "curry",     price: 1000,  img: "/curry.png" },
  { id: "coffee",    price: 500,   img: "/coffee.png" },
  { id: "petbottle", price: 100,   img: "/petbottle.png" },
];

export default function SavingVisual({ amount }: { amount: number }) {
  // 100円未満なら何も表示しない
  if (amount < 100) return <div className="w-10 h-10" />; 

  // 💡 アルゴリズム：買える「最大単位」を1種類だけ見つける
  const unit = UNITS.find((u) => amount >= u.price);
  if (!unit) return <div className="w-10 h-10" />;

  // その単位で何個分か計算（画面に収まるよう最大10個程度に制限）
  const count = Math.floor(amount / unit.price);
  const displayCount = Math.min(count, 10); 

  return (
    <div className="flex -space-x-5 items-center justify-end pr-2 min-w-[60px]">
      {[...Array(displayCount)].map((_, i) => (
        <img
          key={i}
          src={unit.img}
          alt={unit.id}
          className="w-10 h-10 object-contain drop-shadow-md transition-transform hover:scale-110"
          style={{ zIndex: 10 - i }} // 重なり順を調整
          onError={(e) => (e.currentTarget.style.display = "none")}
        />
      ))}
      {count > 10 && (
        <span className="text-[10px] font-black text-orange-400 ml-6 whitespace-nowrap">
          +{count - 10}
        </span>
      )}
    </div>
  );
}