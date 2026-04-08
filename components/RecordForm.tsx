// components/RecordForm.tsx
// export default function RecordForm() {
//   return (
//     <div className="w-full bg-white rounded-3xl p-6 shadow-sm border border-orange-100">
//       <div className="flex flex-col gap-4">
//         {/* 入力エリア */}
//         <div className="flex items-center gap-2 flex-wrap">
//           <input
//             type="number"
//             placeholder="0"
//             className="flex-1 min-w-[80px] border-b-2 border-orange-200 focus:border-orange-500 outline-none text-2xl font-bold text-gray-700 p-1 text-right"
//           />
//           <span className="text-gray-500 font-bold">円で</span>
          
//           <input
//             type="text"
//             placeholder="なにか"
//             className="flex-[2] min-w-[120px] border-b-2 border-orange-200 focus:border-orange-500 outline-none text-xl text-gray-700 p-1"
//           />
//           <span className="text-gray-500 font-bold">を買った</span>
//         </div>

//         {/* 送信ボタン */}
//         <button className="w-full bg-orange-500 hover:bg-orange-600 active:scale-95 transition-all text-white font-bold py-4 rounded-2xl shadow-md mt-2">
//           送信
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { addRecord } from "@/app/actions";
import { useRef } from "react";

export default function RecordForm() {
  const formRef = useRef<HTMLFormElement>(null);

  // 送信ボタンを押した後の挙動
  const handleSubmit = async (formData: FormData) => {
    await addRecord(formData);
    formRef.current?.reset(); // 入力欄をピカピカにする
  };

  return (
    <form 
      ref={formRef}
      action={handleSubmit} 
      className="bg-white p-6 rounded-[32px] shadow-sm border border-orange-100 space-y-4"
    >
      <div>
        <label className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">内容</label>
        <input
          name="item"
          type="text"
          placeholder="例: カフェラテ"
          required
          className="w-full px-4 py-3 rounded-2xl bg-orange-50/50 border-none focus:ring-2 focus:ring-orange-200 text-sm outline-none"
        />
      </div>

      <div>
        <label className="block text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">金額 (円)</label>
        <input
          name="amount"
          type="number"
          placeholder="450"
          required
          className="w-full px-4 py-3 rounded-2xl bg-orange-50/50 border-none focus:ring-2 focus:ring-orange-200 text-sm outline-none"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-orange-100 transition-transform active:scale-95"
      >
        記録を保存する
      </button>
    </form>
  );
}