"use client";

import { useState, useEffect } from "react"; // useEffectを追加
import { updateTarget } from "@/app/actions";
import { useRouter } from "next/navigation"; // ルーターを追加

export default function TargetSetter({ initialTarget }: { initialTarget: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialTarget);
  const router = useRouter();

  // initialTargetが親から更新されたら、内部の状態も同期させる
  useEffect(() => {
    setValue(initialTarget);
  }, [initialTarget]);

  const handleSave = async () => {
    try {
      await updateTarget(Number(value));
      setIsEditing(false);
      // サーバー側のデータを再取得して画面を更新する
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
          className="border rounded px-2 py-1 text-xs w-24 focus:outline-orange-500"
        />
        <button 
          onClick={handleSave} 
          className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold"
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