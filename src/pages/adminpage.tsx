import { useEffect, useState } from "react";
import { api } from "../libs/axios";
import { StatusPill } from "../componentes/StatusPill";

export function AdminDashboard() {
  const [stats, setStats] = useState({ productos: 0, pedidos: 0, usuarios: 0 });

  useEffect(() => {
    Promise.all([
      api.get("/products/").then((r) => setStats((s) => ({ ...s, productos: r.data.length }))),
      api.get("/orders/").then((r) => setStats((s) => ({ ...s, pedidos: r.data.length }))),
      api.get("/users/").then((r) => setStats((s) => ({ ...s, usuarios: r.data.length }))),
    ]).catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-8">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">
          Panel de Administración
        </h1>
        <p className="mt-1 text-sm text-stone-500">
          Hoy, {new Date().toLocaleDateString("es-PE", { day: "2-digit", month: "short" })}
        </p>
      </header>

      <section className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        {[
          ["Productos", stats.productos],
          ["Pedidos", stats.pedidos],
          ["Usuarios", stats.usuarios],
        ].map(([label, value]) => (
          <div key={label as string} className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
              {label}
            </span>
            <strong className="mt-2 block text-[28px] tracking-tight text-cacao-900">
              {value}
            </strong>
          </div>
        ))}
      </section>
    </>
  );
}

export function AdminProductos() {
  const [productos, setProductos] = useState<any[]>([]);
  const [form, setForm] = useState({ name: "", description: "", price: "", stock: "", category: "", image_url: "" });
  const [creando, setCreando] = useState(false);

  const cargar = () => {
    api.get("/products/").then((r) => setProductos(r.data)).catch(() => {});
  };
  useEffect(cargar, []);

  const crear = async () => {
    try {
      await api.post("/products/", {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      });
      setForm({ name: "", description: "", price: "", stock: "", category: "", image_url: "" });
      setCreando(false);
      cargar();
    } catch {
      alert("No se pudo crear el producto");
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/products/${id}`);
      cargar();
    } catch {
      alert("No se pudo eliminar");
    }
  };

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">Productos</h1>
          <p className="mt-1 text-sm text-stone-500">{productos.length} productos en el catálogo</p>
        </div>
        <button
          onClick={() => setCreando(!creando)}
          className="inline-flex h-10 items-center rounded-lg bg-terracotta-500 px-4 text-sm font-bold text-white hover:bg-terracotta-700"
        >
          {creando ? "Cancelar" : "+ Nuevo producto"}
        </button>
      </header>

      {creando && (
        <div className="mb-6 grid grid-cols-2 gap-3 rounded-xl border border-stone-200 bg-white p-5 max-lg:grid-cols-1">
          {[
            ["name", "Nombre"],
            ["description", "Descripción"],
            ["price", "Precio"],
            ["stock", "Stock"],
            ["category", "Categoría"],
            ["image_url", "URL de imagen"],
          ].map(([key, label]) => (
            <label key={key} className="flex flex-col gap-1 text-sm font-semibold text-stone-700">
              <span>{label}</span>
              <input
                value={(form as any)[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="h-10 rounded-lg border border-stone-300 px-3 text-sm font-normal focus:border-terracotta-500 focus:outline-none focus:ring-4 focus:ring-terracotta-500/10"
              />
            </label>
          ))}
          <button
            onClick={crear}
            className="col-span-full h-10 rounded-lg bg-terracotta-500 text-sm font-bold text-white hover:bg-terracotta-700"
          >
            Crear producto
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-1">
        {productos.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            {p.image_url && <img src={p.image_url} alt={p.name} className="h-40 w-full object-cover" />}
            <div className="p-4">
              <h3 className="font-serif text-base text-cacao-900">{p.name}</h3>
              <p className="mt-1 text-[13px] text-stone-500">{p.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <b className="text-terracotta-600">S/ {p.price}</b>
                <span className="text-xs text-stone-500">Stock: {p.stock}</span>
              </div>
              <button
                onClick={() => eliminar(p.id)}
                className="mt-3 w-full rounded-lg border border-rose-200 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ── Pedidos (cambiar estado) ──────────────── */
export function AdminPedidos() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const cargar = () => {
    api.get("/orders/").then((r) => setPedidos(r.data)).catch(() => {});
  };
  useEffect(cargar, []);

  const cambiarEstado = async (id: number, status: string) => {
    try {
      await api.patch(`/orders/${id}/status`, { status });
      cargar();
    } catch {
      alert("No se pudo actualizar");
    }
  };

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">Pedidos</h1>
        <p className="mt-1 text-sm text-stone-500">{pedidos.length} pedidos</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {pedidos.length === 0 && (
          <div className="px-6 py-10 text-center text-sm text-stone-500">Sin pedidos aún.</div>
        )}
        {pedidos.map((p) => (
          <div
            key={p.id}
            className="flex min-h-17 items-center justify-between border-b border-stone-100 px-5 py-3 last:border-b-0 hover:bg-cream-50 max-lg:flex-wrap"
          >
            <div className="flex items-center gap-3 max-lg:w-full max-lg:flex-wrap">
              <strong className="text-cacao-900">#{p.id}</strong>
              <StatusPill status={p.status} />
              <span className="text-[13px] text-stone-500">{p.user_name ?? "-"}</span>
              <span className="text-[13px] text-stone-500">S/ {p.total}</span>
            </div>
            <select
              value={p.status}
              onChange={(e) => cambiarEstado(p.id, e.target.value)}
              className="h-9 rounded-lg border border-stone-300 px-2 text-xs font-semibold"
            >
              <option value="pendiente">pendiente</option>
              <option value="pagado">pagado</option>
              <option value="entregado">entregado</option>
            </select>
          </div>
        ))}
      </div>
    </>
  );
}

export function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState<any[]>([]);
  useEffect(() => {
    api.get("/users/").then((r) => setUsuarios(r.data)).catch(() => {});
  }, []);

  return (
    <>
      <header className="mb-6">
        <h1 className="font-serif text-[38px] leading-tight text-cacao-900 max-lg:text-3xl">Usuarios</h1>
        <p className="mt-1 text-sm text-stone-500">{usuarios.length} usuarios registrados</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
        {usuarios.map((u) => (
          <div key={u.id} className="flex items-center justify-between border-b border-stone-100 px-5 py-3 last:border-b-0">
            <div>
              <strong className="block text-cacao-900">{u.name}</strong>
              <span className="text-xs text-stone-500">{u.email}</span>
            </div>
            <span className="rounded-full bg-terracotta-100 px-2.5 py-1 text-[11px] font-bold text-terracotta-600">
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}