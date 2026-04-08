"use client"

import { useState } from "react"
import Header from "@/components/Header"
import { createNewUser } from "./actions" // 💡 Server Actionをインポート

export default function HomePage() {
  const [userName, setUserName] = useState("")

  // ボタンが押せるかどうかの判定
  const isEnabled = userName.trim().length > 0;

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", backgroundColor: "#f8f9fa" }}>
      <Header />

      <main style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "40px 20px", 
        textAlign: "center"
      }}>
        {/* 💡 formタグで囲み、actionにServer Actionを渡す */}
        <form action={createNewUser} style={{ 
          marginTop: "100px", 
          width: "100%", 
          maxWidth: "300px",
          display: "flex",
          flexDirection: "column",
          gap: "16px"
        }}>
          
          <div style={{ textAlign: "left" }}>
            <input
              type="text"
              name="userName" // 💡 formData.get("userName") と一致させる
              placeholder="ニックネーム 例：たろう"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                fontSize: "16px",
                borderRadius: "12px",
                border: "2px solid #ddd",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit" // 💡 typeをsubmitにする
            disabled={!isEnabled} // 💡 disabled属性を明示的に指定
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              cursor: isEnabled ? "pointer" : "not-allowed",
              borderRadius: "12px",
              backgroundColor: isEnabled ? "#1976d2" : "#ccc",
              color: "white",
              border: "none",
              boxShadow: isEnabled ? "0 4px 6px rgba(0,0,0,0.1)" : "none",
              transition: "background-color 0.3s ease"
            }}
          >
            家計簿を作成
          </button>
        </form>
      </main>
    </div>
  )
}