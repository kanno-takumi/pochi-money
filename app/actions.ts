"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";
import sql from "./lib/db";

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
 // app/actions.ts

/**
 * 目標金額を更新する
 */
export async function updateTarget(userId: string, arg: FormData | number) {
  let newTarget: number;
  if (typeof arg === "number") {
    newTarget = arg;
  } else {
    newTarget = Number(arg.get("targetAmount"));
  }

  if (isNaN(newTarget) || newTarget <= 0 || !userId) return;

  try {
    // 💡 UPSERT文 (ON CONFLICT) を使う
    await sql`
      INSERT INTO settings (key, value, user_id)
      VALUES ('target_budget', ${newTarget}, ${userId})
      ON CONFLICT (key, user_id) 
      DO UPDATE SET value = EXCLUDED.value
    `;
    
    // 画面のキャッシュをクリアして最新データを表示させる
    revalidatePath(`/create/${userId}`);
  } catch (e) {
    console.error("目標更新失敗:", e);
  }
}
/**
 * 節約記録を追加する
 */
export async function addRecord(userId: string, formData: FormData) {
  const amount = Number(formData.get("amount"));
  const item = formData.get("item") as string;
  
  if (!amount || !item || !userId) {
    console.error("データが足りません:", { amount, item, userId });
    return;
  }

  try {
    await sql`
      INSERT INTO records (item, amount, user_id, date)
      VALUES (${item}, ${amount}, ${userId}, CURRENT_DATE)
    `;
    
    // 画面を更新して、追加した記録を即座に表示させる
    revalidatePath(`/create/${userId}`);
  } catch (e) {
    console.error("記録追加失敗:", e);
  }
}