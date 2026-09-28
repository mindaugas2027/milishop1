import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { useEffect, useMemo, useState } from "react";
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

export function getAdminTabConfig() {
  return ["Apžvalga", "Produktai", "Užsakymai", "Nustatymai"];
}

export function meta() {
  return [{ title: "Administravimas — Atrinkta" }];
}

function StatusPill({ tone, children }: { tone: string; children: React.ReactNode }) {
  return <span className={`admin-status admin-status-${tone}`}><span />{children}</span>;
}

function DashboardOverview() {
  return (
    <>
      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="admin-stat-card">
          <p>Šio mėnesio pardavimai</p>
          <strong>1 248,60 €</strong>
          <span className="admin-stat-up">↑ 18,4%</span>
          <div className="admin-sparkline">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="admin-stat-card">
          <p>Užsakymai</p>
          <strong>32</strong>
          <span className="admin-stat-note">8 nauji šiandien</span>
          <div className="admin-stat-orb admin-orb-mint">↗</div>
        </div>

        <div className="admin-stat-card">
          <p>Aktyvūs produktai</p>
          <strong>2 <small>/ 3</small></strong>
          <span className="admin-stat-note">1 laukia papildymo</span>
          <div className="admin-stat-orb admin-orb-sand">□</div>
        </div>

        <div className="admin-stat-card">
          <p>Vidutinis krepšelis</p>
          <strong>38,90 €</strong>
          <span className="admin-stat-up">↑ 6,2%</span>
          <div className="admin-stat-orb admin-orb-blue">€</div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="admin-panel">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="admin-panel-title">Pardavimai</h2>
              <p className="admin-panel-meta">Paskutinės 7 dienos</p>
            </div>
            <button className="admin-select">Ši savaitė <span>⌄</span></button>
          </div>

          <div className="mt-8 flex items-end gap-4">
            <strong className="text-3xl font-semibold tracking-[-0.06em]">312,40 €</strong>
            <span className="mb-1 text-xs font-semibold text-[#3b8b87]">+12,8% prieš praėjusią savaitę</span>
          </div>

          <div className="admin-chart mt-8">
            <div className="admin-chart-grid">
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className="admin-chart-bars">
              <i style={{ height: "36%" }} />
              <i style={{ height: "48%" }} />
              <i style={{ height: "43%" }} />
              <i style={{ height: "65%" }} />
              <i style={{ height: "54%" }} />
              <i style={{ height: "78%" }} />
              <i style={{ height: "92%" }} />
            </div>
            <div className="admin-chart-labels">
              <span>Pirm.</span>
              <span>Antr.</span>
              <span>Treč.</span>
              <span>Ketv.</span>
              <span>Penkt.</span>
              <span>Šešt.</span>
              <span>Šiand.</span>
            </div>
          </div>
        </div>

        <div className="admin-panel">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="admin-panel-title">Reikia dėmesio</h2>
              <p className="admin-panel-meta">Naujausia veikla</p>
            </div>
            <button className="text-xs font-semibold text-[#398b86] hover:underline">Visi užsakymai</button>
          </div>

          <div className="mt-5 grid gap-4">
            {orders.map((order) => (
              <div key={order.id} className="flex items-center gap-3">
                <div className={`admin-order-avatar admin-order-${order.tone}`}>{order.customer.charAt(0)}</div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{order.customer}</p>
                  <p className="truncate text-xs text-[#203b40]/45">{order.product} · {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{order.total}</p>
                  <StatusPill tone={order.tone}>{order.status}</StatusPill>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function slugifyProductName(name: string) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 120);
}

type ProductDraft = {
  name: string;
  description: string;
  price: string;
  imageUrl: string;
};

const emptyProductDraft: ProductDraft = {
  name: "",
  description: "",
  price: "",
  imageUrl: "",
};

function DashboardProducts({
  query,
  onQueryChange,
  createOpen,
  onCreateOpenChange,
}: {
  query: string;
  onQueryChange: (value: string) => void;
  createOpen: boolean;
  onCreateOpenChange: (open: boolean) => void;
}) {
  const { data: savedLandings = [], isError: loadError } = useActionQuery("list-product-landings", {});
  const { mutate: saveProduct, isPending: isSaving, isSuccess: saveSuccess, error: saveError } = useActionMutation("update-product-landing");
  const { mutate: deleteProduct, isPending: isDeleting } = useActionMutation("delete-product-landing");
  const [draft, setDraft] = useState(emptyProductDraft);
  const [formError, setFormError] = useState("");

  const productRows = useMemo(() => {
    const rows = new Map(products.map((product) => [product.slug, { ...product, isSaved: false }]));
    for (const landing of savedLandings) {
      rows.set(landing.slug, {
        name: landing.name,
        slug: landing.slug,
        price: landing.price,
        stock: "—",
        status: "Supabase",
        statusTone: "green",
        image: landing.heroImage,
        isSaved: true,
      });
    }
    return [...rows.values()].filter((product) => product.name.toLowerCase().includes(query.toLowerCase()));
  }, [query, savedLandings]);

  const submitProduct = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const slug = slugifyProductName(draft.name);
    if (!slug) {
      setFormError("Įveskite produkto pavadinimą.");
      return;
    }
    if (products.some((product) => product.slug === slug) || savedLandings.some((product) => product.slug === slug)) {
      setFormError("Toks produkto adresas jau naudojamas.");
      return;
    }

    const price = Number(draft.price.replace(",", "."));
    if (!Number.isFinite(price) || price <= 0) {
      setFormError("Įveskite teisingą kainą.");
      return;
    }

    const description = draft.description.trim();
    const name = draft.name.trim();
    saveProduct({
      slug,
      brandName: "Milishop",
      footerText: "Apgalvoti daiktai kasdienai.",
      name,
      eyebrow: "Milishop kolekcija",
      description,
      longDescription: description,
      price: `${price.toFixed(2).replace(".", ",")} €`,
      oldPrice: "",
      saving: "",
      heroImage: draft.imageUrl.trim(),
      gallery: [],
      features: [],
      steps: [],
      specs: [],
      faq: [],
      deliveryInfo: "Pristatymas per 1–2 d. d.",
      returnsInfo: "14 dienų grąžinimas",
      ctaText: "Pirkti dabar",
      finalCtaEyebrow: "Pasiruošę išbandyti?",
      finalCtaTitle: name,
      finalCtaText: "Pirkti dabar",
    });
  };

  const removeProduct = (slug: string, name: string) => {
    if (!window.confirm(`Ištrinti „${name}“ iš produktų katalogo?`)) return;
    deleteProduct({ slug });
  };

  return (
    <section className="admin-panel mt-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div><h2 className="admin-panel-title">Produktai</h2><p className="admin-panel-meta">Valdykite katalogą ir produktų puslapius</p></div>
        <div className="flex gap-3">
          <label className="admin-search"><span>⌕</span><input value={query} onChange={(event) => onQueryChange(event.target.value)} placeholder="Ieškoti produkto" aria-label="Ieškoti produkto" /></label>
          <button type="button" className="admin-filter" onClick={() => onCreateOpenChange(!createOpen)}>{createOpen ? "Uždaryti" : "+ Naujas produktas"}</button>
        </div>
      </div>

      {createOpen && (
        <form className="mt-6 grid gap-4 border-y border-[#203b40]/10 py-5 sm:grid-cols-2" onSubmit={submitProduct}>
          <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">Pavadinimas<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.target.value }))} required maxLength={160} /></label>
          <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">Kaina (€)<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="number" min="0.01" step="0.01" value={draft.price} onChange={(event) => setDraft((current) => ({ ...current, price: event.target.value }))} required /></label>
          <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70 sm:col-span-2">Trumpas aprašymas<textarea className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" value={draft.description} onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))} required maxLength={500} rows={2} /></label>
          <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70 sm:col-span-2">Produkto nuotraukos HTTPS adresas<input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm" type="url" value={draft.imageUrl} onChange={(event) => setDraft((current) => ({ ...current, imageUrl: event.target.value }))} required /></label>
          <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
            <button type="submit" disabled={isSaving} className="rounded-lg bg-[#2f7f7b] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isSaving ? "Kuriama…" : "Sukurti produktą"}</button>
            {saveSuccess && <span className="text-sm text-[#2f7f7b]">Produktas išsaugotas Supabase.</span>}
            {(formError || saveError) && <span role="alert" className="text-sm text-[#bd6659]">{formError || "Nepavyko išsaugoti. Patikrinkite duomenų bazės ryšį ir nuotraukos adresą."}</span>}
          </div>
        </form>
      )}

      {loadError && <p role="alert" className="mt-5 text-sm text-[#bd6659]">Nepavyko įkelti produktų. Patikrinkite duomenų bazės ryšį.</p>}
      <div className="admin-table-wrap mt-6"><table className="admin-table"><thead><tr><th>Produktas</th><th>Statusas</th><th>Kaina</th><th>Likutis</th><th className="text-right">Veiksmai</th></tr></thead><tbody>{productRows.map((product) => <tr key={product.slug}><td><div className="flex min-w-[250px] items-center gap-3">{product.image && <img src={product.image} alt="" className="size-11 rounded-xl object-cover mix-blend-multiply" />}<div><p className="font-semibold text-[#203b40]">{product.name}</p><p className="mt-0.5 text-xs text-[#203b40]/40">/{product.slug}</p></div></div></td><td><StatusPill tone={product.statusTone}>{product.status}</StatusPill></td><td className="font-semibold">{product.price}</td><td className={product.stock === "0 vnt." ? "font-semibold text-[#bd6659]" : "text-[#203b40]/60"}>{product.stock}</td><td><div className="flex justify-end gap-2"><Link to={product.slug === "obd2" ? "/obd" : `/${product.slug}`} className="admin-row-action">Peržiūrėti</Link>{product.isSaved && <button type="button" disabled={isDeleting} onClick={() => removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">Ištrinti</button>}</div></td></tr>)}</tbody></table>{productRows.length === 0 && <p className="py-10 text-center text-sm text-[#203b40]/45">Produktų pagal šią užklausą neradome.</p>}</div>
      <div className="admin-mobile-products mt-5">
        {productRows.map((product) => (
          <article className="admin-mobile-product" key={product.slug}>
            <div className="admin-mobile-product-heading">
              {product.image && <img src={product.image} alt="" />}
              <div><p>{product.name}</p><StatusPill tone={product.statusTone}>{product.status}</StatusPill></div>
            </div>
            <div className="admin-mobile-product-details"><span>Kaina <strong>{product.price}</strong></span><span>Likutis <strong>{product.stock}</strong></span></div>
            <div className="admin-mobile-product-actions">
              <Link to={product.slug === "obd2" ? "/obd" : `/${product.slug}`} className="admin-row-action">Peržiūrėti</Link>
              {product.isSaved && <button type="button" disabled={isDeleting} onClick={() => removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">Ištrinti</button>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function DashboardOrders() {
  return (
    <section className="admin-panel mt-6">
      <div className="flex items-center justify-between"><div><h2 className="admin-panel-title">Užsakymai</h2><p className="admin-panel-meta">Naujausi klientų užsakymai</p></div><button className="admin-filter">Eksportuoti <span>⌄</span></button></div>
      <div className="mt-6 grid gap-4">
        {orders.map((order) => (
          <div key={order.id} className="flex items-center justify-between gap-4 rounded-2xl border border-[#203b40]/8 p-4">
            <div><p className="text-sm font-semibold text-[#203b40]">{order.customer}</p><p className="mt-1 text-xs text-[#203b40]/45">{order.id} · {order.product}</p></div>
            <div className="text-right"><p className="text-sm font-semibold">{order.total}</p><StatusPill tone={order.tone}>{order.status}</StatusPill></div>
          </div>
        ))}
      </div>
    </section>
  );
}

function DashboardSettings() {
  const { data: socialLinks } = useActionQuery("get-store-social-links", {});
  const { mutate, isPending, isSuccess, error } = useActionMutation("update-store-social-links");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");

  useEffect(() => {
    if (!socialLinks) return;
    setInstagramUrl(socialLinks.instagramUrl);
    setFacebookUrl(socialLinks.facebookUrl);
  }, [socialLinks]);

  return (
    <section className="admin-panel mt-6">
      <h2 className="admin-panel-title">Nustatymai</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[#203b40]/8 bg-[#f8faf8] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#398b86]">Parduotuvė</p><p className="mt-2 text-sm text-[#203b40]">Pavadinimas: milishop</p><p className="mt-1 text-sm text-[#203b40]">Valiutos kursas: EUR</p></div>
        <div className="rounded-2xl border border-[#203b40]/8 bg-[#f8faf8] p-4"><p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#398b86]">Pristatymas</p><p className="mt-2 text-sm text-[#203b40]">Nuo 50 € nemokamas pristatymas</p><p className="mt-1 text-sm text-[#203b40]">14 dienų grąžinimas</p></div>
      </div>
      <form
        className="mt-6 grid max-w-2xl gap-4 border-t border-[#203b40]/8 pt-6"
        onSubmit={(event) => {
          event.preventDefault();
          mutate({ instagramUrl, facebookUrl });
        }}
      >
        <div>
          <h3 className="text-sm font-semibold text-[#203b40]">Socialiniai tinklai</h3>
          <p className="mt-1 text-xs text-[#203b40]/55">Įveskite HTTPS profilių nuorodas. Tušti laukai svetainėje nerodomi.</p>
        </div>
        <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">
          Instagram
          <input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm text-[#203b40]" type="url" value={instagramUrl} onChange={(event) => setInstagramUrl(event.target.value)} placeholder="https://www.instagram.com/..." />
        </label>
        <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">
          Facebook
          <input className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm text-[#203b40]" type="url" value={facebookUrl} onChange={(event) => setFacebookUrl(event.target.value)} placeholder="https://www.facebook.com/..." />
        </label>
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={isPending} className="rounded-lg bg-[#2f7f7b] px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60">{isPending ? "Saugoma…" : "Išsaugoti nuorodas"}</button>
          {isSuccess && <span className="text-sm text-[#2f7f7b]">Nuorodos išsaugotos.</span>}
          {error && <span role="alert" className="text-sm text-[#bd6659]">Patikrinkite nuorodą: turi būti Instagram arba Facebook HTTPS adresas.</span>}
        </div>
      </form>
    </section>
  );
}

export default function AdminRoute() {
  const location = useLocation();
  const navItems = getAdminTabConfig();
  const [activeNav, setActiveNav] = useState("Apžvalga");
  const [query, setQuery] = useState("");
  const [createProductOpen, setCreateProductOpen] = useState(false);

  const signOut = async () => {
    await fetch("/api/admin-auth/logout", { method: "POST" });
    window.location.replace("/login");
  };

  if (location.pathname.startsWith("/admin/landing")) return <Outlet />;

  const renderTabContent = () => {
    switch (activeNav) {
      case "Produktai":
        return <DashboardProducts query={query} onQueryChange={setQuery} createOpen={createProductOpen} onCreateOpenChange={setCreateProductOpen} />;
      case "Užsakymai":
        return <DashboardOrders />;
      case "Nustatymai":
        return <DashboardSettings />;
      case "Apžvalga":
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="admin-shell min-h-screen bg-[#f7f8f6] text-[#203b40]">
      <aside className="admin-sidebar hidden border-r border-[#203b40]/8 bg-white lg:flex lg:flex-col">
        <div className="flex items-center gap-2.5 px-7 py-7"><span className="brand-mark" aria-hidden="true"><span /></span><span className="text-[17px] font-semibold tracking-[-0.04em]">milishop</span></div>
        <div className="px-5"><p className="admin-label px-3">Parduotuvė</p><nav className="mt-3 grid gap-1">{navItems.map((item, index) => <button key={item} onClick={() => setActiveNav(item)} className={`admin-nav-item ${activeNav === item ? "admin-nav-item-active" : ""}`}><span className="admin-nav-symbol">{["⌂", "□", "↗", "◌"][index]}</span>{item}{item === "Užsakymai" && <span className="ml-auto rounded-full bg-[#f5e6ce] px-2 py-0.5 text-[10px] font-bold text-[#976636]">3</span>}</button>)}</nav></div>
        <div className="mt-auto px-5 pb-6"><div className="rounded-2xl bg-[#e4f1ed] p-4"><p className="text-xs font-semibold text-[#2f7f7b]">Parduotuvė veikia</p><p className="mt-1 text-xs leading-5 text-[#557875]">Paskutinis atnaujinimas prieš 4 min.</p><Link to="/" className="mt-3 inline-flex text-xs font-semibold text-[#2f7f7b] hover:underline">Peržiūrėti svetainę ↗</Link></div><div className="mt-6 flex items-center gap-3 border-t border-[#203b40]/8 pt-5"><span className="flex size-9 items-center justify-center rounded-full bg-[#203b40] text-xs font-semibold text-white">MI</span><div className="min-w-0"><p className="truncate text-xs font-semibold">mindaugas2027@gmail.com</p><p className="text-[11px] text-[#203b40]/45">Administratorius</p></div><button type="button" onClick={signOut} className="ml-auto text-xs font-semibold text-[#2f7f7b] hover:underline">Atsijungti</button></div></div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between border-b border-[#203b40]/8 bg-white px-5 py-4 sm:px-8 lg:hidden"><Link to="/" className="flex items-center gap-2.5"><span className="brand-mark" aria-hidden="true"><span /></span><span className="text-[17px] font-semibold tracking-[-0.04em]">milishop</span></Link><Link to="/" className="text-xs font-semibold text-[#2f7f7b]">Į parduotuvę ↗</Link></header>
        <nav className="admin-mobile-tabs lg:hidden" aria-label="Administravimo skyriai">
          {navItems.map((item, index) => (
            <button
              type="button"
              key={item}
              onClick={() => setActiveNav(item)}
              className={activeNav === item ? "admin-mobile-tab-active" : ""}
              aria-pressed={activeNav === item}
            >
              <span aria-hidden="true">{["⌂", "□", "↗", "◌"][index]}</span>
              <span>{item}</span>
            </button>
          ))}
        </nav>
        <main className="mx-auto max-w-[1380px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">{activeNav}</p><h1 className="mt-2 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">Sveiki sugrįžę.</h1></div><div className="flex items-center gap-3"><Link to="/" className="hidden rounded-full border border-[#203b40]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#203b40]/65 transition-colors hover:text-[#203b40] sm:inline-flex">Peržiūrėti svetainę</Link><button onClick={() => { setActiveNav("Produktai"); setCreateProductOpen(true); }} className="rounded-full bg-[#2f7f7b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,127,123,0.16)] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-[#256d69]">+ Naujas produktas</button></div></div>
          {renderTabContent()}
        </main>
      </div>
    </div>
  );
}
