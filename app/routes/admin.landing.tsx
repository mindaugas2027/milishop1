import { useActionMutation, useActionQuery } from "@agent-native/core/client/hooks";
import { useEffect, useState } from "react";
import { Link } from "react-router";

type Spec = { label: string; value: string };
type Faq = { question: string; answer: string };
type LandingForm = {
  slug: string;
  brandName: string;
  footerText: string;
  name: string;
  eyebrow: string;
  description: string;
  longDescription: string;
  price: string;
  oldPrice: string;
  saving: string;
  heroImage: string;
  gallery: string[];
  features: string[];
  steps: string[];
  specs: Spec[];
  faq: Faq[];
  deliveryInfo: string;
  returnsInfo: string;
  ctaText: string;
  finalCtaEyebrow: string;
  finalCtaTitle: string;
  finalCtaText: string;
};

const uploadedImages = [
  "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F1cf73157227448c7a9abcdea548b4cb3?format=webp&width=800&height=1200",
  "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F539cd33740b54e819abe0b450e6b2e03?format=webp&width=800&height=1200",
  "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F88e523bfe09b4316949e448a2f14c72b?format=webp&width=800&height=1200",
  "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F74a6c2b42d5e4c23b5bbe39577b18ed1?format=webp&width=800&height=1200",
  "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F23e189594a364d70b3cf875d33aa04f9?format=webp&width=800&height=1200",
  "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F4f167c94667d4251a5b5a12948ff41f6?format=webp&width=800&height=1200",
];

const initialForm: LandingForm = {
  slug: "obd2",
  brandName: "atrinkta.",
  footerText: "Daiktai, kuriuos norisi turėti.",
  name: "OBD2 automobilio diagnostikos įrenginys",
  eyebrow: "Atrinkta #01 · Automobiliui",
  description: "Daugiau aiškumo prieš kelionę, servisą ar tiesiog kasdienį važiavimą.",
  longDescription: "Kompaktiškas OBD2 įrenginys padeda suprasti, kas vyksta tavo automobilyje. Prijunk, atsidaryk programėlę ir matyk svarbiausią informaciją vienoje vietoje — be sudėtingų meniu ar spėlionių. Tai patogus pirmas žingsnis, kai nori geriau pažinti savo automobilį.",
  price: "39,90 €",
  oldPrice: "49,90 €",
  saving: "Sutaupai 10 €",
  heroImage: uploadedImages[0],
  gallery: uploadedImages,
  features: ["Aiškesnė automobilio būklė", "Paprastas prijungimas", "Kompaktiškas dydis"],
  steps: ["Prijunk įrenginį prie OBD2 jungties", "Atidaryk suderinamą programėlę", "Peržiūrėk informaciją ir klaidų kodus"],
  specs: [{ label: "Jungtis", value: "OBD2 / 16 pin" }, { label: "Suderinamumas", value: "12 V automobiliai" }, { label: "Naudojimas", value: "Asmeniniam naudojimui" }, { label: "Komplektacija", value: "Įrenginys, instrukcija" }],
  faq: [{ question: "Ar tiks mano automobiliui?", answer: "Įrenginys skirtas daugumai automobilių su standartine OBD2 jungtimi." }, { question: "Ar programėlė pridedama?", answer: "Įrenginys veikia su populiariomis suderinamomis diagnostikos programėlėmis." }, { question: "Per kiek laiko gausiu prekę?", answer: "Užsakymus Lietuvoje išsiunčiame per 1–2 darbo dienas." }],
  deliveryInfo: "Pristatymas per 1–2 d. d.",
  returnsInfo: "14 dienų grąžinimas",
  ctaText: "Pirkti dabar",
  finalCtaEyebrow: "Pasiruošę išbandyti?",
  finalCtaTitle: "OBD2 automobilio diagnostikos įrenginys",
  finalCtaText: "Pirkti dabar",
};

function Field({ label, value, onChange, multiline = false }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean }) {
  return <label className="landing-field"><span>{label}</span>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} rows={4} /> : <input value={value} onChange={(event) => onChange(event.target.value)} />}</label>;
}

function Section({ title, eyebrow, children }: { title: string; eyebrow?: string; children: React.ReactNode }) {
  return <section className="landing-editor-section"><div className="landing-editor-heading">{eyebrow && <p>{eyebrow}</p>}<h2>{title}</h2></div>{children}</section>;
}

export function meta() {
  return [{ title: "Redaguoti landing puslapį — Atrinkta" }];
}

export default function AdminLandingRoute() {
  const { data } = useActionQuery("get-product-landing", { slug: "obd2" });
  const { mutate, isPending, isSuccess, error } = useActionMutation("update-product-landing");
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (data) setForm({ ...initialForm, ...data });
  }, [data]);

  const update = <K extends keyof LandingForm>(key: K, value: LandingForm[K]) => setForm((current) => ({ ...current, [key]: value }));
  const updateList = (key: "gallery" | "features" | "steps", index: number, value: string) => update(key, form[key].map((item, itemIndex) => itemIndex === index ? value : item));
  const addListItem = (key: "gallery" | "features" | "steps") => update(key, [...form[key], ""]);
  const removeListItem = (key: "gallery" | "features" | "steps", index: number) => update(key, form[key].filter((_, itemIndex) => itemIndex !== index));
  const save = () => mutate(form);

  return <div className="admin-shell min-h-screen bg-[#f7f8f6] text-[#203b40]"><aside className="admin-sidebar hidden border-r border-[#203b40]/8 bg-white lg:flex lg:flex-col"><div className="flex items-center gap-2.5 px-7 py-7"><span className="brand-mark" aria-hidden="true"><span /></span><span className="text-[17px] font-semibold tracking-[-0.04em]">atrinkta<span className="text-[#61aaa3]">.</span></span></div><div className="px-5"><p className="admin-label px-3">Parduotuvė</p><nav className="mt-3 grid gap-1"><Link to="/admin" className="admin-nav-item"><span className="admin-nav-symbol">⌂</span>Apžvalga</Link><Link to="/admin/landing" className="admin-nav-item admin-nav-item-active"><span className="admin-nav-symbol">□</span>Landing puslapis</Link><Link to="/admin" className="admin-nav-item"><span className="admin-nav-symbol">↗</span>Užsakymai</Link><Link to="/admin" className="admin-nav-item"><span className="admin-nav-symbol">◌</span>Nustatymai</Link></nav></div><div className="mt-auto px-5 pb-6"><Link to="/obd2" className="block rounded-2xl bg-[#e4f1ed] p-4"><p className="text-xs font-semibold text-[#2f7f7b]">Peržiūrėti landing</p><p className="mt-1 text-xs leading-5 text-[#557875]">Atidarykite viešą produkto puslapį.</p><span className="mt-3 inline-flex text-xs font-semibold text-[#2f7f7b]">/obd2 ↗</span></Link></div></aside><div className="min-w-0 flex-1"><header className="flex items-center justify-between border-b border-[#203b40]/8 bg-white px-5 py-4 sm:px-8 lg:hidden"><Link to="/admin" className="flex items-center gap-2.5"><span className="brand-mark" aria-hidden="true"><span /></span><span className="text-[17px] font-semibold tracking-[-0.04em]">atrinkta<span className="text-[#61aaa3]">.</span></span></Link><Link to="/obd2" className="text-xs font-semibold text-[#2f7f7b]">Peržiūrėti ↗</Link></header><main className="mx-auto max-w-[1160px] px-5 py-7 sm:px-8 sm:py-10 lg:px-12 lg:py-12"><div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><Link to="/admin" className="text-xs font-semibold text-[#398b86] hover:underline">← Administravimas</Link><h1 className="mt-3 text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">One Product landing</h1><p className="mt-2 text-sm text-[#203b40]/50">Redaguojate puslapį <span className="font-semibold text-[#203b40]/70">/{form.slug}</span></p></div><div className="flex items-center gap-3"><Link to="/obd2" className="rounded-full border border-[#203b40]/10 bg-white px-4 py-2.5 text-sm font-medium text-[#203b40]/65">Peržiūrėti puslapį</Link><button onClick={save} disabled={isPending} className="rounded-full bg-[#2f7f7b] px-5 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(47,127,123,0.16)] disabled:opacity-60">{isPending ? "Saugoma…" : "Išsaugoti pakeitimus"}</button></div></div>{isSuccess && <div className="landing-save-notice">Pakeitimai išsaugoti. Viešas produkto puslapis atnaujintas.</div>}{error && <div className="landing-error-notice">Nepavyko išsaugoti pakeitimų. Patikrinkite laukus ir bandykite dar kartą.</div>}

<Section eyebrow="Pagrindinė informacija" title="Brandas ir produkto hero"><div className="landing-field-grid"><Field label="Brandas" value={form.brandName} onChange={(value) => update("brandName", value)} /><Field label="Produkto slug" value={form.slug} onChange={(value) => update("slug", value)} /><Field label="Produkto pavadinimas" value={form.name} onChange={(value) => update("name", value)} /><Field label="Hero etiketė" value={form.eyebrow} onChange={(value) => update("eyebrow", value)} /></div><div className="landing-field-grid landing-field-grid-wide"><Field label="Trumpas aprašymas" value={form.description} onChange={(value) => update("description", value)} /><Field label="Hero nuotraukos URL" value={form.heroImage} onChange={(value) => update("heroImage", value)} /></div></Section>

<Section eyebrow="Galerija" title="Produkto nuotraukos"><div className="landing-image-grid">{form.gallery.map((image, index) => <div className="landing-image-field" key={`${image}-${index}`}><img src={image || uploadedImages[0]} alt="" /><input value={image} onChange={(event) => updateList("gallery", index, event.target.value)} placeholder="https://..." /><button type="button" onClick={() => removeListItem("gallery", index)}>Pašalinti</button></div>)}</div><button type="button" onClick={() => addListItem("gallery")} className="landing-add-button">+ Pridėti nuotrauką</button></Section>

<Section eyebrow="Kaina ir pirkimas" title="CTA, kaina ir pristatymas"><div className="landing-field-grid landing-field-grid-three"><Field label="Dabartinė kaina" value={form.price} onChange={(value) => update("price", value)} /><Field label="Sena kaina" value={form.oldPrice} onChange={(value) => update("oldPrice", value)} /><Field label="Akcijos tekstas" value={form.saving} onChange={(value) => update("saving", value)} /></div><div className="landing-field-grid landing-field-grid-three"><Field label="Pristatymo informacija" value={form.deliveryInfo} onChange={(value) => update("deliveryInfo", value)} /><Field label="Grąžinimo informacija" value={form.returnsInfo} onChange={(value) => update("returnsInfo", value)} /><Field label="Hero CTA tekstas" value={form.ctaText} onChange={(value) => update("ctaText", value)} /></div><div className="landing-field-grid landing-field-grid-three"><Field label="Galutinio CTA etiketė" value={form.finalCtaEyebrow} onChange={(value) => update("finalCtaEyebrow", value)} /><Field label="Galutinio CTA pavadinimas" value={form.finalCtaTitle} onChange={(value) => update("finalCtaTitle", value)} /><Field label="Galutinio CTA tekstas" value={form.finalCtaText} onChange={(value) => update("finalCtaText", value)} /></div></Section>

<Section eyebrow="Turinys" title="Aprašymas ir privalumai"><Field label="Pilnas produkto aprašymas" value={form.longDescription} onChange={(value) => update("longDescription", value)} multiline /><div className="landing-list-editor"><div className="landing-list-header"><span>Privalumai</span><button type="button" onClick={() => addListItem("features")}>+ Pridėti</button></div>{form.features.map((feature, index) => <div className="landing-list-row" key={`feature-${index}`}><span>0{index + 1}</span><input value={feature} onChange={(event) => updateList("features", index, event.target.value)} /><button type="button" onClick={() => removeListItem("features", index)} aria-label="Pašalinti privalumą">×</button></div>)}</div></Section>

<Section eyebrow="Naudojimas" title="Žingsniai ir specifikacijos"><div className="landing-two-column"><div className="landing-list-editor"><div className="landing-list-header"><span>Naudojimo žingsniai</span><button type="button" onClick={() => addListItem("steps")}>+ Pridėti</button></div>{form.steps.map((step, index) => <div className="landing-list-row" key={`step-${index}`}><span>0{index + 1}</span><input value={step} onChange={(event) => updateList("steps", index, event.target.value)} /><button type="button" onClick={() => removeListItem("steps", index)} aria-label="Pašalinti žingsnį">×</button></div>)}</div><div className="landing-list-editor"><div className="landing-list-header"><span>Specifikacijos</span><button type="button" onClick={() => update("specs", [...form.specs, { label: "", value: "" }])}>+ Pridėti</button></div>{form.specs.map((spec, index) => <div className="landing-pair-row" key={`spec-${index}`}><input value={spec.label} onChange={(event) => update("specs", form.specs.map((item, itemIndex) => itemIndex === index ? { ...item, label: event.target.value } : item))} placeholder="Pavadinimas" /><input value={spec.value} onChange={(event) => update("specs", form.specs.map((item, itemIndex) => itemIndex === index ? { ...item, value: event.target.value } : item))} placeholder="Reikšmė" /><button type="button" onClick={() => update("specs", form.specs.filter((_, itemIndex) => itemIndex !== index))} aria-label="Pašalinti specifikaciją">×</button></div>)}</div></div></Section>

<Section eyebrow="DUK" title="Dažniausiai užduodami klausimai"><div className="landing-list-editor">{form.faq.map((item, index) => <div className="landing-faq-row" key={`faq-${index}`}><div className="landing-faq-title"><span>0{index + 1}</span><input value={item.question} onChange={(event) => update("faq", form.faq.map((faq, faqIndex) => faqIndex === index ? { ...faq, question: event.target.value } : faq))} placeholder="Klausimas" /><button type="button" onClick={() => update("faq", form.faq.filter((_, faqIndex) => faqIndex !== index))} aria-label="Pašalinti klausimą">×</button></div><textarea value={item.answer} onChange={(event) => update("faq", form.faq.map((faq, faqIndex) => faqIndex === index ? { ...faq, answer: event.target.value } : faq))} rows={3} placeholder="Atsakymas" /></div>)}<button type="button" onClick={() => update("faq", [...form.faq, { question: "", answer: "" }])} className="landing-add-button">+ Pridėti klausimą</button></div></Section>

<Section eyebrow="Poraštė" title="Footer tekstas"><div className="landing-field-grid"><Field label="Footer sakinys" value={form.footerText} onChange={(value) => update("footerText", value)} /><div className="landing-current-year"><span>Metai</span><strong>© {new Date().getFullYear()}</strong><small>Rodoma automatiškai pagal einamuosius metus.</small></div></div></Section>
<div className="landing-editor-bottom"><button onClick={save} disabled={isPending} className="rounded-full bg-[#2f7f7b] px-6 py-3 text-sm font-semibold text-white disabled:opacity-60">{isPending ? "Saugoma…" : "Išsaugoti viską"}</button></div>
</main></div></div>;
}
