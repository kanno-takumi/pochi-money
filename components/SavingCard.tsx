// components/SavingCard.tsx
interface SavingCardProps {
  label: string;
  amount: number;
  unit?: string;
}

export default function SavingCard({ label, amount, unit = "円" }: SavingCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-orange-100 flex flex-col items-center min-w-[140px]">
      <span className="text-xs text-gray-500 font-medium">{label}</span>
      <div className="mt-1 flex items-baseline gap-0.5">
        <span className="text-2xl font-bold text-orange-600">
          {amount.toLocaleString()}
        </span>
        <span className="text-sm font-bold text-gray-700">{unit}節約</span>
      </div>
    </div>
  );
}