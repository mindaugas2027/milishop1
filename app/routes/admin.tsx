import { useMemo, useState } from "react";
import { Link, Outlet, useLocation } from "react-router";

const products = [
  {
    name: "OBD2 automobilio diagnostikos įrenginys",
    slug: "obd2",
    price: "39,90 €",
    stock: "24 vnt.",
    status: "Aktyvus",
    statusTone: "green",
    image: "https://images.pexels.com/photos/15290307/pexels-photo-15290307.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    name: "Magnetinis automobilio telefono laikiklis",
    slug: "automobilio-laikiklis",
    price: "24,90 €",
    stock: "8 vnt.",
    status: "Mažėja likutis",
    statusTone: "amber",
    image: "https://images.pexels.com/photos/12953565/pexels-photo-12953565.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
  {
    name: "Keraminė stalo detalė „Forma“",
    slug: "namu-akcentas",
    price: "32,00 €",
    stock: "0 vnt.",
    status: "Išparduota",
    statusTone: "gray",
    image: "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&w=300",
  },
];

const orders = [
  { id: "#AT-1048", customer: "Gabija M.", product: "OBD2 įrenginys", total: "39,90 €", status: "Laukia apmokėjimo", tone: "amber", time: "Prieš 18 min." },
  { id: "#AT-1047", customer: "Tomas V.", product: "Telefono laikiklis", total: "24,90 €", status: "Apmokėta", tone: "green", time: "Prieš 1 val." },
  { id: "#AT-1046", customer: "Ieva K.", product: "Keraminė detalė", total: "32,00 €", status: "Išsiųsta", tone: "blue", time: "Vakar" },
];

const navItems = ["Apžvalga", "Produktai", "Užsakymai", "Nustatymai"];

export function meta() {
  return [{ title: "Administravimas — Atrinkta" }];
}

function StatusPill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`admin-status admin-status-${tone}`}><span />{children}</span>;
}

export default function AdminRoute() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("Apžvalga");
  const [query, setQuery] = useState("");
  const [showToast, setShowToast] = useState(false);
  const filteredProducts = useMemo(() => products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase())), [query]);

  if (location.pathname.startsWith("/admin/landing")) return <Outlet />;

  return (
    <div className="admin-shell min-h-screen bg-[#f7f8f6] text-[#203b40]">
      <aside className="admin-sidebar hidden border-r border-[#203b40]/8 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-7 py-7"><span className="brand-mark" aria-hidden="true"><span /></span><span className="text-[17px] font-semibold tracking-[-0.04em]">atrinkta<span className="text-[#61aaa3]">.</span></span></div>
        <div className="px-5"><p className="admin-label px-3">Parduotuvė</p><nav className="mt-3 grid gap-1">{navItems.map((item, index) => <button key={item} onClick={() => setActiveNav(item)} className={`admin-nav-item ${activeNav === item ? "admin-nav-item-active" : ""}`}><span className="admin-nav-symbol">{["⌂", "□", "↗", "◌"][index]}</span>{item}{item === "Užsakymai" && <span className="ml-auto rounded-full bg-[#f5e6ce] px-2 py-0.5 text-[10px] font-bold text-[#976636]">3</span>}</button>)}</nav></div>
        <div className="mt-auto px-5 pb-6"><div className="rounded-2xl bg-[#e4f1ed] p-4"><p className="text-xs font-semibold text-[#2f7f7b]">Parduotuvė veikia</p><p className="mt-1 text-xs leading-5 text-[#557875]">Paskutinis atnaujinimas prieš 4 min.</p><Link to="/" className="mt-3 inline-flex text-xs font-semibold text-[#2f7f7b] hover:underline">Peržiūrėti svetainę ↗</Link></div><div className="mt-6 flex items-center gap-3 border-t border-[#203b40]/8 pt-5"><span className="flex size-9 items-center justify-center rounded-full bg-[#203b40] text-xs font-semibold text-white">SI</span><div className="min-w-0"><p className="truncate text-xs font-semibold">Statybos Industrija</p><p className="text-[11px] text-[#203b40]/45">Administratorius</p></div><span className="ml-auto text-[#203b40]/35">···</span></div></div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#203b40]/8 bg-white px-5 py-4 sm:px-8 lg:hidden"><Link to="/" className="flex items-center gap-2.5"><span className="brand-mark" aria-hidden="true"><span /></span><span className="text-[17px] font-semibold tracking-[-0.04em]">atrinkta<span className="text-[#61aaa3]">.</span></span></Link><Link to="/" className="text-xs font-semibold text-[#2f7f7b]">Į parduotuvę ↗</Link></header>
        <main className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">{activeNav}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Sveiki sugrįžę.</h1></div><div className="flex items-center gap-3"><Link to="/" className="hidden rounded-full border border-[#203b40]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#203b40]/65 transition-colors hover:text-[#203b40] sm:inline-flex">Peržiūrėti svetainę</Link><button onClick={() => setShowToast(true)} className="rounded-full bg-[#2f7f7b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,127,123,0.16)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#256d69]">+ Naujas produktas</button></div></div>

          <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><div className="admin-stat-card"><p>Šio mėnesio pardavimai</p><strong>1 248,60 €</strong><span className="admin-stat-up">↑ 18,4%</span><div className="admin-sparkline"><i /><i /><i /><i /><i /><i /><i /></div></div><div className="admin-stat-card"><p>Užsakymai</p><strong>32</strong><span className="admin-stat-note">8 nauji šiandien</span><div className="admin-stat-orb admin-orb-mint">↗</div></div><div className="admin-stat-card"><p>Aktyvūs produktai</p><strong>2 <small>/ 3</small></strong><span className="admin-stat-note">1 laukia papildymo</span><div className="admin-stat-orb admin-orb-sand">□</div></div><div className="admin-stat-card"><p>Vidutinis krepšelis</p><strong>38,90 €</strong><span className="admin-stat-up">↑ 6,2%</span><div className="admin-stat-orb admin-orb-blue">€</div></div></section>

          <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]"><div className="admin-panel"><div className="flex items-start justify-between"><div><h2 className="admin-panel-title">Pardavimai</h2><p className="admin-panel-meta">Paskutinės 7 dienos</p></div><button className="admin-select">Ši savaitė <span>⌄</span></button></div><div className="mt-8 flex items-end gap-4"><strong className="text-3xl font-semibold tracking-[-0.06em]">312,40 €</strong><span className="mb-1 text-xs font-semibold text-[#3b8b87]">+12,8% prieš praėjusią savaitę</span></div><div className="admin-chart mt-8"><div className="admin-chart-grid"><span /><span /><span /><span /></div><div className="admin-chart-bars"><i style={{ height: "36%" }} /><i style={{ height: "48%" }} /><i style={{ height: "43%" }} /><i style={{ height: "65%" }} /><i style={{ height: "54%" }} /><i style={{ height: "78%" }} /><i style={{ height: "92%" }} /></div><div className="admin-chart-labels"><span>Pirm.</span><span>Antr.</span><span>Treč.</span><span>Ketv.</span><span>Penkt.</span><span>Šešt.</span><span>Šiand.</span></div></div></div><div className="admin-panel"><div className="flex items-start justify-between"><div><h2 className="admin-panel-title">Reikia dėmesio</h2><p className="admin-panel-meta">Naujausia veikla</p></div><button className="text-xs font-semibold text-[#398b86] hover:underline">Visi užsakymai</button></div><div className="mt-5 grid gap-4">{orders.map((order) => <div key={order.id} className="flex items-center gap-3"><div className={`admin-order-avatar admin-order-${order.tone}`}>{order.customer.charAt(0)}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{order.customer}</p><p className="truncate text-xs text-[#203b40]/45">{order.product} · {order.time}</p></div><div className="text-right"><p className="text-sm font-semibold">{order.total}</p><StatusPill tone={order.tone}>{order.status}</StatusPill></div></div>)}</div></div></section>

          <section className="admin-panel mt-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div><h2 className="admin-panel-title">Produktai</h2><p className="admin-panel-meta">Valdykite katalogą ir produktų puslapius</p></div><div className="flex gap-3"><label className="admin-search"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ieškoti produkto" aria-label="Ieškoti produkto" /></label><button className="admin-filter">Filtruoti <span>⌄</span></button></div></div><div className="admin-table-wrap mt-6"><table className="admin-table"><thead><tr><th>Produktas</th><th>Statusas</th><th>Kaina</th><th>Likutis</th><th className="text-right">Veiksmai</th></tr></thead><tbody>{filteredProducts.map((product) => <tr key={product.slug}><td><div className="flex min-w-[250px] items-center gap-3"><img src={product.image} alt="" className="size-11 rounded-xl object-cover mix-blend-multiply" /><div><p className="font-semibold text-[#203b40]">{product.name}</p><p className="mt-0.5 text-xs text-[#203b40]/40">/{product.slug}</p></div></div></td><td><StatusPill tone={product.statusTone}>{product.status}</StatusPill></td><td className="font-semibold">{product.price}</td><td className={product.stock === "0 vnt." ? "font-semibold text-[#bd6659]" : "text-[#203b40]/60"}>{product.stock}</td><td><div className="flex justify-end gap-2"><Link to={`/${product.slug}`} className="admin-row-action">Peržiūrėti</Link><Link to="/admin/landing" className="admin-row-action">Redaguoti</Link></div></td></tr>)}</tbody></table>{filteredProducts.length === 0 && <p className="py-10 text-center text-sm text-[#203b40]/45">Produktų pagal šią užklausą neradome.</p>}</div></section>
        </main>
      </div>
      {showToast && <button onClick={() => setShowToast(false)} className="fixed bottom-6 right-6 z-20 rounded-2xl bg-[#203b40] px-5 py-4 text-left text-white shadow-[0_16px_40px_rgba(32,59,64,0.22)]"><p className="text-sm font-semibold">Produkto kūrimas</p><p className="mt-1 text-xs text-white/65">Forma bus paruošta kitame žingsnyje. Uždaryti ×</p></button>}
    </div>
  );
}
