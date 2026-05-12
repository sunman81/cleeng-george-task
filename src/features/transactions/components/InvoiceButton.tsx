import { InvoiceStatus } from "@/features/transactions/types";
import { Spinner } from "@/components/ui/Spinner";
import { DownloadIcon } from "@/components/ui/icons/DownloadIcon";

interface InvoiceButtonProps {
  status: InvoiceStatus;
  onClick: () => void;
}

export function InvoiceButton({ status, onClick }: InvoiceButtonProps) {
  const isGenerating = status === "generating";

  return (
    <button
      onClick={onClick}
      disabled={isGenerating}
      aria-label="Download invoice"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
        border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-300
        disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer
        transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    >
      {isGenerating ? (
        <>
          <Spinner className="h-3.5 w-3.5 text-blue-500" />
          Generating…
        </>
      ) : status === "ready" ? (
        <>
          <DownloadIcon />
          Downloaded
        </>
      ) : (
        <>
          <DownloadIcon />
          Invoice
        </>
      )}
    </button>
  );
}
