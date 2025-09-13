"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DowngradeButtonProps = {
  tenantSlug: string;
};

export function DowngradeButton({ tenantSlug }: DowngradeButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleDowngrade = async () => {
    if (!confirm("Are you sure you want to downgrade to the Free plan? Your note limit will be re-applied.")) {
        return;
    }
    setIsLoading(true);
    const res = await fetch(`/api/tenants/${tenantSlug}/downgrade`, {
      method: "POST",
    });

    if (res.ok) {
      alert("Downgrade successful.");
      router.refresh(); 
    } else {
      alert("Downgrade failed. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <button
      onClick={handleDowngrade}
      disabled={isLoading}
      className="px-3 py-1 text-xs font-medium text-white bg-yellow-600 rounded-md hover:bg-yellow-700 disabled:opacity-50"
    >
      {isLoading ? "Processing..." : "Downgrade"}
    </button>
  );
}
