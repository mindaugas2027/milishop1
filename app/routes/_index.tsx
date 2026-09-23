import { Link } from "react-router";
import { useEffect, useState } from "react";

import { APP_TITLE } from "@/lib/app-config";

const products = [
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
];

const categories = [
  { label: "Automobiliui", caption: "Išmaniau kiekvienai kelionei", image: products[0].image, href: "/obd2" },
  { label: "Kasdienai", caption: "Maži daiktai, didelis patogumas", image: products[1].image, href: "/automobilio-laikiklis" },
  { label: "Namams", caption: "Ramūs akcentai tavo erdvei", image: products[2].image, href: "/namu-akcentas" },
];

const heroSlides = [
  {
    src: "https://images.pexels.com/photos/12271949/pexels-photo-12271949.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "OBD2 diagnostikos įrenginys automobilyje",
    label: "Automobiliui · Diagnostika",
  },
  {
    src: "https://images.pexels.com/photos/28536450/pexels-photo-28536450.jpeg?auto=compress&cs=tinysrgb&w=1600",
    alt: "Modernūs kasdienybės daiktai namams ir darbui",
    label: "Kasdienybei · Atrinkta",
  },
  {
    src: products[1].image,
    alt: "Magnetinis automobilio telefono laikiklis",
    label: "Kelionei · Patogu",
  },
  {
    src: products[2].image,
    alt: "Keraminė namų interjero detalė",
    label: "Namams · Forma",
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const year = new Date().getFullYear();

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
          <Link to="/" className="levitara-logo" aria-label="Atrinkta pradžia">
            <span className="levitara-logo-mark" aria-hidden="true">a.</span>
            <span>atrinkta.</span>
          </Link>

          <nav className="levitara-nav" aria-label="Pagrindinė navigacija">
            <a href="#produktai">Produktai</a>
            <a href="#kategorijos">Kategorijos</a>
            <a href="#apie-mus">Apie mus</a>
            <a href="#kontaktai">Kontaktai</a>
          </nav>

          <div className="levitara-header-tools">
            <a className="levitara-contact-link" href="mailto:labas@atrinkta.lt">labas@atrinkta.lt</a>
            <Link className="levitara-admin-link" to="/admin">Prisijungti</Link>
            <button className="levitara-cart" type="button" aria-label="Krepšelis, 0 prekių">
              <span aria-hidden="true">◌</span>
              <span>Krepšelis</span>
              <strong>0</strong>
            </button>
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
            <a href="#apie-mus" onClick={() => setMenuOpen(false)}>Apie mus</a>
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
            <p className="levitara-kicker">Atrinkta kasdienybei</p>
            <h1 id="hero-title">Daiktai, kurie palengvina kasdienybę.</h1>
            <p className="levitara-hero-copy">Praktiški, gražūs ir apgalvoti produktai automobiliui, namams bei gyvenimui</p>
            <div className="levitara-hero-actions">
              <a href="#produktai" className="levitara-light-button">Atrasti kolekciją <span aria-hidden="true">↗</span></a>
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
              <p className="levitara-kicker dark">Atrinkta kolekcija</p>
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
              <Link key={product.slug} to={`/${product.slug}`} className="levitara-product-card">
                <div className="levitara-product-media">
                  <img
                    className={product.slug === "namu-akcentas" ? "levitara-product-image-home" : ""}
                    src={product.image}
                    alt={product.name}
                    loading="lazy"
                  />
                  <span className="levitara-sale-badge">{product.tag}</span>
                  <span className="levitara-quick-add">Peržiūrėti produktą <span aria-hidden="true">↗</span></span>
                </div>
                <div className="levitara-product-info">
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="levitara-price-row">
                    <strong>{product.price}</strong>
                    {product.oldPrice && <span>{product.oldPrice}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <a href="#kategorijos" className="levitara-dark-button">Peržiūrėti visą kolekciją</a>
        </section>

        <section id="apie-mus" className="levitara-trust-strip">
          <div className="levitara-trust-inner">
            <div className="levitara-trust-intro"><strong>Mažiau, bet geriau.</strong><span>Produktai, kuriuos rinktumėmės patys.</span></div>
            <div className="levitara-trust-item"><span>01</span><div><strong>Greitas pristatymas</strong><small>Išsiunčiame per 1–2 d. d.</small></div></div>
            <div className="levitara-trust-item"><span>02</span><div><strong>Saugus atsiskaitymas</strong><small>Patogu ir saugu kiekviename žingsnyje.</small></div></div>
            <div className="levitara-trust-item"><span>03</span><div><strong>14 dienų grąžinimas</strong><small>Norime, kad pirkinys tikrai patiktų.</small></div></div>
          </div>
        </section>
      </main>

      <footer id="kontaktai" className="levitara-footer">
        <div className="levitara-footer-grid">
          <div className="levitara-footer-brand"><Link to="/" className="levitara-logo"><span className="levitara-logo-mark" aria-hidden="true">a.</span><span>atrinkta.</span></Link><p>Apgalvoti daiktai automobiliui, namams ir kasdienai.</p><a href="mailto:labas@atrinkta.lt">labas@atrinkta.lt</a></div>
          <div><h3>Kategorijos</h3><a href="#produktai">Automobiliui</a><a href="#produktai">Kasdienai</a><a href="#produktai">Namams</a></div>
          <div><h3>Informacija</h3><a href="#apie-mus">Apie mus</a><a href="#kontaktai">Pristatymas</a><a href="#kontaktai">Grąžinimas</a></div>
          <div><h3>Pagalba</h3><a href="mailto:labas@atrinkta.lt">Susisiekite su mumis</a><Link to="/admin">Prisijungti</Link><span className="levitara-footer-social">Instagram · Facebook</span></div>
        </div>
        <div className="levitara-footer-bottom"><span>© {year} Atrinkta. Visos teisės saugomos.</span></div>
      </footer>
    </div>
  );
}
