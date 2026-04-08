"use client"

import { useRouter } from "next/navigation"
import Header from "@/components/Header" // 共通ヘッダーをインポート

export default function HomePage() {
  const router = useRouter()

  const handleCreate = () => {
    // ランダムなIDを生成して作成ページへ飛ばす
    const uniqueId = Math.random().toString(36).substring(2, 10);
    router.push(`/create/${uniqueId}`);
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* 共通ヘッダー */}
      <Header />

      {/* メインコンテンツ */}
      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px", 
        textAlign: "center"
      }}>
        <button
          onClick={handleCreate}
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "16px",
            fontSize: "18px",
            cursor: "pointer",
            borderRadius: "12px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            marginTop: "100px" // 上に大きな余白
          }}
        >
          家計簿を作成
        </button>
      </main>
    </div>
  )
}