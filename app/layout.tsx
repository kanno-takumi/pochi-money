// app/layout.tsx
import '@/app/ui/global.css'; // ← これがデザインを司る大切な1行です

export const metadata = {
  title: 'ぽちマネ',
  description: 'シンプル家計簿アプリ',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      {/* 以前使っていたフォント(inter)などが無い場合、標準のフォント設定にします */}
      <body className="antialiased font-sans">{children}</body>
    </html>
  );
}