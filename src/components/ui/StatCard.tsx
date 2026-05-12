interface StatCardProps {
  label: string;
  value: string;
  valueClassName?: string;
}

export function StatCard({
  label,
  value,
  valueClassName = "text-gray-900",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        {label}
      </p>
      <p className={`mt-1 text-2xl font-bold ${valueClassName}`}>{value}</p>
    </div>
  );
}
