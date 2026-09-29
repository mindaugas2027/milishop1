import ProductManager from "@/components/admin/ProductManager";
import { Link, Outlet, useLocation } from "react-router";

export function getAdminTabConfig() {
  return ["Produktai"];
}

export function meta() {
  return [{ title: "Produktai — Milishop" }];
}

export default function AdminRoute() {
  const location = useLocation();

  const signOut = async () => {
    try {
      await fetch("/api/admin-auth/logout", {
        method: "POST",
        signal: AbortSignal.timeout(4_000),
      });
    } catch {
      // Navigate to login even if the session service is unavailable.
    }
    window.location.replace("/login");
  };

  if (location.pathname.startsWith("/admin/product-editor")) return <Outlet />;

  return (
    <div className="admin-shell min-h-screen bg-[#f7f8f6] text-[#203b40]">
      <aside className="admin-sidebar hidden border-r border-[#203b40]/8 bg-white lg:flex lg:flex-col">
        <Link to="/admin" className="flex items-center gap-2.5 px-7 py-7">
          <span className="brand-mark" aria-hidden="true"><span /></span>
          <span className="text-[17px] font-semibold tracking-[-0.04em]">milishop</span>
        </Link>
        <nav className="px-5" aria-label="Administravimas">
          <p className="admin-label px-3">Parduotuvė</p>
          <Link to="/admin" className="admin-nav-item admin-nav-item-active mt-3">
            <span className="admin-nav-symbol" aria-hidden="true">□</span>Produktai
          </Link>
        </nav>
        <div className="mt-auto px-5 pb-6">
          <Link to="/" className="block rounded-xl bg-[#e4f1ed] p-4 text-xs font-semibold text-[#2f7f7b]">Peržiūrėti parduotuvę ↗</Link>
          <div className="mt-5 flex items-center justify-between border-t border-[#203b40]/8 pt-5">
            <span className="text-xs font-medium text-[#203b40]/60">Administratorius</span>
            <button type="button" onClick={signOut} className="text-xs font-semibold text-[#2f7f7b] hover:underline">Atsijungti</button>
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#203b40]/8 bg-white px-5 py-4 sm:px-8 lg:hidden">
          <Link to="/admin" className="flex items-center gap-2.5">
            <span className="brand-mark" aria-hidden="true"><span /></span>
            <span className="text-[17px] font-semibold tracking-[-0.04em]">milishop</span>
          </Link>
          <button type="button" onClick={signOut} className="text-xs font-semibold text-[#2f7f7b]">Atsijungti</button>
        </header>
        <main className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Produktai</h1>
            <Link to="/" className="rounded-full border border-[#203b40]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#203b40]/65 transition-colors hover:text-[#203b40]">Parduotuvė ↗</Link>
          </div>
          <ProductManager />
        </main>
      </div>
    </div>
  );
}
