import { useEffect, useState } from "react";
import { api } from "../libs/axios";
import { useAuthStore } from "../store/authStore";
import { StatusPill } from "../componentes/StatusPill";

export function ClienteCatalogo() {
  const nombre = useAuthStore((s) => s.usuarioNombre);
  const [productos, setProductos] = useState<any[]>([]);
  const [pidiendo, setPidiendo] = useState<number | null>(null);

  const cargar = () => {
    api.get("/products/").then((r) => setProductos(r.data)).catch(() => {});
  };
  useEffect(cargar, []);

  const pedir = async (productId: number) => {
    try {
      setPidiendo(productId);
      await api.post("/orders/", {
        items: [{ product_id: productId, quantity: 1 }],
      });
      alert("Pedido creado ✅");
    } catch (e: any) {
      alert(e.response?.data?.detail || "No se pudo crear el pedido");
    } finally {
      setPidiendo(null);
    }
  };

  const primerNombre = nombre?.split(" ")[0] ?? "cliente";

  return (
    <>
      <header className="mb-8">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          ¡Hola {primerNombre}!
        </h1>
        <p className="mt-1 text-sm text-stone-500">Ingresaste como Cliente 👋</p>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-2xl">Catálogo</h2>
          <span className="text-[13px] text-stone-500">{productos.length} productos</span>
        </div>

        <div className="grid grid-cols-3 gap-4.5 max-lg:grid-cols-1">
          {productos.length === 0 && (
            <div className="col-span-full px-6 py-10 text-center text-stone-500">
              El admin aún no subió productos.
            </div>
          )}
          {productos.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-2xl border border-stone-200 bg-white transition hover:-translate-y-0.5 hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
            >
              {p.image_url && (
                <img src={p.image_url} alt={p.name} className="h-47.5 w-full object-cover" />
              )}
              <div className="p-4">
                <h3 className="font-serif text-base text-cacao-900">{p.name}</h3>
                <p className="mb-2 mt-1 text-[13px] text-stone-500">{p.description}</p>
                <div className="mb-3 flex items-center justify-between">
                  <b className="text-terracotta-600">S/ {p.price}</b>
                  <span className="text-[11px] text-stone-500">Stock: {p.stock}</span>
                </div>
                <button
                  onClick={() => pedir(p.id)}
                  disabled={pidiendo === p.id || p.stock <= 0}
                  className="h-10 w-full rounded-lg bg-terracotta-500 text-xs font-bold text-white hover:bg-terracotta-700 disabled:opacity-50"
                >
                  {pidiendo === p.id ? "..." : p.stock > 0 ? "Pedir" : "Sin stock"}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

export function ClientePedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  useEffect(() => {
    api.get("/orders/").then((r) => setPedidos(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Mis pedidos
        </h1>
        <p className="mt-1 text-sm text-stone-500">{pedidos.length} pedidos en tu historial</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {pedidos.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-stone-500">
            Todavía no tienes pedidos. ¡Pide algo del catálogo!
          </div>
        )}
        {pedidos.map((p) => (
          <div
            key={p.id}
            className="flex min-h-17 items-center justify-between border-b border-stone-100 px-5 py-3 last:border-b-0 hover:bg-cream-50"
          >
            <div className="flex items-center gap-3">
              <strong className="text-cacao-900">#{p.id}</strong>
              <StatusPill status={p.status} />
              <span className="text-[13px] text-stone-500">
                {new Date(p.created_at).toLocaleDateString("es-PE")}
              </span>
            </div>
            <strong className="text-sm text-cacao-900">S/ {p.total}</strong>
          </div>
        ))}
      </div>
    </>
  );
}