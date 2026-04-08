"use client";

import { useState } from "react";
import { updateTargetBudget } from "@/app/actions";

export default function TargetSetter({ initialTarget }: { initialTarget: number }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(initialTarget);

  const handleSave = async () => {
    await updateTargetBudget(Number(value));
    setIsEditing(false);
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
        <button onClick={handleSave} className="text-xs bg-orange-500 text-white px-3 py-1 rounded-full font-bold">保存</button>
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
```

### 3. Dashboard（page.tsx）の修正
「目標」を表示していた部分を、作成した `TargetSetter` に置き換えます。

```tsx
// ...既存のimport
import TargetSetter from "@/components/TargetSetter";

// ... getSavingsData, getStartOfThisWeek はそのまま

export default async function Dashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getSavingsData();
  
  const weeklyBudget = data.target; 
  // ... 計算ロジックなどはそのまま

  return (
    <div className="min-h-screen flex flex-col bg-orange-50/30">
      <Header userImageUrl={userIconPath} linkUrl={`/ranking/${id}`} />

      <main className="max-w-md mx-auto p-6 pb-24 w-full">
        <div className="mb-8 text-center">
          <h2 className="text-xl font-black text-gray-800 mb-1">あなたの節約</h2>
          
          {/* ここをコンポーネントに変更 */}
          <TargetSetter initialTarget={weeklyBudget} />
          
        </div>

        {/* ... SavingCard と RecordForm はそのまま */}
      </main>
    </div>
  );
}