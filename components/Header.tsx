// components/Header.tsx
import Image from "next/image"
import Link from "next/link"

interface HeaderProps {
  userImageUrl?: string;
  linkUrl?: string; // ← 追加：リンク先を受け取れるようにする
}

// 引数に linkUrl を追加。デフォルト値を設定しておくと便利です。
export default function Header({ userImageUrl, linkUrl = "/ranking" }: HeaderProps) {
  return (
    <header style={{
      width: "100%",
      padding: "28px 24px", 
      backgroundColor: "#1976d2",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      {/* 左側：ロゴ */}
      <Link href="/" style={{ display: "block" }}>
        <div style={{ position: "relative", height: "56px", width: "180px" }}>
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

      {/* 右側：画像がある場合のみ表示 */}
      {userImageUrl && (
        // 固定の "/ranking" ではなく、受け取った linkUrl を使うように変更
        <Link href={linkUrl}>
          <div style={{
            position: "relative",
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "2px solid rgba(255, 255, 255, 0.9)",
            cursor: "pointer",
          }}>
            <Image
              src={userImageUrl}
              alt="User Icon"
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </Link>
      )}
    </header>
  )
}