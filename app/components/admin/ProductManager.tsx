import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { useDeferredValue, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { calculateGrossProfit, formatPrice } from "@/lib/cart";

type AdminProduct = {
  slug: string;
  name: string;
  price: string;
  costPrice: string;
  heroImage: string;
  supplierUrl: string;
  status: string;
  updatedAt: string;
};

function StatusPill({ hidden }: { hidden: boolean }) {
  return <span className={`admin-status admin-status-${hidden ? "amber" : "green"}`}><span />{hidden ? "Paslėptas" : "Rodomas"}</span>;
}

export default function ProductManager() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);
  const [cursor, setCursor] = useState<string>();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const { data: productPage, isPending, isFetching, isError } = useActionQuery("list-admin-product-landings", { cursor, search: deferredSearch, limit: 24 });
  const { mutate: deleteProduct, isPending: isDeleting, isSuccess: deleteSuccess, error: deleteError } = useActionMutation("delete-product-landing");
  const [pendingDeleteSlug, setPendingDeleteSlug] = useState<string | null>(null);
  const previousDeleteSuccess = useRef(false);
  const nextCursor = productPage?.nextCursor ?? null;

  useEffect(() => {
    setCursor(undefined);
    setProducts([]);
  }, [deferredSearch]);

  useEffect(() => {
    if (!productPage) return;
    setProducts((current) => {
      if (!cursor) return productPage.items;
      const merged = new Map(current.map((product) => [product.slug, product]));
      for (const product of productPage.items) merged.set(product.slug, product);
      return [...merged.values()];
    });
  }, [cursor, productPage]);

  useEffect(() => {
    if (deleteSuccess && !previousDeleteSuccess.current && pendingDeleteSlug) {
      setProducts((current) => current.filter((product) => product.slug !== pendingDeleteSlug));
      setPendingDeleteSlug(null);
    } else if (deleteError && pendingDeleteSlug) {
      setPendingDeleteSlug(null);
    }
    previousDeleteSuccess.current = deleteSuccess;
  }, [deleteError, deleteSuccess, pendingDeleteSlug]);

  const productsLoaded = products.length > 0 || !isPending;
  const removeProduct = (slug: string, name: string) => {
    if (!window.confirm(`Visam laikui ištrinti produktą „${name}“? Šio veiksmo atšaukti nepavyks.`)) return;
    setPendingDeleteSlug(slug);
    deleteProduct({ slug });
  };

  return (
    <section className="admin-panel mt-6" aria-busy={isFetching}>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <label className="admin-search"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Ieškoti produkto" aria-label="Ieškoti produkto" /></label>
        <Link to="/admin/product-editor?new=1" className="admin-primary-action">+ Pridėti produktą</Link>
      </div>
      {isError && <p role="alert" className="mt-5 text-sm text-[#bd6659]">Nepavyko prisijungti prie produktų duomenų bazės. Patikrinkite duomenų bazės ryšį.</p>}
      {deleteError && <p role="alert" className="mt-4 text-sm text-[#bd6659]">Nepavyko ištrinti produkto. Patikrinkite prisijungimą ir bandykite dar kartą.</p>}
      {!productsLoaded && !isError && <p role="status" className="mt-5 text-sm text-[#203b40]/55">Įkeliami produktai…</p>}
      <div className="admin-table-wrap mt-5"><table className="admin-table"><thead><tr><th>Produktas</th><th>Būsena</th><th>Kaina</th><th>Savikaina</th><th>Pelnas</th><th className="text-right">Veiksmai</th></tr></thead><tbody>{products.map((product) => { const profit = calculateGrossProfit(product.price, product.costPrice); return <tr key={product.slug}><td><div className="flex min-w-[230px] items-center gap-3">{product.heroImage && <img src={product.heroImage} alt="" className="size-11 rounded-lg object-cover" />}<div><p className="font-semibold text-[#203b40]">{product.name}</p><p className="mt-0.5 text-xs text-[#203b40]/40">/{product.slug}</p></div></div></td><td><StatusPill hidden={product.status === "hidden"} /></td><td className="font-semibold">{product.price}</td><td>{product.costPrice ? `${product.costPrice} €` : "Nenurodyta"}</td><td className="font-semibold text-[#2f7f7b]">{profit === null ? "Nenurodyta" : formatPrice(profit)}</td><td><div className="flex justify-end gap-2">{product.supplierUrl && <a href={product.supplierUrl} className="admin-row-action" target="_blank" rel="noopener noreferrer">Užsakyti ↗</a>}<Link to={`/admin/product-editor?slug=${encodeURIComponent(product.slug)}`} className="admin-row-action">Redaguoti</Link><Link to={`/${product.slug}`} className="admin-row-action" target="_blank" rel="noreferrer">Peržiūrėti</Link><button type="button" disabled={isDeleting} onClick={() => removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">Ištrinti</button></div></td></tr>; })}</tbody></table>{productsLoaded && products.length === 0 && <p className="py-10 text-center text-sm text-[#203b40]/45">Produktų nerasta.</p>}</div>
      <div className="admin-mobile-products mt-5">
        {products.map((product) => (
          <article className="admin-mobile-product" key={product.slug}>
            <div className="admin-mobile-product-heading">
              {product.heroImage && <img src={product.heroImage} alt="" />}
              <div><p>{product.name}</p><StatusPill hidden={product.status === "hidden"} /></div>
            </div>
            <div className="admin-mobile-product-details"><span>Kaina<strong>{product.price}</strong></span><span>Savikaina<strong>{product.costPrice ? `${product.costPrice} €` : "Nenurodyta"}</strong></span><span>Pelnas<strong className="text-[#2f7f7b]">{calculateGrossProfit(product.price, product.costPrice) === null ? "Nenurodyta" : formatPrice(calculateGrossProfit(product.price, product.costPrice)!)}</strong></span><span>Nuoroda<strong>/{product.slug}</strong></span></div>
            <div className="admin-mobile-product-actions">
              <Link to={`/admin/product-editor?slug=${encodeURIComponent(product.slug)}`} className="admin-row-action">Redaguoti</Link>
              <Link to={`/${product.slug}`} className="admin-row-action" target="_blank" rel="noreferrer">Peržiūrėti</Link>
              {product.supplierUrl && <a href={product.supplierUrl} className="admin-row-action" target="_blank" rel="noopener noreferrer">Užsakyti ↗</a>}
              <button type="button" disabled={isDeleting} onClick={() => removeProduct(product.slug, product.name)} className="admin-row-action text-[#bd6659] disabled:opacity-50">Ištrinti</button>
            </div>
          </article>
        ))}
        {products.length === 0 && <p className="py-8 text-center text-sm text-[#203b40]/45">Produktų nerasta.</p>}
      </div>
      {nextCursor && <button type="button" onClick={() => setCursor(nextCursor)} disabled={isFetching} className="admin-row-action mt-5 disabled:opacity-50">{isFetching ? "Įkeliama…" : "Rodyti daugiau"}</button>}
      {isDeleting && <p role="status" className="mt-4 text-sm text-[#203b40]/55">Ištrinamas produktas…</p>}
    </section>
  );
}
