import { Navbar } from "@/components/layout/Navbar";
import { TransactionsDashboard } from "@/features/transactions/components/TransactionsDashboard";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Review your payment history, download invoices, and retry failed
            transactions.
          </p>
        </div>

        <TransactionsDashboard />
      </main>
    </div>
  );
}
