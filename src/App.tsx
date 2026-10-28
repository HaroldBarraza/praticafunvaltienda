import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { LoginPage } from "./pages/loginPages";
import {
  AdminDashboard,
  AdminPedidos,
  AdminProductos,
  AdminUsuarios,
} from "./pages/adminpage";
import { ClienteCatalogo, ClientePedidos } from "./pages/clientPages";
import { AppLayout } from "./componentes/layout";
import { RutasProtegidas } from "./componentes/rutasprotegidas";
import { RoleRoute } from "./componentes/rutasroles";
import { UnauthorizedPage } from "./pages/noautorizado";
import "./App.css";

function App() {
  const [rehidratado, setRehidratado] = useState(
    useAuthStore.persist.hasHydrated()
  );

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() =>
      setRehidratado(true)
    );
    return unsub;
  }, []);

  if (!rehidratado) return null;

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RutasProtegidas />}>
        <Route element={<AppLayout />}>
          <Route element={<RoleRoute allow={["Administrador"]} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/productos" element={<AdminProductos />} />
            <Route path="/admin/pedidos" element={<AdminPedidos />} />
            <Route path="/admin/usuarios" element={<AdminUsuarios />} />
          </Route>

          <Route element={<RoleRoute allow={["Cliente"]} />}>
            <Route path="/cliente" element={<ClienteCatalogo />} />
            <Route path="/cliente/pedidos" element={<ClientePedidos />} />
          </Route>
        </Route>
      </Route>

      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;