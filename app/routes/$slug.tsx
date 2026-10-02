import * as Dialog from "@radix-ui/react-dialog";
import { IconChevronLeft, IconChevronRight, IconX, IconZoomIn } from "@tabler/icons-react";
import { useActionQuery } from "@agent-native/core/client/hooks";
import { useEffect, useLayoutEffect, useState } from "react";
import { Link, useParams } from "react-router";

import { StoreCartDrawer } from "@/components/StoreCartDrawer";
import { StoreFooter, StorePaymentStrip } from "@/components/StorefrontChrome";
import { addCartItem, calculateDiscount, readCart, type CartLine, writeCart } from "@/lib/cart";

const deliveryPartners = [
  { name: "DPD", brand: "dpd" },
  { name: "Omniva", brand: "omniva" },
  { name: "Venipak", brand: "venipak" },
  { name: "LP Express", brand: "lp-express" },
] as const;

const paymentBrands = [
  { name: "Swedbank", brand: "swedbank" },
  { name: "SEB", brand: "seb" },
  { name: "Luminor", brand: "luminor" },
  { name: "Revolut", brand: "revolut" },
  { name: "VISA", brand: "visa" },
] as const;

export function meta() {
  return [
    { title: "Produktas — Milishop" },
  ];
}

function ProductPage({ slug }: { slug: string }) {
  const { data: savedLanding, isPending: isLandingPending, isError: isLandingError } = useActionQuery("get-product-landing", {
    slug,
  });
  const [activeImage, setActiveImage] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);

  useEffect(() => {
    setCartItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);
  const imageCount = savedLanding
    ? (savedLanding.heroImage ? 1 : 0) + savedLanding.gallery.filter((image) => image !== savedLanding.heroImage).length
    : 0;

  useEffect(() => {
    if (!imageViewerOpen) return;
    const handleImageViewerKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setImageViewerOpen(false);
        return;
      }
      if (imageCount < 2) return;
      const direction = event.key === "ArrowLeft" ? -1 : event.key === "ArrowRight" ? 1 : 0;
      if (direction) {
        event.preventDefault();
        setActiveImage((current) => (current + direction + imageCount) % imageCount);
      }
    };
    window.addEventListener("keydown", handleImageViewerKeyDown);
    return () => window.removeEventListener("keydown", handleImageViewerKeyDown);
  }, [imageCount, imageViewerOpen]);

  if (isLandingPending) {
    return <div className="min-h-[60vh] animate-pulse bg-[#f7f8f6]" aria-label="Įkeliamas produktas" />;
  }
  if (isLandingError) {
    return <div role="alert" className="flex min-h-[60vh] items-center justify-center px-6 text-sm text-[#9a3939]">Nepavyko įkelti produkto. Bandykite dar kartą.</div>;
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
  if (!savedLanding) {
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
  const product = {
    ...savedLanding,
    image: savedLanding.heroImage,
    images: [savedLanding.heroImage, ...savedLanding.gallery.filter((image) => image !== savedLanding.heroImage)],
    specs: savedLanding.specs.map(({ label, value }) => [label, value] as [string, string]),
    faq: savedLanding.faq.map(({ question, answer }) => [question, answer] as [string, string]),
  };
  const discount = calculateDiscount(product.price, product.oldPrice);
  const activeImageSrc = product.images[activeImage] ?? product.image;
  const changeActiveImage = (direction: number) => {
    if (product.images.length < 2) return;
    setActiveImage((current) => (current + direction + product.images.length) % product.images.length);
  };

  const addCurrentProductToCart = () => {
    const nextCart = addCartItem(cartItems, {
      slug,
      name: product.name,
      price: product.price,
      image: product.images[0] || product.image,
    }, quantity);
    setCartItems(nextCart);
    writeCart(nextCart);
    setAdded(true);
    setCartOpen(true);
  };

  const changeCartQuantity = (productSlug: string, amount: number) => {
    setCartItems((current) => current.flatMap((item) => {
      if (item.slug !== productSlug) return [item];
      const nextQuantity = item.quantity + amount;
      return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
    }));
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
        <div className="flex items-center gap-2">
          <StoreCartDrawer items={cartItems} open={cartOpen} onOpenChange={setCartOpen} onQuantityChange={changeCartQuantity} onOrderCreated={() => { setCartItems([]); writeCart([]); }} />
          <Link to="/" className="rounded-full border border-foreground/10 bg-white px-4 py-2 text-sm font-medium text-foreground/70 transition-colors hover:border-[#61aaa3] hover:text-foreground">← Visi produktai</Link>
        </div>
      </header>
      <main className="mx-auto max-w-[1240px] px-5 pb-20 pt-5 sm:px-8 sm:pt-10 lg:px-10 lg:pb-28">
        <div className="mb-7 flex items-center gap-2 text-xs text-foreground/45">
          <Link to="/" className="hover:text-foreground">
            Milishop
          </Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>
        <section className="product-detail-layout grid gap-8 lg:grid-cols-[1.04fr_0.96fr] lg:gap-16">
          <div className="product-gallery-sticky">
            <Dialog.Root open={imageViewerOpen} onOpenChange={setImageViewerOpen}>
              <Dialog.Trigger asChild>
                <button type="button" className="product-detail-image product-detail-image-open relative overflow-hidden rounded-[28px] bg-white" aria-label="Padidinti produkto nuotrauką">
                  <img
                    src={activeImageSrc}
                    alt={product.name}
                    className="size-full min-h-[370px] object-contain mix-blend-multiply sm:min-h-[560px]"
                  />
                  <span className="product-image-zoom" aria-hidden="true"><IconZoomIn size={20} stroke={1.8} /></span>
                </button>
              </Dialog.Trigger>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-2xl border-2 bg-white transition-[border-color,opacity] ${activeImage === index ? "border-[#171a19]" : "border-transparent opacity-55 hover:opacity-100"}`}
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
              <Dialog.Portal>
                <Dialog.Overlay className="product-lightbox-overlay" />
                <Dialog.Content className="product-lightbox-content">
                  <Dialog.Title className="sr-only">{product.name} nuotraukų peržiūra</Dialog.Title>
                  <Dialog.Close asChild>
                    <button type="button" className="product-lightbox-close" aria-label="Uždaryti nuotrauką"><IconX size={22} /></button>
                  </Dialog.Close>
                  {product.images.length > 1 && (
                    <>
                      <button type="button" className="product-lightbox-arrow product-lightbox-previous" onClick={() => changeActiveImage(-1)} aria-label="Ankstesnė nuotrauka"><IconChevronLeft size={28} /></button>
                      <button type="button" className="product-lightbox-arrow product-lightbox-next" onClick={() => changeActiveImage(1)} aria-label="Kita nuotrauka"><IconChevronRight size={28} /></button>
                    </>
                  )}
                  <img src={activeImageSrc} alt={`${product.name}, nuotrauka ${activeImage + 1}`} />
                  {product.images.length > 1 && <p className="product-lightbox-count" aria-live="polite">{activeImage + 1} / {product.images.length}</p>}
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
          <div className="product-detail-content flex flex-col py-2 lg:py-8">
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
              {discount && <span className="rounded-full bg-[#fbe9e7] px-2.5 py-1 text-xs font-bold text-[#bd514a]">{discount.percentLabel}</span>}
            </div>
            {discount && (
              <p className="mt-2 text-sm font-medium text-[#3b8b87]">
                Sutaupai {discount.amountLabel} ({discount.percentLabel})
              </p>
            )}
            <div className="mt-6 grid gap-4 border-y border-foreground/10 py-4">
              <div>
                <p className="text-sm font-semibold text-[#203b40]">Pristatymas</p>
                <p className="mt-1 text-sm text-foreground/65">{product.deliveryInfo} · {product.returnsInfo}</p>
                <div className="mt-3 flex flex-wrap gap-2" aria-label="Pristatymo partneriai">
                  {deliveryPartners.map((courier) => <span key={courier.brand} className={`product-provider product-provider-${courier.brand}`}>{courier.name}</span>)}
                </div>
              </div>
              <div>
                <p className="text-xs font-medium text-foreground/55">Atsiskaityk per</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2" aria-label="Galimi bankai ir mokėjimo būdai">
                  {paymentBrands.map((bank) => <span key={bank.brand} className={`product-provider product-provider-${bank.brand}`}>{bank.name}</span>)}
                </div>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
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
                className={`product-buy-button flex min-h-11 flex-1 items-center justify-center rounded-full px-6 text-sm font-semibold text-white transition-[background-color,transform] hover:-translate-y-0.5 ${added ? "bg-[#3d4341]" : "bg-[#171a19] hover:bg-[#3d4341]"}`}
              >
                {added ? "Pridėta į krepšelį" : `${product.ctaText}  ↗`}
              </button>
            </div>
            <p className="mt-3 text-xs text-foreground/45">Saugus atsiskaitymas · 14 dienų grąžinimas</p>

            <section className="product-detail-section mt-16 border-t border-foreground/10 pt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">Apie produktą</p>
              <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">Paprasta naudoti.<br />Malonu turėti.</h2>
              <p className="mt-6 max-w-[650px] text-[16px] leading-8 text-foreground/60">{product.longDescription}</p>
              <div className="mt-8 grid gap-4">
                {product.features.map((feature, index) => (
                  <div key={feature} className="flex items-center gap-4 border-b border-foreground/10 pb-4">
                    <span className="text-xs font-semibold text-[#398b86]">0{index + 1}</span>
                    <p className="text-sm font-medium text-[#203b40]">{feature}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="product-detail-section mt-12 border-t border-foreground/10 pt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">Kaip naudoti</p>
              <div className="mt-6 grid gap-3">
                {product.steps.map((step, index) => (
                  <div key={step} className="flex items-center gap-4 border-b border-foreground/10 px-1 py-4">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#171a19] text-xs font-semibold text-white">0{index + 1}</span>
                    <p className="text-sm font-medium text-[#203b40]">{step}</p>
                  </div>
                ))}
              </div>
            </section>

            {product.showSpecs && product.specs.length > 0 && <section className="product-detail-section mt-12 border-t border-foreground/10 pt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">Specifikacija</p>
              <div className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
                {product.specs.map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between gap-5 py-4 text-sm">
                    <span className="text-foreground/45">{label}</span>
                    <span className="text-right font-medium text-[#203b40]">{value}</span>
                  </div>
                ))}
              </div>
            </section>}

            {product.showFaq && product.faq.length > 0 && <section className="product-detail-section mt-12 border-t border-foreground/10 pt-10">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#398b86]">Dažniausiai klausiama</p>
              <h2 className="text-3xl font-semibold tracking-[-0.06em] text-[#203b40]">Turite klausimų?</h2>
              <div className="mt-6 divide-y divide-foreground/10 border-y border-foreground/10">
                {product.faq.map(([question, answer]) => (
                  <details key={question} className="group py-4">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-5 text-sm font-semibold text-[#203b40]">
                      <span>{question}</span>
                      <span className="text-xl font-normal text-[#398b86] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="max-w-[600px] pt-3 text-sm leading-6 text-foreground/55">{answer}</p>
                  </details>
                ))}
              </div>
            </section>}

            <section className="mt-12 border-t border-foreground/10 px-0 py-7 text-[#171a19]">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-foreground/50">{product.finalCtaEyebrow}</p>
              <h2 className="mt-3 text-2xl font-semibold text-[#171a19]">{product.finalCtaTitle}</h2>
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <span className="text-2xl font-semibold">{product.price}</span>
                <button onClick={addCurrentProductToCart} className="product-buy-button bg-[#171a19] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3d4341]">
                  {added ? "Pridėta ✓" : `${product.finalCtaText} ↗`}
                </button>
              </div>
            </section>
          </div>
        </section>
      </main>
      <StorePaymentStrip />
      <StoreFooter />
    </div>
  );
}

export default function ProductRoute() {
  const { slug } = useParams();
  const productSlug = slug === "obd" ? "obd2" : slug;
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
  return <ProductPage slug={productSlug ?? slug} />;
}
