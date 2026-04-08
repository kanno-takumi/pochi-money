"use client";

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface HeaderProps {
  userImageUrl?: string;
  linkUrl?: string; 
}

export default function Header({ userImageUrl, linkUrl = "/ranking" }: HeaderProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <header style={{
      width: "100%",
      padding: "20px 24px",
      backgroundColor: "#1976d2",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* 左側：ロゴ */}
      <Link href="/" style={{ display: "block" }}>
        <div style={{ position: "relative", height: "48px", width: "150px" }}>
          <Image 
            src="/logo_set.png" 
            alt="POCHI money" 
            fill 
            priority
            unoptimized 
            style={{ objectFit: "contain", objectPosition: "left" }}
          />
        </div>
      </Link>

      {/* 右側：トロフィー画像 */}
      {userImageUrl && (
        <Link href={linkUrl}>
          <div 
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              position: "relative",
              width: "52px",
              height: "52px",
              padding: "8px",
              borderRadius: "50%",
              overflow: "hidden",
              cursor: "pointer",
              boxSizing: "border-box",
              
              // 💡 常に透明、枠線も白のまま
              backgroundColor: "transparent",
              border: "2px solid rgba(255, 255, 255, 0.8)", 
              
              // 💡 アニメーション設定
              transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease",

              // 💡 動きと影のオンオフのみ
              transform: isHovered ? "translateY(-6px)" : "translateY(0)",
              boxShadow: isHovered 
                ? "0 8px 15px rgba(0, 0, 0, 0.25)" 
                : "none",
            }}
          >
            <Image
              src={userImageUrl}
              alt="User Icon"
              fill
              style={{ 
                objectFit: "contain",
                padding: "inherit",
              }}
            />
          </div>
        </Link>
      )}
    </header>
  )
}