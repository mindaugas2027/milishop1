import { Link, useLoaderData, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useActionQuery } from "@agent-native/core/client/hooks";
import { IconShoppingCartPlus } from "@tabler/icons-react";

import listProductLandings from "../../actions/list-product-landings.js";
import { APP_TITLE } from "@/lib/app-config";
import { addCartItem, readCart, type CartLine, writeCart, calculateDiscount } from "@/lib/cart";
import { StoreCartDrawer } from "@/components/StoreCartDrawer";
import { StoreFooter, StorePaymentStrip } from "@/components/StorefrontChrome";
import { type StoreCategory, type StoreCategoryRecord } from "@/lib/store-products";

type StorefrontProduct = {
  slug: string;
  category: StoreCategory;
  productBrand: string;
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  tag: string;
  image: string;
};

type ProductLandingPage = Awaited<ReturnType<typeof listProductLandings.run>>;

type HomeLoaderData = {
  category?: string;
  productPage: ProductLandingPage | null;
  loadedAt: number;
};

export async function loader({ request }: { request: Request }): Promise<HomeLoaderData> {
  const category = new URL(request.url).searchParams.get("category") || undefined;
  try {
    const productPage = await listProductLandings.run({ category, limit: 12 });
    return { category, productPage, loadedAt: Date.now() };
  } catch {
    return { category, productPage: null, loadedAt: 0 };
  }
}

export function shouldRevalidate({
  currentUrl,
  nextUrl,
  defaultShouldRevalidate,
}: {
  currentUrl: URL;
  nextUrl: URL;
  defaultShouldRevalidate: boolean;
}) {
  if (currentUrl.pathname === "/" && nextUrl.pathname === "/" && currentUrl.search !== nextUrl.search) {
    return false;
  }
  return defaultShouldRevalidate;
}

function mapStorefrontProducts(items: ProductLandingPage["items"]): StorefrontProduct[] {
  return items.map((landing) => ({
    slug: landing.slug,
    category: landing.category,
    productBrand: landing.productBrand,
    name: landing.name,
    description: landing.description,
    price: landing.price,
    oldPrice: landing.oldPrice,
    tag: calculateDiscount(landing.price, landing.oldPrice)?.percentLabel || "Naujiena",
    image: landing.heroImage,
  }));
}

const heroSlides = [
  {
    src: "https://images.pexels.com/photos/12271949/pexels-photo-12271949.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "OBD2 diagnostikos įrenginys automobilyje",
    label: "Automobiliui · Diagnostika",
    eyebrow: "Automobiliui · OBD2 diagnostika",
    title: "Pažink, ką rodo tavo automobilis.",
    copy: "Greitai patikrink automobilio būklę ir į kelionę leiskis ramiau.",
    cta: "Peržiūrėti OBD2",
    href: "/obd",
  },
  {
    src: "https://images.pexels.com/photos/28536450/pexels-photo-28536450.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Modernūs kasdienybės daiktai namams ir darbui",
    label: "Kasdienybei · Atrinkta",
    eyebrow: "Milishop kasdienybei",
    title: "Mažos detalės. Daugiau patogumo.",
    copy: "Apgalvoti radiniai namams, kelionei ir kasdieniams darbams.",
    cta: "Atrasti produktus",
    href: "#produktai",
  },
  {
    src: "https://images.pexels.com/photos/16017150/pexels-photo-16017150.jpeg?auto=compress&cs=tinysrgb&w=1200",
    alt: "Magnetinis automobilio telefono laikiklis",
    label: "Kelionei · Patogu",
    eyebrow: "Patogiau kiekvienoje kelionėje",
    title: "Telefonas po ranka. Akys kelyje.",
    copy: "Stabilus magnetinis laikiklis navigacijai ir kasdieniams maršrutams.",
    cta: "Peržiūrėti laikiklį",
    href: "/automobilio-laikiklis",
  },
  {
    src: "https://images.pexels.com/photos/15028227/pexels-photo-15028227.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Keraminė namų interjero detalė",
    label: "Namams · Forma",
    eyebrow: "Namams · Forma ir jaukumas",
    title: "Jaukumas slypi detalėse.",
    copy: "Rami keraminė detalė, kuri suteikia erdvei savitą akcentą.",
    cta: "Peržiūrėti namams",
    href: "/namu-akcentas",
  },
];

export function meta() {
  return [
    { title: APP_TITLE },
    {
      name: "description",
      content: "Atrinkti daiktai automobiliui, namams ir kasdienai.",
    },
  ];
}

export default function HomeRoute() {
  const initialPage = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutNotice, setCheckoutNotice] = useState<{ status: "success" | "cancelled"; order?: string } | null>(null);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [pageCursor, setPageCursor] = useState<string>();
  const [storefrontProducts, setStorefrontProducts] = useState<StorefrontProduct[]>(() =>
    initialPage.productPage ? mapStorefrontProducts(initialPage.productPage.items) : [],
  );
  const year = new Date().getFullYear();
  const requestedCategory = searchParams.get("category");
  const activeCategory = requestedCategory || "all";
  const { data: productPage, isPending: isProductsPending, isFetching: isProductsFetching, isError: isProductsError } = useActionQuery("list-product-landings", {
    cursor: pageCursor,
    category: activeCategory === "all" ? undefined : activeCategory,
    limit: 12,
  }, {
    staleTime: 10 * 60_000,
    initialData: pageCursor === undefined && initialPage.category === (activeCategory === "all" ? undefined : activeCategory)
      ? initialPage.productPage ?? undefined
      : undefined,
    initialDataUpdatedAt: initialPage.loadedAt || undefined,
  });
  const currentPageProducts = productPage ? mapStorefrontProducts(productPage.items) : [];
  const visibleProducts = pageCursor || !productPage ? storefrontProducts : currentPageProducts;
  const storefrontCategories = (productPage?.categories ?? []) as StoreCategoryRecord[];
  const visibleHeroSlides = heroSlides;
  const visibleCategories = storefrontCategories.map((category) => ({
    ...category,
    key: category.slug,
    label: category.name,
    href: `/?category=${category.slug}#produktai`,
    image: category.image || currentPageProducts.find((product) => product.category === category.slug)?.image || storefrontProducts.find((product) => product.category === category.slug)?.image || heroSlides[0].src,
  }));
  const nextPageCursor = productPage?.nextCursor ?? null;
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setPageCursor(undefined);
  }, [activeCategory]);

  useEffect(() => {
    if (!productPage) return;
    const pageProducts = mapStorefrontProducts(productPage.items);
    setStorefrontProducts((current) => {
      if (!pageCursor) return pageProducts;
      const merged = new Map(current.map((product) => [product.slug, product]));
      for (const product of pageProducts) merged.set(product.slug, product);
      return [...merged.values()];
    });
  }, [pageCursor, productPage]);

  useEffect(() => {
    setCartItems(readCart());
    const params = new URLSearchParams(window.location.search);
    const checkout = params.get("checkout");
    if (checkout === "success" || checkout === "cancelled") {
      setCheckoutNotice({ status: checkout, order: params.get("order") ?? undefined });
      if (checkout === "success") {
        setCartItems([]);
        writeCart([]);
      } else {
        setCartOpen(true);
      }
      window.history.replaceState({}, "", "/");
    } else if (params.get("cart") === "open") {
      setCartOpen(true);
      window.history.replaceState({}, "", "/");
    }
  }, []);

  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener("milishop-cart:open", openCart);
    return () => window.removeEventListener("milishop-cart:open", openCart);
  }, []);

  const animateProductToCart = (source: HTMLButtonElement, image: string) => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const sourceImage = source.closest(".levitara-product-media")?.querySelector("img");
    const cart = document.querySelector<HTMLButtonElement>(".levitara-cart");
    if (!sourceImage || !cart) return;

    const sourceRect = sourceImage.getBoundingClientRect();
    const cartRect = cart.getBoundingClientRect();
    const size = Math.min(88, sourceRect.width, sourceRect.height);
    const flyer = document.createElement("img");
    flyer.src = sourceImage.currentSrc || image;
    flyer.alt = "";
    flyer.setAttribute("aria-hidden", "true");
    Object.assign(flyer.style, {
      position: "fixed",
      left: `${sourceRect.left + (sourceRect.width - size) / 2}px`,
      top: `${sourceRect.top + (sourceRect.height - size) / 2}px`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: "8px",
      background: "#fff",
      objectFit: "contain",
      pointerEvents: "none",
      transformOrigin: "center",
      willChange: "transform, opacity",
      zIndex: "1000",
    });
    document.body.append(flyer);

    const deltaX = cartRect.left + cartRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
    const deltaY = cartRect.top + cartRect.height / 2 - (sourceRect.top + sourceRect.height / 2);
    const animation = flyer.animate([
      { transform: "translate(0, 0) scale(1)", opacity: 1 },
      { transform: `translate(${deltaX * 0.55}px, ${deltaY * 0.55}px) scale(.72)`, opacity: 0.9, offset: 0.72 },
      { transform: `translate(${deltaX}px, ${deltaY}px) scale(.16)`, opacity: 0.15 },
    ], { duration: prefersReducedMotion ? 380 : 620, easing: "cubic-bezier(.2,.75,.25,1)", fill: "forwards" });

    animation.addEventListener("finish", () => {
      flyer.remove();
      cart.querySelector("strong")?.animate(
        [{ transform: "scale(1)" }, { transform: "scale(1.3)" }, { transform: "scale(1)" }],
        { duration: 300, easing: "ease-out" },
      );
    }, { once: true });
    animation.addEventListener("cancel", () => flyer.remove(), { once: true });
  };

  const addToCart = (product: StorefrontProduct, source: HTMLButtonElement) => {
    setCartItems((current) =>
      addCartItem(current, {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      }),
    );
    animateProductToCart(source, product.image);
  };

  const changeCartQuantity = (slug: string, amount: number) => {
    setCartItems((current) => current.flatMap((item) => {
      if (item.slug !== slug) return [item];
      const quantity = item.quantity + amount;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
  };

  const resetProductPages = () => {
    setPageCursor(undefined);
  };

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveHeroSlide((current) => (current + 1) % visibleHeroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [visibleHeroSlides.length]);

  const changeHeroSlide = (direction: number) => {
    setActiveHeroSlide(
      (current) => (current + direction + visibleHeroSlides.length) % visibleHeroSlides.length,
    );
  };

  const activeSlide = visibleHeroSlides[activeHeroSlide % visibleHeroSlides.length];

  return (
    <div className="levitara-storefront min-h-screen bg-white text-[#121212]">
      <div className="levitara-announcement">
        <span>Nemokamas pristatymas nuo 50 €</span>
        <span aria-hidden="true">•</span>
        <span>Saugus atsiskaitymas</span>
        <span aria-hidden="true">•</span>
        <span>14 dienų grąžinimas</span>
      </div>

      {checkoutNotice && (
        <div role={checkoutNotice.status === "success" ? "status" : "alert"} className="border-b border-[#203b40]/10 bg-[#f5f7f5] px-4 py-3 text-center text-sm text-[#203b40]">
          {checkoutNotice.status === "success"
            ? <>Mokėjimo patvirtinimas apdorojamas. Užsakymas <strong>{checkoutNotice.order}</strong>.</>
            : "Apmokėjimas atšauktas. Prekės liko krepšelyje."}
          <button type="button" className="ml-3 font-semibold underline" onClick={() => setCheckoutNotice(null)}>Uždaryti</button>
        </div>
      )}

      <header className="levitara-header">
        <div className="levitara-header-inner">
          <Link to="/" className="levitara-logo" aria-label="Milishop pradžia">
            <span className="levitara-logo-mark" aria-hidden="true">M</span>
            <span>milishop</span>
          </Link>

          <nav className="levitara-nav" aria-label="Pagrindinė navigacija">
            <a href="#produktai">Produktai</a>
            <a href="#kategorijos">Kategorijos</a>
            <Link to="/apie-mus">Apie mus</Link>
            <a href="#kontaktai">Kontaktai</a>
          </nav>

          <div className="levitara-header-tools">
            <StoreCartDrawer items={cartItems} open={cartOpen} onOpenChange={setCartOpen} onQuantityChange={changeCartQuantity} />
            <Link className="levitara-admin-link" to="/admin">Prisijungti</Link>
            <button
              className="levitara-menu-button"
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "Uždaryti meniu" : "Atidaryti meniu"}
              aria-expanded={menuOpen}
            >
              {menuOpen ? "×" : "☰"}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="levitara-mobile-nav" aria-label="Mobilioji navigacija">
            <a href="#produktai" onClick={() => setMenuOpen(false)}>Produktai</a>
            <a href="#kategorijos" onClick={() => setMenuOpen(false)}>Kategorijos</a>
            <Link to="/apie-mus" onClick={() => setMenuOpen(false)}>Apie mus</Link>
            <a href="#kontaktai" onClick={() => setMenuOpen(false)}>Kontaktai</a>
            <Link to="/admin">Prisijungti</Link>
          </nav>
        )}
      </header>

      <main>
        <section className="levitara-hero" aria-labelledby="hero-title">
          <img
            key={activeSlide.src}
            id="hero-slide"
            className="levitara-hero-image"
            src={activeSlide.src}
            alt={activeSlide.alt}
          />
          <div className="levitara-hero-overlay" />
          <div className="levitara-hero-content">
            <p className="levitara-kicker">{activeSlide.eyebrow}</p>
            <h1 id="hero-title">{activeSlide.title}</h1>
            <p className="levitara-hero-copy">{activeSlide.copy}</p>
            <div className="levitara-hero-actions">
              <Link to={activeSlide.href} className="levitara-light-button">{activeSlide.cta} <span aria-hidden="true">↗</span></Link>
            </div>
          </div>
          <div className="levitara-hero-controls">
            <button type="button" onClick={() => changeHeroSlide(-1)} aria-label="Rodyti ankstesnę nuotrauką">‹</button>
            <button type="button" onClick={() => changeHeroSlide(1)} aria-label="Rodyti kitą nuotrauką">›</button>
          </div>
          <div className="levitara-hero-dots" role="tablist" aria-label="Hero nuotraukos">
            {visibleHeroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                role="tab"
                aria-selected={index === activeHeroSlide}
                aria-label={`Rodyti ${slide.label.toLowerCase()}`}
                className={index === activeHeroSlide ? "is-active" : ""}
                onClick={() => setActiveHeroSlide(index)}
              />
            ))}
          </div>
        </section>

        <div className="levitara-marquee" aria-label="Parduotuvės privalumai">
          <div>APGALVOTI PRODUKTAI <span>✦</span> GREITAS PRISTATYMAS <span>✦</span> PAPRASTAS GRĄŽINIMAS <span>✦</span> ŽMOGIŠKAS DĖMESYS <span>✦</span> APGALVOTI PRODUKTAI</div>
        </div>

        <section id="kategorijos" className="levitara-section levitara-category-section">
          <div className="levitara-section-heading">
            <div>
              <p className="levitara-kicker dark">Milishop kolekcija</p>
              <h2>Rask tai, kas tinka tau.</h2>
            </div>
            <span className="levitara-heading-side">Paprasti sprendimai kasdienai</span>
          </div>
          <div className="levitara-category-grid">
            {visibleCategories.map((category) => (
              <Link
                key={category.key}
                to={category.href}
                onClick={resetProductPages}
                className={`levitara-category-card ${category.label !== "Automobiliui" ? "levitara-category-card-light" : ""}`}
              >
                <img src={category.image} alt={category.label} loading="lazy" />
                <span className="levitara-category-shade" />
                <span className="levitara-category-content">
                  <strong>{category.label}</strong>
                  <small>{category.caption}</small>
                  <span className="levitara-white-button">Peržiūrėti</span>
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section id="produktai" className="levitara-section levitara-products-section">
          <div className="levitara-section-heading">
            <div>
              <p className="levitara-kicker dark">Mūsų pasirinkimas</p>
              <h2>Mūsų produktai</h2>
            </div>
            <span className="levitara-heading-side">{visibleProducts.length.toString().padStart(2, "0")} produktai</span>
          </div>
          <nav className="levitara-category-filters" aria-label="Filtruoti produktus pagal kategoriją">
            <Link to="/#produktai" onClick={resetProductPages} aria-current={activeCategory === "all" ? "page" : undefined}>Visi</Link>
            {storefrontCategories.map((category) => (
              <Link key={category.slug} to={`/?category=${category.slug}#produktai`} onClick={resetProductPages} aria-current={activeCategory === category.slug ? "page" : undefined}>
                {category.name}
              </Link>
            ))}
          </nav>
          <div className="levitara-product-grid" aria-busy={isProductsFetching}>
            {visibleProducts.map((product) => (
              <article key={product.slug} className="levitara-product-card">
                <div className="levitara-product-media">
                  <Link to={product.slug === "obd2" ? "/obd" : `/${product.slug}`} className="levitara-product-image-link" aria-label={`Peržiūrėti: ${product.name}`}>
                    <img
                      className={product.slug === "namu-akcentas" ? "levitara-product-image-home" : ""}
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                    />
                    <span className="levitara-sale-badge">{product.tag}</span>
                    <span className="levitara-quick-add"><span>Peržiūrėti</span><span aria-hidden="true">↗</span></span>
                  </Link>
                  <button className="levitara-add-to-cart" type="button" onClick={(event) => addToCart(product, event.currentTarget)} aria-label={`Įdėti į krepšelį: ${product.name}`} title="Įdėti į krepšelį">
                    <IconShoppingCartPlus size={20} stroke={1.8} aria-hidden="true" />
                  </button>
                </div>
                <Link to={product.slug === "obd2" ? "/obd" : `/${product.slug}`} className="levitara-product-info">
                  {product.productBrand && <p className="mb-1 font-semibold text-[#398b86]">{product.productBrand}</p>}
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="levitara-price-row">
                    <strong>{product.price}</strong>
                    {product.oldPrice && <span>{product.oldPrice}</span>}
                  </div>
                </Link>
              </article>
            ))}
          </div>
          {isProductsPending && visibleProducts.length === 0 && <p role="status" className="levitara-empty-category">Įkeliami produktai…</p>}
          {isProductsError && <p role="alert" className="levitara-empty-category">Produktų nepavyko įkelti. Pabandykite perkrauti puslapį.</p>}
          {visibleProducts.length === 0 && <p className="levitara-empty-category">Šioje kategorijoje produktų nėra.</p>}
          {nextPageCursor && (
            <button type="button" className="levitara-dark-button" onClick={() => setPageCursor(nextPageCursor)} disabled={isProductsFetching}>
              {isProductsFetching ? "Įkeliama…" : "Rodyti daugiau"}
            </button>
          )}
        </section>

        <section className="levitara-section levitara-showcase-section">
          <div className="levitara-section-heading">
            <div>
              <p className="levitara-kicker dark">Milishop pasirinkimas</p>
              <h2>Daiktai kelionėms, namams ir kasdienai</h2>
            </div>
            <span className="levitara-heading-side">Atrask katalogą</span>
          </div>
          <div className="levitara-feature-grid">
            <div className="levitara-feature-card levitara-feature-card-hero">
              <div>
                <span>Milishop katalogas</span>
                <h3>Rask tai, ko reikia</h3>
                <p>Automobilio priedai, namų akcentai ir praktiški radiniai dovanai – vienoje vietoje.</p>
              </div>
            </div>
            <div className="levitara-feature-card">
              <span>01</span>
              <h3>Kelionėms</h3>
              <p>OBD2 diagnostika ir telefono laikikliai patogesnėms kelionėms.</p>
            </div>
            <div className="levitara-feature-card">
              <span>02</span>
              <h3>Namams</h3>
              <p>Keraminiai akcentai ir jaukūs daiktai tavo namų erdvei.</p>
            </div>
            <div className="levitara-feature-card">
              <span>03</span>
              <h3>Dovanoms</h3>
              <p>Žaislai, kvapai ir kiti radiniai įvairioms progoms.</p>
            </div>
          </div>
        </section>

        <section id="apie-mus" className="levitara-trust-strip">
          <div className="levitara-trust-inner">
            <div className="levitara-trust-intro"><strong>Mažiau, bet geriau.</strong><span>Produktai, kuriuos rinktumėmės patys.</span></div>
            <div className="levitara-trust-item"><span>01</span><div><strong>Greitas pristatymas</strong><small>Išsiunčiame per 1–2 d. d.</small></div></div>
            <div className="levitara-trust-item"><span>02</span><div><strong>Saugus atsiskaitymas</strong><small>Patogu ir saugu kiekviename žingsnyje.</small></div></div>
            <div className="levitara-trust-item"><span>03</span><div><strong>14 dienų grąžinimas</strong><small>Norime, kad pirkinys tikrai patiktų.</small></div></div>
          </div>
        </section>
        <StorePaymentStrip />
      </main>

      <StoreFooter year={year} />
    </div>
  );
}
