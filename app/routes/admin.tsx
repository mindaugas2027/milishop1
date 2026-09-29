import ProductManager from "@/components/admin/ProductManager";
import { Link, Outlet, useLocation } from "react-router";
import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { useEffect, useState } from "react";

export function getAdminTabConfig() {
  return ["Produktai", "Užsakymai", "Nustatymai"];
}

export function meta() {
  return [{ title: "Produktai — Milishop" }];
}

function StoreSettingsPanel() {
  const { data, isPending: isLoading, isError: loadError } = useActionQuery("get-store-social-links", {});
  const { mutate, isPending: isSaving, isSuccess, error } = useActionMutation("update-store-social-links");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");

  useEffect(() => {
    if (!data) return;
    setInstagramUrl(data.instagramUrl);
    setFacebookUrl(data.facebookUrl);
  }, [data]);

  return (
    <section className="admin-panel mt-6 max-w-3xl">
      <h2 className="admin-panel-title">Parduotuvės nuorodos</h2>
      {isLoading && <p role="status" className="mt-4 text-sm text-[#203b40]/55">Įkeliami nustatymai…</p>}
      {loadError && <p role="alert" className="mt-4 text-sm text-[#bd6659]">Nustatymų nepavyko įkelti. Patikrinkite duomenų bazės ryšį.</p>}
      <form className="mt-5 grid gap-4" onSubmit={(event) => { event.preventDefault(); mutate({ instagramUrl, facebookUrl }); }}>
        <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">Instagram<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="url" value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} placeholder="https://www.instagram.com/..." /></label>
        <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">Facebook<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="url" value={facebookUrl} onChange={(event) => setFacebookUrl(event.target.value)} placeholder="https://www.facebook.com/..." /></label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isSaving || isLoading} className="admin-primary-action disabled:opacity-60">{isSaving ? "Saugoma…" : "Išsaugoti"}</button>
          {isSuccess && <span role="status" className="text-sm text-[#2f7f7b]">Nuorodos išsaugotos.</span>}
          {error && <span role="alert" className="text-sm text-[#bd6659]">Išsaugoti nepavyko. Patikrinkite HTTPS nuorodas.</span>}
        </div>
      </form>
    </section>
  );
}

function OrdersPanel() {
  return (
    <section className="admin-panel mt-6 max-w-3xl">
      <h2 className="admin-panel-title">Užsakymai</h2>
      <p className="mt-4 text-sm leading-6 text-[#203b40]/65">Užsakymų dar nėra, nes dabartinis krepšelis užsakymo neįrašo ir mokėjimas nėra prijungtas.</p>
      <p className="mt-2 text-sm leading-6 text-[#203b40]/65">Kai bus prijungtas atsiskaitymas ir užsakymų registravimas, čia matysite pirkėjus, prekes ir užsakymo būseną.</p>
    </section>
  );
}

export default function AdminRoute() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Produktai");
  const navItems = getAdminTabConfig();

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
          <div className="mt-3 grid gap-1">
            {navItems.map((item) => <button key={item} type="button" onClick={() => setActiveTab(item)} aria-pressed={activeTab === item} className={`admin-nav-item ${activeTab === item ? "admin-nav-item-active" : ""}`}><span className="admin-nav-symbol" aria-hidden="true">{item === "Produktai" ? "□" : item === "Užsakymai" ? "↗" : "◌"}</span>{item}</button>)}
          </div>
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
        <nav className="flex gap-2 overflow-x-auto border-b border-[#203b40]/8 bg-white px-5 lg:hidden" aria-label="Administravimo skirtukai">
          {navItems.map((item) => <button key={item} type="button" onClick={() => setActiveTab(item)} aria-pressed={activeTab === item} className={`shrink-0 border-b-2 px-3 py-3 text-xs font-semibold ${activeTab === item ? "border-[#2f7f7b] text-[#2f7f7b]" : "border-transparent text-[#203b40]/55"}`}>{item}</button>)}
        </nav>
        <main className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">{activeTab}</h1>
            <Link to="/" className="rounded-full border border-[#203b40]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#203b40]/65 transition-colors hover:text-[#203b40]">Parduotuvė ↗</Link>
          </div>
          {activeTab === "Produktai" ? <ProductManager /> : activeTab === "Užsakymai" ? <OrdersPanel /> : <StoreSettingsPanel />}
        </main>
      </div>
    </div>
  );
}
