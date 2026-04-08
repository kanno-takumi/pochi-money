import Link from "next/link"; // Linkをインポート

interface SavingCardProps {
  label: string;
  amount: number;
  href: string; // 💡 リンク先URLを受け取る
}

export default function SavingCard({ label, amount, href }: SavingCardProps) {
  return (
    <Link href={href} className="block w-full">
      <div className="
        w-full rounded-[24px] p-5 flex flex-col items-center justify-center
        bg-white text-gray-400 border-2 border-orange-100 
        transition-all duration-300 ease-out
        hover:border-orange-500 hover:shadow-[0_10px_25px_-5px_rgba(249,115,22,0.2)] 
        hover:scale-[1.05] active:scale-95
      ">
        <span className="text-[10px] font-black uppercase tracking-widest mb-1 text-gray-400">
          {label}
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-black text-orange-600">
            {amount.toLocaleString()}
          </span>
          <span className="text-[10px] font-bold text-gray-500">
            円節約
          </span>
        </div>
      </div>
    </Link>
  );
}