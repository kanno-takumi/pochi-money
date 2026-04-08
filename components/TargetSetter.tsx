"use client";

import { useState, useEffect } from "react";
import { updateTarget } from "@/app/actions";
import { useRouter } from "next/navigation";

// 💡 userId を Props に追加
export default function TargetSetter({ 
  initialTarget, 
  userId 
}: { 
  initialTarget: number, 
  userId: string 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialTarget);
  const router = useRouter();

  useEffect(() => {
    setValue(initialTarget);
  }, [initialTarget]);

  const handleSave = async () => {
    try {
      // 💡 userId を第1引数として渡す (actions.ts の定義に合わせる)
      await updateTarget(userId, Number(value));
      setIsEditing(false);
      router.refresh(); 
    } catch (error) {
      console.error("保存に失敗しました", error);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-center gap-2 mt-2">
        <input 
          type="number" 
          value={value} 
          onChange={(e) => setValue(Number(e.target.value))}
          className="border rounded px-2 py-1 text-xs w-24 focus:outline-orange-500 text-black" // text-black追加で見やすく
        />
        <button 
          onClick={handleSave} 
          className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold transition-transform active:scale-95"
        >
          保存
        </button>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-2 mt-2">
      <button 
        onClick={() => setIsEditing(true)}
        className="bg-orange-100 hover:bg-orange-200 text-orange-700 text-xs font-bold px-3 py-1 rounded-full transition-colors"
      >
        目標: {initialTarget.toLocaleString()}円 ✎
      </button>
    </div>
  );
}