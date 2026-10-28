const STATUS_STYLES: Record<string, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  pagado: "bg-emerald-100 text-emerald-800",
  entregado: "bg-stone-100 text-stone-700",
};

export function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex h-6 items-center whitespace-nowrap rounded-full px-2.5 text-[11px] font-bold capitalize ${
        STATUS_STYLES[status?.toLowerCase()] ?? "bg-stone-100 text-stone-700"
      }`}
    >
      {status}
    </span>
  );
}