import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { Link } from "react-router";
import { useState } from "react";
import { builtInProducts, builtInProductSlugs } from "@/lib/store-products";

function StatusPill({ hidden }: { hidden: boolean }) {
  return <span className={`admin-status admin-status-${hidden ? "amber" : "green"}`}><span />{hidden ? "Paslėptas" : "Rodomas"}</span>;
}

export default function ProductManager() {
  const [search, setSearch] = useState("");
  const { data: savedProducts, isError } = useActionQuery("list-admin-product-landings", {});
  const { mutate: setProductStatus, isPending: isUpdating, error: statusError } = useActionMutation("delete-product-landing");
  const savedBySlug = new Map((savedProducts ?? []).map((product) => [product.slug, product]));
  const knownSlugs = new Set<string>(builtInProductSlugs);
  const products = [
    ...builtInProducts.map((product) => {
      const saved = savedBySlug.get(product.slug);
      return {
        ...product,
        name: saved?.name || product.name,
        price: saved?.price || product.price,
        image: saved?.heroImage || product.image,
        hidden: saved?.status === "hidden",
        supplierUrl: saved?.supplierUrl ?? "",
      };
    }),
    ...(savedProducts ?? [])
      .filter((product) => !knownSlugs.has(product.slug))
      .map((product) => ({
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.heroImage,
        hidden: product.status === "hidden",
        supplierUrl: product.supplierUrl,
      })),
  ].filter((product) => product.name.toLowerCase().includes(search.toLowerCase()));

  const removeProduct = (slug: string, name: string) => {
    if (!window.confirm(`Pašalinti „${name}“ iš parduotuvės?`)) return;
    setProductStatus({ slug, action: "delete" });
  };

  return (
    <section className="admin-panel mt-6" aria-busy={!savedProducts && !isError}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <label className="admin-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ieškoti produkto" aria-label="Ieškoti produkto" /></label>
        <Link to="/admin/product-editor?new=1" className="admin-primary-action">+ Pridėti produktą</Link>
      </div>
      {isError && <p role="alert" className="mt-5 text-sm text-[#bd6659]">Nepavyko prisijungti prie produktų duomenų bazės. Patikrinkite duomenų bazės ryšį.</p>}
      {statusError && <p role="alert" className="mt-4 text-sm text-[#bd6659]">Nepavyko pakeisti produkto būsenos. Patikrinkite prisijungimą ir bandykite dar kartą.</p>}
      {!savedProducts && !isError && <p role="status" className="mt-5 text-sm text-[#203b40]/55">Įkeliami produktai…</p>}
      <div className="admin-table-wrap mt-5"><table className="admin-table"><thead><tr><th>Produktas</th><th>Būsena</th><th>Kaina</th><th className="text-right">Veiksmai</th></tr></thead><tbody>{products.map((product) => <tr key={product.slug}><td><div className="flex min-w-[230px] items-center gap-3">{product.image && <img src={product.image} alt="" className="size-11 rounded-lg object-cover" />}<div><p className="font-semibold text-[#203b40]">{product.name}</p><p className="mt-0.5 text-xs text-[#203b40]/40">/{product.slug}</p></div></div></td><td><StatusPill hidden={product.hidden} /></td><td className="font-semibold">{product.price}</td><td><div className="flex justify-end gap-2"><Link to={`/admin/product-editor?slug=${encodeURIComponent(product.slug)}`} className="admin-row-action">Redaguoti</Link><Link to={`/${product.slug}`} className="admin-row-action" target="_blank" rel="noreferrer">Peržiūrėti</Link>{savedProducts && <button type="button" disabled={isUpdating} onClick={() => product.hidden ? setProductStatus({ slug: product.slug, action: "restore" }) : removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">{product.hidden ? "Atkurti" : "Pašalinti"}</button>}</div></td></tr>)}</tbody></table>{products.length === 0 && <p className="py-10 text-center text-sm text-[#203b40]/45">Produktų nerasta.</p>}</div>
        <div className="admin-table-wrap mt-5"><table className="admin-table"><thead><tr><th>Produktas</th><th>Būsena</th><th>Kaina</th><th className="text-right">Veiksmai</th></tr></thead><tbody>{products.map((product) => <tr key={product.slug}><td><div className="flex min-w-[230px] items-center gap-3">{product.image && <img src={product.image} alt="" className="size-11 rounded-lg object-cover" />}<div><p className="font-semibold text-[#203b40]">{product.name}</p><p className="mt-0.5 text-xs text-[#203b40]/40">/{product.slug}</p></div></div></td><td><StatusPill hidden={product.hidden} /></td><td className="font-semibold">{product.price}</td><td><div className="flex justify-end gap-2">{product.supplierUrl && <a href={product.supplierUrl} className="admin-row-action" target="_blank" rel="noopener noreferrer">Užsakyti ↗</a>}<Link to={`/admin/product-editor?slug=${encodeURIComponent(product.slug)}`} className="admin-row-action">Redaguoti</Link><Link to={`/${product.slug}`} className="admin-row-action" target="_blank" rel="noreferrer">Peržiūrėti</Link>{savedProducts && <button type="button" disabled={isUpdating} onClick={() => product.hidden ? setProductStatus({ slug: product.slug, action: "restore" }) : removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">{product.hidden ? "Atkurti" : "Pašalinti"}</button>}</div></td></tr>)}</tbody></table>{products.length === 0 && <p className="py-10 text-center text-sm text-[#203b40]/45">Produktų nerasta.</p>}</div>
      <div className="admin-mobile-products mt-5">
        {products.map((product) => (
          <article className="admin-mobile-product" key={product.slug}>
            <div className="admin-mobile-product-heading">
              {product.image && <img src={product.image} alt="" />}
              <div><p>{product.name}</p><StatusPill hidden={product.hidden} /></div>
            </div>
            <div className="admin-mobile-product-details"><span>Kaina<strong>{product.price}</strong></span><span>Nuoroda<strong>/{product.slug}</strong></span></div>
            <div className="admin-mobile-product-actions">
              <Link to={`/admin/product-editor?slug=${encodeURIComponent(product.slug)}`} className="admin-row-action">Redaguoti</Link>
              <Link to={`/${product.slug}`} className="admin-row-action" target="_blank" rel="noreferrer">Peržiūrėti</Link>
              {product.supplierUrl && <a href={product.supplierUrl} className="admin-row-action" target="_blank" rel="noopener noreferrer">Užsakyti ↗</a>}
              {savedProducts && <button type="button" disabled={isUpdating} onClick={() => product.hidden ? setProductStatus({ slug: product.slug, action: "restore" }) : removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">{product.hidden ? "Atkurti" : "Pašalinti"}</button>}
            </div>
          </article>
        ))}
        {products.length === 0 && <p className="py-8 text-center text-sm text-[#203b40]/45">Produktų nerasta.</p>}
      </div>
      {isUpdating && <p role="status" className="mt-4 text-sm text-[#203b40]/55">Išsaugoma…</p>}
    </section>
  );
}
