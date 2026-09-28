import { Link } from "react-router";
import { useEffect, useState } from "react";
import { IconMinus, IconPlus, IconShoppingCart, IconShoppingCartPlus, IconX } from "@tabler/icons-react";

import { APP_TITLE } from "@/lib/app-config";
import { addCartItem, readCart, type CartLine, writeCart } from "@/lib/cart";
import { StoreSocialLinks } from "@/components/StoreInfoPage";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const products = [
  {
    slug: "didelis-plepus-zaislas",
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
    name: "Medinis vaikų sūpynės – su virve",
    description: "Namuose laimingas ir aktyvus laikas.",
    price: "€142,00",
    oldPrice: "€162,00",
    tag: "-22%",
    image: "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "garso-modulis",
    name: "Garso elektronikos sistema „Tesla“",
    description: "Garsas, stiprumas ir paprastas dizainas.",
    price: "€68,00",
    oldPrice: "€72,00",
    tag: "-8%",
    image: "https://images.unsplash.com/photo-1518444065439-e933c06ce9a9?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "daugiafunkcinis-kratytuvas",
    name: "VAYOX insect killer – elektrinis",
    description: "Efektyvus apsauga nuo vabzdžių.",
    price: "€84,00",
    oldPrice: "€104,00",
    tag: "-21%",
    image: "https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&w=900&q=80",
  },
  {
    slug: "parfumas",
    name: "Perceive Gift Set – perfumed",
    description: "Gaivus ir subtilus kvapas kasdienai.",
    price: "€80,00",
    oldPrice: "€100,00",
    tag: "-20%",
    image: "https://images.unsplash.com/photo-1528740561666-dc2479d461a6?auto=format&fit=crop&w=900&q=80",
  },
];

const categories = [
  { label: "Automobiliui", caption: "Išmaniau kiekvienai kelionei", image: products[0].image, href: "/obd2" },
  { label: "Kasdienai", caption: "Maži daiktai, didelis patogumas", image: products[1].image, href: "/automobilio-laikiklis" },
  { label: "Namams", caption: "Ramūs akcentai tavo erdvei", image: products[2].image, href: "/namu-akcentas" },
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

function priceValue(price: string) {
  return Number(price.replace(/[^\d,.-]/g, "").replace(",", ".")) || 0;
}

function formatPrice(price: number) {
  return `${price.toFixed(2).replace(".", ",")} €`;
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartLine[]>([]);
  const [paymentMethod, setPaymentMethod] = useState("paysera");
  const year = new Date().getFullYear();
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + priceValue(item.price) * item.quantity, 0);

  useEffect(() => {
    setCartItems(readCart());
  }, []);

  useEffect(() => {
    writeCart(cartItems);
  }, [cartItems]);

  useEffect(() => {
    const openCart = () => setCartOpen(true);
    window.addEventListener("milishop-cart:open", openCart);
    return () => window.removeEventListener("milishop-cart:open", openCart);
  }, []);

  const addToCart = (product: (typeof products)[number]) => {
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
      setActiveHeroSlide((current) => (current + 1) % heroSlides.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, []);

  const changeHeroSlide = (direction: number) => {
    setActiveHeroSlide(
      (current) => (current + direction + heroSlides.length) % heroSlides.length,
    );
  };

  const activeSlide = heroSlides[activeHeroSlide];

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
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <button className="levitara-cart" type="button" aria-label={`Krepšelis, ${cartCount} prekių`}>
                  <span aria-hidden="true"><IconShoppingCart size={18} stroke={1.8} /></span>
                  <span>Krepšelis</span>
                  <strong>{cartCount}</strong>
                </button>
              </SheetTrigger>
              <SheetContent side="right" showClose={false} className="levitara-cart-sheet">
                <SheetHeader className="levitara-cart-sheet-header">
                  <SheetTitle>Krepšelis <span>{cartCount}</span></SheetTitle>
                  <SheetClose asChild>
                    <button type="button" className="levitara-cart-close" aria-label="Uždaryti krepšelį"><IconX size={19} /></button>
                  </SheetClose>
                </SheetHeader>
                {cartItems.length === 0 ? (
                  <div className="levitara-cart-empty">
                    <IconShoppingCart size={32} stroke={1.5} aria-hidden="true" />
                    <p>Krepšelis tuščias</p>
                    <span>Pasirink produktą ir pridėk jį čia.</span>
                  </div>
                ) : (
                  <>
                    <div className="levitara-cart-items">
                      {cartItems.map((item) => (
                        <article className="levitara-cart-item" key={item.slug}>
                          <img src={item.image} alt="" />
                          <div className="levitara-cart-item-info">
                            <h3>{item.name}</h3>
                            <strong>{item.price}</strong>
                            <div className="levitara-cart-quantity">
                              <button type="button" onClick={() => changeCartQuantity(item.slug, -1)} aria-label={`Sumažinti ${item.name} kiekį`}><IconMinus size={14} /></button>
                              <span>{item.quantity}</span>
                              <button type="button" onClick={() => changeCartQuantity(item.slug, 1)} aria-label={`Padidinti ${item.name} kiekį`}><IconPlus size={14} /></button>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                    <div className="rounded-2xl border border-[#203b40]/10 bg-[#f7f8f6] p-4">
                      <p className="text-sm font-semibold text-[#203b40]">Apmokėjimo būdas</p>
                      <div className="mt-3 space-y-2 text-sm text-[#203b40]/70">
                        <label className="flex items-center gap-2">
                          <input type="radio" name="paymentMethod" checked={paymentMethod === "paysera"} onChange={() => setPaymentMethod("paysera")} />
                          Paysera
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="radio" name="paymentMethod" checked={paymentMethod === "bank"} onChange={() => setPaymentMethod("bank")} />
                          Bankinis pavedimas
                        </label>
                      </div>
                      <div className="mt-3 rounded-xl border border-[#203b40]/10 bg-white p-3 text-xs text-[#203b40]/60">
                        {paymentMethod === "paysera" ? "Lietuvos bankai: Swedbank, SEB, Luminor, Revolut, Paysera." : "Gali būti mokama per SEB, Swedbank ar Luminor bankų pavedimu."}
                      </div>
                    </div>
                    <div className="levitara-cart-total"><span>Tarpinė suma</span><strong>{formatPrice(cartTotal)}</strong></div>
                    <button
                      type="button"
                      className="w-full rounded-full bg-[#2f7f7b] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(47,127,123,0.18)] transition hover:bg-[#256d69]"
                      onClick={() => {
                        const methodLabel = paymentMethod === "paysera" ? "Paysera" : "Bankinis pavedimas";
                        window.alert(`Užsakymas paruoštas apmokėjimui per ${methodLabel}. Paysera integracija bus prijungta vėliau, šiuo metu krepšelis veikia vietoje.`);
                      }}
                    >
                      Tęsti prie apmokėjimo
                    </button>
                    <p className="levitara-cart-note">Pristatymo kaina apskaičiuojama prieš užsakymo patvirtinimą. Lietuvos bankai ir Paysera bus rodomi lietuviškai.</p>
                  </>
                )}
              </SheetContent>
            </Sheet>
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
            {heroSlides.map((slide, index) => (
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
            {categories.map((category) => (
              <Link
                key={category.label}
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
            <span className="levitara-heading-side">03 produktai</span>
          </div>
          <div className="levitara-product-grid">
            {products.map((product) => (
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
          <a href="#kategorijos" className="levitara-dark-button">Peržiūrėti visą kolekciją</a>
        </section>

        <section className="levitara-section levitara-showcase-section">
          <div className="levitara-section-heading">
            <div>
              <p className="levitara-kicker dark">Išskirtinis pasirinkimas</p>
              <h2>Premium dalykai, kuriuos norisi nešiotis kasdien</h2>
            </div>
            <span className="levitara-heading-side">Nauja kolekcija</span>
          </div>
          <div className="levitara-feature-grid">
            <div className="levitara-feature-card levitara-feature-card-hero">
              <div>
                <span>Rinkitės protingai</span>
                <h3>Produkto kategorija</h3>
                <p>Minimalūs, funkcionalūs ir gražūs daiktai, kurie vienodai tinka namams, automobiliui ir kasdienai.</p>
              </div>
            </div>
            <div className="levitara-feature-card">
              <span>01</span>
              <h3>Švarus dizainas</h3>
              <p>Minimalūs paviršiai, šviesi paletė ir suformuotas premium look.</p>
            </div>
            <div className="levitara-feature-card">
              <span>02</span>
              <h3>Patogi prekyba</h3>
              <p>Greitas perėjimas į produktą, aiškios kainos, lengvas add-to-cart patyrimas.</p>
            </div>
            <div className="levitara-feature-card">
              <span>03</span>
              <h3>Sklandi kokybė</h3>
              <p>Intuityvūs skyriai, kokybiška prezentacija ir tvarus e-commerce jausmas.</p>
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
        <section className="levitara-payment-strip" aria-label="Bankai ir mokėjimo būdai">
          <div className="levitara-payment-track">
            {[0, 1].map((copy) => (
              <div className="levitara-payment-group" aria-hidden={copy === 1} key={copy}>
                {[
                  ["SEB", "seb"],
                  ["Luminor", "luminor"],
                  ["Citadele", "citadele"],
                  ["VISA", "visa"],
                  ["Revolut", "revolut"],
                  ["Swedbank", "swedbank"],
                ].map(([name, brand]) => (
                  <span className={`levitara-payment-name levitara-payment-${brand}`} key={name}>
                    {brand === "visa" ? <img src="/visa-mark.svg" alt="VISA" /> : name}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer id="kontaktai" className="levitara-footer">
        <div className="levitara-footer-grid">
          <div className="levitara-footer-brand"><Link to="/" className="levitara-logo"><span className="levitara-logo-mark" aria-hidden="true">M</span><span>milishop</span></Link><p>Apgalvoti daiktai automobiliui, namams ir kasdienai.</p></div>
          <div><h3>Kategorijos</h3><a href="#produktai">Automobiliui</a><a href="#produktai">Kasdienai</a><a href="#produktai">Namams</a></div>
          <div><h3>Informacija</h3><Link to="/apie-mus">Apie mus</Link><Link to="/pristatymas">Pristatymas</Link><Link to="/grazinimas">Grąžinimas</Link></div>
          <div><h3>Pagalba</h3><Link to="/admin">Prisijungti</Link><StoreSocialLinks /></div>
        </div>
        <div className="levitara-footer-bottom"><span>© {year} Milishop. Visos teisės saugomos.</span></div>
      </footer>
    </div>
  );
}
