import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { uploadEditorImage } from "@agent-native/core/client/uploads";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { calculateDiscount } from "@/lib/cart";
import { isStoreCategory, storeCategories, type StoreCategory } from "@/lib/store-products";

type ProductDraft = {
  slug: string;
  brandName: string;
  footerText: string;
  name: string;
  category: StoreCategory;
  eyebrow: string;
  description: string;
  longDescription: string;
  price: string;
  oldPrice: string;
  saving: string;
  heroImage: string;
  supplierUrl: string;
  gallery: string[];
  features: string[];
  steps: string[];
  specs: Array<{ label: string; value: string }>;
  faq: Array<{ question: string; answer: string }>;
  deliveryInfo: string;
  returnsInfo: string;
  ctaText: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaText: string;
};

function createDraft(slug: string): ProductDraft {
  const name = "";
  const description = "";
  return {
    slug,
    brandName: "Milishop",
    footerText: "Apgalvoti daiktai kasdienai.",
    name,
    category: "kasdienai",
    eyebrow: "",
    description,
    longDescription: description,
    price: "",
    oldPrice: "",
    saving: "",
    heroImage: "",
    supplierUrl: "",
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
  };
}

function slugify(name: string) {
  return name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 120);
}

function Field({ label, value, onChange, multiline = false, required = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; required?: boolean }) {
  const fieldClass = "w-full rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm text-[#203b40] outline-none focus:border-[#2f7f7b]";
  return <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">{label}{multiline ? <textarea className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} rows={4} required={required} /> : <input className={fieldClass} value={value} onChange={(event) => onChange(event.target.value)} required={required} />}</label>;
}

export function meta() {
  return [{ title: "Produkto redagavimas — Milishop" }];
}

export default function AdminProductEditorRoute() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isNew = searchParams.get("new") === "1";
  const slug = searchParams.get("slug") ?? "";
  const querySlug = slug || "__new_product_draft__";
  const { data, isPending: isLoading, isError: loadError } = useActionQuery("get-admin-product-landing", { slug: querySlug });
  const { mutate, isPending: isSaving, isSuccess, error: saveError } = useActionMutation("update-product-landing");
  const [draft, setDraft] = useState(() => createDraft(isNew ? "" : slug));
  const [formError, setFormError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const discount = calculateDiscount(draft.price, draft.oldPrice);

  useEffect(() => {
    if (data) {
      const baseDraft = createDraft(slug);
      setDraft({ ...baseDraft, ...data, category: isStoreCategory(data.category) ? data.category : baseDraft.category });
    }
  }, [data, slug]);

  useEffect(() => {
    if (isSuccess && isNew && draft.slug) {
      navigate(`/admin/product-editor?slug=${encodeURIComponent(draft.slug)}`, { replace: true });
    }
  }, [draft.slug, isNew, isSuccess, navigate]);

  const update = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateLines = (key: "gallery" | "features" | "steps", value: string) => update(key, value.split("\n").map((line) => line.trim()).filter(Boolean));

  const uploadImages = async (files: FileList | null) => {
    const selectedFiles = Array.from(files ?? []);
    if (!selectedFiles.length) return;
    setUploadError("");
    setIsUploading(true);
    let nextGallery = [...draft.gallery];
    let nextHeroImage = draft.heroImage;
    try {
      for (const file of selectedFiles) {
        if (!file.type.startsWith("image/")) throw new Error("Pasirinkite nuotraukos failą.");
        if (file.size > 10 * 1024 * 1024) throw new Error("Nuotrauka turi būti mažesnė nei 10 MB.");
        if (nextGallery.length >= 12) throw new Error("Galerijoje galima turėti iki 12 nuotraukų.");
        const uploaded = await uploadEditorImage(file);
        if (!nextGallery.includes(uploaded.src)) nextGallery = [...nextGallery, uploaded.src];
        if (!nextHeroImage) nextHeroImage = uploaded.src;
        setDraft((current) => ({ ...current, gallery: nextGallery, heroImage: nextHeroImage }));
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Upload failed";
      setUploadError(message.includes("not configured") || message.includes("Connect or reconnect")
        ? "Nuotraukų saugykla neprijungta. Prijunkite S3/R2 failų saugyklą ir bandykite dar kartą."
        : message);
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (image: string) => {
    const gallery = draft.gallery.filter((item) => item !== image);
    update("gallery", gallery);
    if (draft.heroImage === image) update("heroImage", gallery[0] ?? "");
  };

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const nextSlug = draft.slug.trim() || slugify(draft.name);
    if (!nextSlug) {
      setFormError("Įveskite produkto pavadinimą.");
      return;
    }
    if (!draft.heroImage) {
      setFormError("Įkelkite nuotrauką ir pažymėkite pagrindinę.");
      return;
    }
    mutate({ ...draft, saving: discount ? `Sutaupai ${discount.amountLabel}` : "", slug: nextSlug, name: draft.name.trim(), supplierUrl: draft.supplierUrl.trim() });
  };

  return (
    <main className="min-h-screen bg-[#f7f8f6] px-5 py-7 text-[#203b40] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-[960px]">
        <div className="mb-6 flex items-center justify-between gap-4"><Link to="/admin" className="admin-row-action">← Produktai</Link>{draft.slug && !isNew && <Link to={`/${draft.slug}`} target="_blank" rel="noreferrer" className="admin-row-action">Peržiūrėti puslapį ↗</Link>}</div>
        <h1 className="text-3xl font-semibold tracking-[-0.06em]">{isNew ? "Naujas produktas" : "Redaguoti produktą"}</h1>
        {isLoading && !isNew && !data && <p role="status" className="mt-5 text-sm text-[#203b40]/55">Įkeliami produkto duomenys…</p>}
        {loadError && <p role="alert" className="mt-5 text-sm text-[#bd6659]">Nepavyko įkelti produkto. Patikrinkite prisijungimą ir duomenų bazės ryšį.</p>}
        <form onSubmit={save} className="mt-6 grid gap-6">
          <section className="landing-editor-section mt-0">
            <h2 className="landing-editor-heading mb-5 text-lg font-semibold">Pagrindinė informacija</h2>
            <div className="landing-field-grid">
              <Field label="Produkto pavadinimas" value={draft.name} onChange={(value) => update("name", value)} required />
              <Field label="Produkto adresas" value={draft.slug} onChange={(value) => update("slug", value)} required={!isNew} />
              <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">Kategorija
                <select className="w-full rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm text-[#203b40] outline-none focus:border-[#2f7f7b]" value={draft.category} onChange={(event) => update("category", event.target.value as StoreCategory)}>
                  {storeCategories.map((category) => <option key={category.value} value={category.value}>{category.label}</option>)}
                </select>
              </label>
              <Field label="Kaina" value={draft.price} onChange={(value) => update("price", value)} required />
              <Field label="Sena kaina" value={draft.oldPrice} onChange={(value) => update("oldPrice", value)} />
              <p className="self-end pb-2 text-xs font-medium text-[#2f7f7b]" aria-live="polite">
                {discount ? `Sutaupote ${discount.amountLabel} (${discount.percentLabel})` : "Nuolaida bus rodoma įvedus didesnę seną kainą."}
              </p>
              <Field label="Hero etiketė" value={draft.eyebrow} onChange={(value) => update("eyebrow", value)} />
              <Field label="Tiekėjo užsakymo nuoroda (matoma tik admin)" value={draft.supplierUrl} onChange={(value) => update("supplierUrl", value)} />
              <Field label="Trumpas aprašymas" value={draft.description} onChange={(value) => update("description", value)} multiline required />
              <Field label="Pilnas aprašymas" value={draft.longDescription} onChange={(value) => update("longDescription", value)} multiline required />
              <div className="grid gap-3 sm:col-span-2">
                <label className="grid gap-1.5 text-xs font-medium text-[#203b40]/70">Produkto nuotraukos
                  <input type="file" accept="image/*" multiple disabled={isUploading} onChange={(event) => { void uploadImages(event.currentTarget.files); event.currentTarget.value = ""; }} className="rounded-lg border border-[#203b40]/15 bg-white px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#e4f1ed] file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#2f7f7b]" />
                </label>
                {isUploading && <p role="status" className="text-xs text-[#203b40]/55">Įkeliamos nuotraukos…</p>}
                {uploadError && <p role="alert" className="text-xs text-[#bd6659]">{uploadError}</p>}
                {draft.gallery.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">{draft.gallery.map((image) => <div key={image} className="grid gap-2 rounded-lg border border-[#203b40]/10 bg-white p-2"><img src={image} alt="Produkto nuotrauka" className="aspect-square w-full rounded-md object-cover" /><div className="flex items-center justify-between gap-2"><label className="flex items-center gap-1.5 text-xs text-[#203b40]/70"><input type="radio" name="hero-image" checked={draft.heroImage === image} onChange={() => update("heroImage", image)} />Pagrindinė</label><button type="button" onClick={() => removeImage(image)} className="text-xs font-medium text-[#bd6659]">Pašalinti</button></div></div>)}</div>}
              </div>
              <Field label="Privalumai, po vieną eilutėje" value={draft.features.join("\n")} onChange={(value) => updateLines("features", value)} multiline />
              <Field label="Naudojimo žingsniai, po vieną eilutėje" value={draft.steps.join("\n")} onChange={(value) => updateLines("steps", value)} multiline />
              <Field label="Pristatymo informacija" value={draft.deliveryInfo} onChange={(value) => update("deliveryInfo", value)} />
              <Field label="Grąžinimo informacija" value={draft.returnsInfo} onChange={(value) => update("returnsInfo", value)} />
            </div>
          </section>
          {(formError || saveError) && <p role="alert" className="text-sm text-[#bd6659]">{formError || "Nepavyko išsaugoti. Patikrinkite laukus ir duomenų bazės ryšį."}</p>}
          {isSuccess && <p role="status" className="text-sm font-medium text-[#2f7f7b]">Produktas išsaugotas. Pakeitimai rodomi jo viešame puslapyje.</p>}
          <div className="flex flex-wrap items-center gap-3"><button type="submit" disabled={isSaving || isUploading || (isLoading && !isNew)} className="admin-primary-action disabled:opacity-60">{isSaving ? "Saugoma…" : isUploading ? "Įkeliama…" : "Išsaugoti produktą"}</button><Link to="/admin" className="admin-row-action">Atšaukti</Link></div>
        </form>
      </div>
    </main>
  );
}
