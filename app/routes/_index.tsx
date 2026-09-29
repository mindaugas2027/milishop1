import { Link, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { useActionQuery } from "@agent-native/core/client/hooks";
import { IconShoppingCartPlus } from "@tabler/icons-react";

import { APP_TITLE } from "@/lib/app-config";
import { addCartItem, readCart, type CartLine, writeCart, calculateDiscount } from "@/lib/cart";
import { StoreCartDrawer } from "@/components/StoreCartDrawer";
import { StoreFooter, StorePaymentStrip } from "@/components/StorefrontChrome";
import { isStoreCategory, storeCategories, type StoreCategory } from "@/lib/store-products";

type StorefrontProduct = {
  slug: string;
  category: StoreCategory;
  name: string;
  description: string;
  price: string;
  oldPrice: string;
  tag: string;
  image: string;
};

const products: StorefrontProduct[] = [
  {
    slug: "didelis-plepus-zaislas",
    category: "namams",
    name: "Didelis pūkus žaislas 180 cm – baltas",
    description: "Minkštas ir jaukus žaislas namams.",
    price: "131,82 €",
    oldPrice: "€131,82",
    tag: "-5%",
    image:
      "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "obd2",
    category: "automobiliui",
    name: "OBD2 automobilio diagnostikos įrenginys",
    description: "Greitai suprask, ką sako tavo automobilis.",
    price: "39,90 €",
    oldPrice: "49,90 €",
    tag: "-20%",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F1cf73157227448c7a9abcdea548b4cb3?format=webp&width=800&height=1200",
  },
  {
    slug: "automobilio-laikiklis",
    category: "automobiliui",
    name: "Magnetinis automobilio telefono laikiklis",
    description: "Stabilus laikiklis kiekvienai kelionei.",
    price: "24,90 €",
    oldPrice: "29,90 €",
    tag: "-17%",
    image:
      "https://images.pexels.com/photos/16017150/pexels-photo-16017150.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    slug: "namu-akcentas",
    category: "namams",
    name: "Keraminė stalo detalė „Forma“",
    description: "Mažas akcentas jaukesniems namams.",
    price: "32,00 €",
    oldPrice: "",
    tag: "Naujiena",
    image:
      "https://cdn.builder.io/api/v1/image/assets%2Fd04450a0da6f48df807f14687fdbf7fe%2F003c69477ff24c93a0de402ab9247d9f?format=webp&width=800&height=1200",
  },
  {
    slug: "medinis-svyravimas",
    category: "namams",
    name: "Medinis vaikų sūpynės – su virve",
    description: "Namuose laimingas ir aktyvus laikas.",
    price: "€142,00",
    oldPrice: "€162,00",
    tag: "-22%",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "garso-modulis",
    category: "kasdienai",
    name: "Garso elektronikos sistema „Tesla“",
    description: "Garsas, stiprumas ir paprastas dizainas.",
    price: "€68,00",
    oldPrice: "€72,00",
    tag: "-8%",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "daugiafunkcinis-kratytuvas",
    category: "kasdienai",
    name: "VAYOX insect killer – elektrinis",
    description: "Efektyvus apsauga nuo vabzdžių.",
    price: "€84,00",
    oldPrice: "€104,00",
    tag: "-21%",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "parfumas",
    category: "kasdienai",
    name: "Perceive Gift Set – perfumed",
    description: "Gaivus ir subtilus kvapas kasdienai.",
    price: "€80,00",
    oldPrice: "€100,00",
    tag: "-20%",
    image: "https://images.unsplash.com/photo-1528740561666-dc2479d461a6?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  { key: "automobiliui", label: "Automobiliui", caption: "Išmaniau kiekvienai kelionei", image: products[1].image, href: "/?category=automobiliui#produktai" },
  { key: "kasdienai", label: "Kasdienai", caption: "Maži daiktai, didelis patogumas", image: products[5].image, href: "/?category=kasdienai#produktai" },
  { key: "namams", label: "Namams", caption: "Ramūs akcentai tavo erdvei", image: products[0].image, href: "/?category=namams#produktai" },
];

const getProductImage = (slug: string) =>
  products.find((product) => product.slug === slug)?.image ?? "";

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
    src: getProductImage("automobilio-laikiklis"),
    alt: "Magnetinis automobilio telefono laikiklis",
    label: "Kelionei · Patogu",
    eyebrow: "Patogiau kiekvienoje kelionėje",
    title: "Telefonas po ranka. Akys kelyje.",
    copy: "Stabilus magnetinis laikiklis navigacijai ir kasdieniams maršrutams.",
    cta: "Peržiūrėti laikiklį",
    href: "/automobilio-laikiklis",
  },
  {
    src: getProductImage("namu-akcentas"),
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
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const { data: savedProductLandings = [] } = useActionQuery("list-product-landings", {});
  const builtInSlugs = new Set(products.map((product) => product.slug));
  const savedProducts = new Map(savedProductLandings.map((landing) => [landing.slug, landing]));
  const hiddenSlugs = new Set(savedProductLandings.filter((landing) => landing.status === "hidden").map((landing) => landing.slug));
  const storefrontProducts: StorefrontProduct[] = [
    ...products.filter((product) => !hiddenSlugs.has(product.slug)).map((product) => {
      const landing = savedProducts.get(product.slug);
      return landing
        ? {
            ...product,
            name: landing.name || product.name,
            category: isStoreCategory(landing.category) ? landing.category : product.category,
            description: landing.description || product.description,
            price: landing.price || product.price,
            oldPrice: landing.oldPrice,
            tag: calculateDiscount(landing.price || product.price, landing.oldPrice)?.percentLabel || product.tag,
            image: landing.heroImage || product.image,
          }
        : product;
    }),
    ...savedProductLandings
      .filter((landing) => landing.status !== "hidden" && !builtInSlugs.has(landing.slug))
      .map((landing) => ({
        slug: landing.slug,
        category: isStoreCategory(landing.category) ? landing.category : "kasdienai",
        name: landing.name,
        description: landing.description,
        price: landing.price,
        oldPrice: landing.oldPrice,
        tag: calculateDiscount(landing.price, landing.oldPrice)?.percentLabel || "Naujiena",
        image: landing.heroImage,
      })),
  ];
  const year = new Date().getFullYear();
  const visibleHeroSlides = heroSlides.filter((slide) => {
    const slug = slide.href === "/obd" ? "obd2" : slide.href.startsWith("/") ? slide.href.slice(1) : "";
    return !slug || !hiddenSlugs.has(slug);
  });
  const activeCategory = storeCategories.find(({ value }) => value === searchParams.get("category"))?.value ?? "all";
  const visibleProducts = activeCategory === "all"
    ? storefrontProducts
    : storefrontProducts.filter((product) => product.category === activeCategory);
  const visibleCategories = categories.filter((category) => storefrontProducts.some((product) => product.category === category.key));
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    setCartItems(readCart());
    if (new URLSearchParams(window.location.search).get("cart") === "open") {
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

  const addToCart = (product: StorefrontProduct) => {
    setCartItems((current) =>
      addCartItem(current, {
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
      }),
    );
    setCartOpen(true);
  };

  const changeCartQuantity = (slug: string, amount: number) => {
    setCartItems((current) => current.flatMap((item) => {
      if (item.slug !== slug) return [item];
      const quantity = item.quantity + amount;
      return quantity > 0 ? [{ ...item, quantity }] : [];
    }));
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
            <Link to="/#produktai" aria-current={activeCategory === "all" ? "page" : undefined}>Visi</Link>
            {storeCategories.map((category) => (
              <Link key={category.value} to={`/?category=${category.value}#produktai`} aria-current={activeCategory === category.value ? "page" : undefined}>
                {category.label}
              </Link>
            ))}
          </nav>
          <div className="levitara-product-grid">
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
                  <button className="levitara-add-to-cart" type="button" onClick={() => addToCart(product)} aria-label={`Įdėti į krepšelį: ${product.name}`} title="Įdėti į krepšelį">
                    <IconShoppingCartPlus size={20} stroke={1.8} aria-hidden="true" />
                  </button>
                </div>
                <Link to={product.slug === "obd2" ? "/obd" : `/${product.slug}`} className="levitara-product-info">
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
          {visibleProducts.length === 0 && <p className="levitara-empty-category">Šioje kategorijoje produktų nėra.</p>}
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
