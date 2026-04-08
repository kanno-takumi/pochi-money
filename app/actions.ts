"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

const filePath = path.join(process.cwd(), "data", "savings.json");

// JSONを読み込む共通関数
async function readData() {
  const fileContent = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContent);
}

// JSONを保存する共通関数
async function saveData(data: any) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

// app/actions.ts (該当箇所のみ)

/**
 * 目標金額を更新する
 */
export async function updateTarget(arg: FormData | number) {
  let newTarget: number;

  if (typeof arg === "number") {
    // TargetSetter.tsx から直接数値が送られてきた場合
    newTarget = arg;
  } else {
    // <form action={updateTarget}> から FormData が送られてきた場合
    newTarget = Number(arg.get("targetAmount"));
  }

  if (isNaN(newTarget) || newTarget <= 0) return;

  try {
    const data = await readData();
    data.target = newTarget;
    await saveData(data);
    revalidatePath("/", "layout");
  } catch (e) {
    console.error("目標更新失敗:", e);
  }
}

/**
 * 節約記録を追加する
 */
export async function addRecord(formData: FormData) {
  const amount = Number(formData.get("amount"));
  const item = formData.get("item") as string;
  
  if (!amount || !item) return;

  try {
    const data = await readData();
    
    const newRecord = {
      id: data.records.length > 0 ? Math.max(...data.records.map((r: any) => r.id)) + 1 : 1,
      amount: amount,
      item: item,
      date: new Date().toISOString().split('T')[0] // 今日の日付 (YYYY-MM-DD)
    };

    data.records.unshift(newRecord); // 配列の先頭に追加
    await saveData(data);
    revalidatePath("/", "layout"); // 画面を更新
  } catch (e) {
    console.error("記録追加失敗:", e);
  }
}