"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, Ban, RefreshCw } from "lucide-react";

type Resource = "seller" | "product" | "service" | "ebook";
type Action = "approve" | "reject" | "suspend" | "unsuspend";

const LABEL: Record<Action, string> = {
  approve: "Approuvé",
  reject: "Rejeté",
  suspend: "Suspendu",
  unsuspend: "Réactivé",
};

export function AdminActionButtons({
  resource,
  id,
  status,
}: {
  resource: Resource;
  id: string;
  status: string;
}) {
  const router = useRouter();
  async function act(action: Action) {
    const res = await fetch(`/api/admin/${resource}/${id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action }),
    });
    const data = await res.json();
    if (data.ok) {
      toast.success(LABEL[action]);
      router.refresh();
    } else {
      toast.error(data.error || "Erreur");
    }
  }
  return (
    <div className="inline-flex flex-wrap gap-1 justify-end">
      {status !== "APPROVED" && status !== "SUSPENDED" && (
        <button
          onClick={() => act("approve")}
          className="inline-flex items-center gap-1 rounded-md bg-emerald-600 text-white text-xs px-2 py-1 hover:bg-emerald-700"
        >
          <Check size={12} /> Valider
        </button>
      )}
      {status !== "REJECTED" && status !== "SUSPENDED" && (
        <button
          onClick={() => act("reject")}
          className="inline-flex items-center gap-1 rounded-md bg-destructive text-white text-xs px-2 py-1 hover:opacity-90"
        >
          <X size={12} /> Rejeter
        </button>
      )}
      {status === "APPROVED" && (
        <button
          onClick={() => act("suspend")}
          className="inline-flex items-center gap-1 rounded-md bg-amber-600 text-white text-xs px-2 py-1 hover:bg-amber-700"
        >
          <Ban size={12} /> Suspendre
        </button>
      )}
      {status === "SUSPENDED" && (
        <button
          onClick={() => act("unsuspend")}
          className="inline-flex items-center gap-1 rounded-md bg-sky-600 text-white text-xs px-2 py-1 hover:bg-sky-700"
        >
          <RefreshCw size={12} /> Réactiver
        </button>
      )}
    </div>
  );
}
