import { useActionQuery } from "@agent-native/core/client/hooks";
import { useLayoutEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";

import { addCartItem, readCart, writeCart } from "@/lib/cart";

const catalog = {
  obd2: {
    name: "OBD2 automobilio diagnostikos įrenginys",
    eyebrow: "Milishop #01 · Automobiliui",
    description:
      "Daugiau aiškumo prieš kelionę, servisą ar tiesiog kasdienį važiavimą.",
    longDescription:
      "Kompaktiškas OBD2 įrenginys padeda suprasti, kas vyksta tavo automobilyje. Prijunk, atsidaryk programėlę ir matyk svarbiausią informaciją vienoje vietoje — be sudėtingų meniu ar spėlionių. Tai patogus pirmas žingsnis, kai nori geriau pažinti savo automobilį.",
    price: "39,90 €",
    oldPrice: "49,90 €",
    saving: "Sutaupai 10 €",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F1cf73157227448c7a9abcdea548b4cb3?format=webp&width=800&height=1200",
    images: [
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F1cf73157227448c7a9abcdea548b4cb3?format=webp&width=800&height=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F539cd33740b54e819abe0b450e6b2e03?format=webp&width=800&height=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F88e523bfe09b4316949e448a2f14c72b?format=webp&width=800&height=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F74a6c2b42d5e4c23b5bbe39577b18ed1?format=webp&width=800&height=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F23e189594a364d70b3cf875d33aa04f9?format=webp&width=800&height=1200",
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F4f167c94667d4251a5b5a12948ff41f6?format=webp&width=800&height=1200",
    ],
    features: [
      "Aiškesnė automobilio būklė",
      "Paprastas prijungimas",
      "Kompaktiškas dydis",
    ],
    steps: [
      "Prijunk įrenginį prie OBD2 jungties",
      "Atidaryk suderinamą programėlę",
      "Peržiūrėk informaciją ir klaidų kodus",
    ],
    specs: [
      ["Jungtis", "OBD2 / 16 pin"],
      ["Suderinamumas", "12 V automobiliai"],
      ["Naudojimas", "Asmeniniam naudojimui"],
      ["Komplektacija", "Įrenginys, instrukcija"],
    ],
    faq: [
      [
        "Ar tiks mano automobiliui?",
        "Įrenginys skirtas daugumai automobilių su standartine OBD2 jungtimi. Prieš perkant rekomenduojame patikrinti savo automobilio modelio suderinamumą.",
      ],
      [
        "Ar programėlė pridedama?",
        "Įrenginys veikia su populiariomis suderinamomis diagnostikos programėlėmis. Trumpa prijungimo instrukcija yra komplekte.",
      ],
      [
        "Per kiek laiko gausiu prekę?",
        "Užsakymus Lietuvoje išsiunčiame per 1–2 darbo dienas.",
      ],
    ],
  },
  "automobilio-laikiklis": {
    name: "Magnetinis automobilio telefono laikiklis",
    eyebrow: "Milishop #02 · Kelionei",
    description: "Stabilus, minimalus ir pasiruošęs kiekvienai kelionei.",
    longDescription:
      "Laikiklis, kuris netrukdo. Tvirtas magnetas, patogus kampas ir minimalus dizainas padeda telefoną turėti ten, kur jo reikia — prieš akis, bet ne kelyje. Jis lengvai įsilieja į automobilio saloną ir neužima daugiau vietos nei būtina.",
    price: "24,90 €",
    oldPrice: "29,90 €",
    saving: "Sutaupai 5 €",
    image:
      "https://images.pexels.com/photos/12953565/pexels-photo-12953565.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      "https://images.pexels.com/photos/12953565/pexels-photo-12953565.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/86993/pexels-photo-86993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    features: [
      "Stiprus magnetinis laikymas",
      "Pasukamas žiūrėjimo kampas",
      "Montuojamas be įrankių",
    ],
    steps: [
      "Nuvalyk pasirinkto paviršiaus vietą",
      "Pritvirtink laikiklio pagrindą",
      "Uždėk magnetinį žiedą ir telefoną",
    ],
    specs: [
      ["Tvirtinimas", "Magnetinis"],
      ["Korpusas", "Aliuminis ir ABS"],
      ["Reguliavimas", "360° kampas"],
      ["Komplektacija", "Laikiklis, žiedas, lipni bazė"],
    ],
    faq: [
      [
        "Ar laikiklis tiks storam telefono dėklui?",
        "Dažniausiai taip, jei magnetinis žiedas pritvirtintas prie dėklo išorės. Labai stori ar metaliniai dėklai gali sumažinti laikymo jėgą.",
      ],
      [
        "Ar galima keisti kampą?",
        "Taip, laikiklio galvutė pasisuka 360°, todėl patogų kampą rasi tiek navigacijai, tiek skambučiams.",
      ],
      [
        "Ar galima nuimti nepaliekant žymių?",
        "Pagrindą nuimk lėtai, šildydamas lipnią dalį. Naudojant pagal instrukciją, paviršius lieka švarus.",
      ],
    ],
  },
  "namu-akcentas": {
    name: "Keraminė stalo detalė „Forma“",
    eyebrow: "Milishop #03 · Namams",
    description: "Mažas akcentas, kuris suteikia erdvei daugiau jaukumo.",
    longDescription:
      "Rankų darbo įkvėpta keraminė detalė su natūralia tekstūra ir tyliu charakteriu. Tinka vienai, poroje ar kaip maža dovana žmogui, kuris vertina daiktų paprastumą. Kiekvienas paviršius turi subtilių skirtumų, todėl kiekviena detalė yra šiek tiek sava.",
    price: "32,00 €",
    oldPrice: "",
    saving: "",
    image:
      "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&w=1600",
    images: [
      "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&w=1600",
      "https://images.pexels.com/photos/86993/pexels-photo-86993.jpeg?auto=compress&cs=tinysrgb&w=1200",
    ],
    features: [
      "Natūrali keramikos tekstūra",
      "Tinka įvairiam interjerui",
      "Gera dovanos idėja",
    ],
    steps: [
      "Išsirink vietą, kur norisi mažo akcento",
      "Sukomponuok su mėgstamais daiktais",
      "Mėgaukis tyliu kasdieniu grožiu",
    ],
    specs: [
      ["Medžiaga", "Keramika"],
      ["Priežiūra", "Valyti sausa šluoste"],
      ["Spalva", "Natūrali smėlio"],
      ["Komplektacija", "1 keraminė detalė"],
    ],
    faq: [
      [
        "Ar kiekviena detalė vienoda?",
        "Ne visai. Natūrali tekstūra ir rankų darbo įkvėptas procesas reiškia, kad kiekvienas paviršius gali turėti mažų, gražių skirtumų.",
      ],
      [
        "Kaip ją prižiūrėti?",
        "Valykite minkšta sausa arba vos drėgna šluoste. Nenaudokite abrazyvių valiklių.",
      ],
      [
        "Ar tinka dovanai?",
        "Taip. Detalė siunčiama saugiai supakuota ir tinka kaip subtili dovana įkurtuvių ar gimtadienio proga.",
      ],
    ],
  },
} as const;

type Product = (typeof catalog)[keyof typeof catalog];

export function meta({ params }: { params: { slug?: string } }) {
  const slug = params.slug === "obd" ? "obd2" : params.slug;
  const product = slug ? catalog[slug as keyof typeof catalog] : undefined;
  return [
    { title: product ? `${product.name} — Milishop` : "Produktas — Milishop" },
  ];
}

function ProductPage({
  baseProduct,
  slug,
}: {
  baseProduct?: Product;
  slug: string;
}) {
  const { data: savedLanding, isPending: isLandingPending } = useActionQuery("get-product-landing", {
    slug,
  });
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  if (!baseProduct && !savedLanding && isLandingPending) {
    return <div className="min-h-[60vh] animate-pulse bg-[#f7f8f6]" aria-label="Įkeliamas produktas" />;
  }
  if (savedLanding?.status === "hidden") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">Šios prekės šiuo metu nėra.</h1>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-[#2f7f7b] px-5 py-3 text-sm font-semibold text-white">Grįžti į katalogą</Link>
        </div>
      </div>
    );
  }
  if (!baseProduct && !savedLanding) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">404</p>
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">Šio produkto neradome.</h1>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-[#2f7f7b] px-5 py-3 text-sm font-semibold text-white">Grįžti į katalogą</Link>
        </div>
      </div>
    );
  }
  const fallbackProduct = baseProduct ?? catalog.obd2;
  const product = {
    ...fallbackProduct,
    brandName: "Milishop",
    footerText: "Daiktai, kuriuos norisi turėti.",
    deliveryInfo: "Pristatymas per 1–2 d. d.",
    returnsInfo: "14 dienų grąžinimas",
    ctaText: "Pirkti dabar",
    finalCtaEyebrow: "Pasiruošę išbandyti?",
    finalCtaTitle: fallbackProduct.name,
    finalCtaText: "Pirkti dabar",
    ...(savedLanding
      ? {
          brandName: savedLanding.brandName,
          footerText: savedLanding.footerText,
          name: savedLanding.name,
          eyebrow: savedLanding.eyebrow,
          description: savedLanding.description,
          longDescription: savedLanding.longDescription,
          price: savedLanding.price,
          oldPrice: savedLanding.oldPrice,
          saving: savedLanding.saving,
          image: savedLanding.heroImage || baseProduct?.image || "",
          images: savedLanding.heroImage
            ? [
                savedLanding.heroImage,
                ...savedLanding.gallery.filter(
                  (image) => image !== savedLanding.heroImage,
                ),
              ]
            : baseProduct?.images ?? [],
          features: savedLanding.features.length
            ? savedLanding.features
            : baseProduct?.features ?? [],
          steps: savedLanding.steps.length
            ? savedLanding.steps
            : baseProduct?.steps ?? [],
          specs: savedLanding.specs.length
            ? savedLanding.specs.map(
                ({ label, value }) => [label, value] as [string, string],
              )
            : baseProduct?.specs ?? [],
          faq: savedLanding.faq.length
            ? savedLanding.faq.map(
                ({ question, answer }) =>
                  [question, answer] as [string, string],
              )
            : baseProduct?.faq ?? [],
          deliveryInfo: savedLanding.deliveryInfo,
          returnsInfo: savedLanding.returnsInfo,
          ctaText: savedLanding.ctaText,
          finalCtaEyebrow: savedLanding.finalCtaEyebrow,
          finalCtaTitle: savedLanding.finalCtaTitle,
          finalCtaText: savedLanding.finalCtaText,
        }
      : {}),
  };

  const addCurrentProductToCart = () => {
    writeCart(addCartItem(readCart(), {
      slug,
      name: product.name,
      price: product.price,
      image: product.images[0] || product.image,
    }, quantity));
    setAdded(true);
    navigate("/?cart=open");
  };

  return (
    <div className="milishop-product-page min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          className="group flex items-center gap-2.5"
          aria-label="Grįžti į Milishop"
        >
          <span className="levitara-logo-mark" aria-hidden="true">
            M
          </span>
          <span className="text-[17px] font-semibold tracking-[-0.04em]">
            milishop
          </span>
        </Link>
        <Link
          to="/"
          className="rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-[#61aaa3] hover:text-foreground"
        >
          ← Visi produktai
        </Link>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 pb-20 pt-5 sm:px-8 sm:pt-10 lg:px-10 lg:pb-28">
        <div className="mb-7 flex items-center gap-2 text-xs text-foreground/45">
          <Link to="/" className="hover:text-foreground">
            Milishop
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <section className="grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
          <div>
            <div className="product-detail-image relative overflow-hidden rounded-[28px] bg-[#e4f1ed]">
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="size-full min-h-[370px] object-contain mix-blend-multiply sm:min-h-[560px]"
              />
              <span className="absolute left-5 top-5 rounded-full bg-white/85 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#3b6969] backdrop-blur-sm">
                Milishop kolekcija
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  onClick={() => setActiveImage(index)}
                  className={`overflow-hidden rounded-2xl border-2 bg-[#e4f1ed] transition-[border-color,opacity] ${activeImage === index ? "border-[#3b8b87]" : "border-transparent opacity-55 hover:opacity-100"}`}
                  aria-label={`Rodyti nuotrauką ${index + 1}`}
                >
                  <img
                    src={image}
                    alt=""
                    className="aspect-[1.5] w-full object-cover mix-blend-multiply"
                  />
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col justify-center py-2 lg:py-8">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">
              {product.eyebrow}
            </p>
            <h1 className="max-w-[570px] text-[clamp(2.35rem,4.5vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.075em] text-[#203b40]">
              {product.name}
            </h1>
            <p className="mt-6 max-w-[480px] text-[16px] leading-7 text-foreground/55">
              {product.description}
            </p>
            <div className="mt-8 flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">
                {product.price}
              </span>
              {product.oldPrice && (
                <span className="text-base text-foreground/35 line-through">
                  {product.oldPrice}
                </span>
              )}
            </div>
            {product.saving && (
              <p className="mt-2 text-sm font-medium text-[#3b8b87]">
                {product.saving}
              </p>
            )}
            <div className="my-8 h-px bg-foreground/10" />
            <div className="grid gap-4 text-sm text-foreground/60 sm:grid-cols-2">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#e4f1ed] text-[#398b86]">
                  ✓
                </span>
                <span>{product.deliveryInfo}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-[#f5f2ec] text-[#a06d3d]">
                  ↺
                </span>
                <span>{product.returnsInfo}</span>
              </div>
            </div>
            <div className="mt-9 flex gap-3">
              <div className="flex items-center rounded-full border border-foreground/12 bg-white">
                <button
                  className="flex size-11 items-center justify-center text-lg text-foreground/55 hover:text-foreground"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Sumažinti kiekį"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-semibold">
                  {quantity}
                </span>
                <button
                  className="flex size-11 items-center justify-center text-lg text-foreground/55 hover:text-foreground"
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Padidinti kiekį"
                >
                  +
                </button>
              </div>
              <button
                onClick={addCurrentProductToCart}
                className={`flex min-h-11 flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,127,123,0.18)] transition-[background-color,transform] hover:-translate-y-0.5 ${added ? "bg-[#527072]" : "bg-[#2f7f7b] hover:bg-[#256d69]"}`}
              >
                {added ? "Pridėta į krepšelį" : `${product.ctaText}  ↗`}
              </button>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-10 border-t border-foreground/10 pt-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">
              Apie produktą
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">
              Paprasta naudoti.
              <br />
              Malonu turėti.
            </h2>
          </div>
          <div>
            <p className="max-w-[650px] text-[17px] leading-8 text-foreground/60">
              {product.longDescription}
            </p>
            <div className="mt-9 grid gap-5 sm:grid-cols-3">
              {product.features.map((feature, index) => (
                <div key={feature}>
                  <p className="text-2xl">0{index + 1}</p>
                  <p className="mt-2 text-sm font-medium">{feature}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-8 rounded-[28px] bg-[#e4f1ed] p-7 sm:p-10 lg:grid-cols-[0.72fr_1.28fr] lg:p-14">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">
              Kaip naudoti
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">
              Trys žingsniai
              <br />į paprasčiau.
            </h2>
          </div>
          <div className="grid gap-3">
            {product.steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-4 rounded-2xl bg-white/70 px-5 py-4"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#2f7f7b] text-xs font-semibold text-white">
                  0{index + 1}
                </span>
                <p className="text-sm font-medium text-[#203b40]">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">
              Specifikacija
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">
              Svarbiausia
              <br />
              vienoje vietoje.
            </h2>
          </div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {product.specs.map(([label, value]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-5 py-4 text-sm"
              >
                <span className="text-foreground/45">{label}</span>
                <span className="text-right font-medium text-[#203b40]">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-20 grid gap-10 lg:grid-cols-[0.72fr_1.28fr]">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">
              Dažniausiai klausiama
            </p>
            <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">
              Turite klausimų?
            </h2>
          </div>
          <div className="divide-y divide-foreground/10 border-y border-foreground/10">
            {product.faq.map(([question, answer]) => (
              <details key={question} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-[#203b40]">
                  <span>{question}</span>
                  <span className="text-xl font-normal text-[#398b86] transition-transform group-open:rotate-45">
                    +
                  </span>
                </summary>
                <p className="max-w-[600px] pt-3 text-sm leading-6 text-foreground/55">
                  {answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mt-20 overflow-hidden rounded-[28px] bg-[#203b40] px-7 py-10 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8ed1c7]">
              {product.finalCtaEyebrow}
            </p>
            <h2 className="mt-3 max-w-[560px] text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              {product.finalCtaTitle}
            </h2>
          </div>
          <div className="mt-7 flex items-center gap-5 lg:mt-0">
            <span className="text-2xl font-semibold tracking-[-0.05em]">
              {product.price}
            </span>
            <button
              onClick={addCurrentProductToCart}
              className="rounded-full bg-[#8ed1c7] px-6 py-3.5 text-sm font-semibold text-[#203b40] transition-[background-color,transform] hover:-translate-y-0.5 hover:bg-white"
            >
              {added ? "Pridėta ✓" : `${product.finalCtaText} ↗`}
            </button>
          </div>
        </section>
      </main>
      <footer className="border-t border-foreground/8 px-5 py-8 text-center text-sm text-foreground/45">
        {product.brandName} · {product.footerText} · ©{" "}
        {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default function ProductRoute() {
  const { slug } = useParams();
  const productSlug = slug === "obd" ? "obd2" : slug;
  const product = productSlug
    ? catalog[productSlug as keyof typeof catalog]
    : undefined;
  useLayoutEffect(() => {
    document
      .querySelector<HTMLElement>(".agent-native-app-main")
      ?.scrollTo(0, 0);
  }, [slug]);
  if (!slug)
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">
            404
          </p>
          <h1 className="text-3xl font-semibold tracking-[-0.05em]">
            Šio produkto neradome.
          </h1>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-[#2f7f7b] px-5 py-3 text-sm font-semibold text-white"
          >
            Grįžti į katalogą
          </Link>
        </div>
      </div>
    );
  return <ProductPage baseProduct={product} slug={productSlug ?? slug} />;
}
