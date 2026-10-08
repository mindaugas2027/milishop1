import { Link } from "react-router";
import { CookieSettingsLink } from "@/components/CookieSettingsLink";
import { StoreSocialLinks } from "@/components/StoreInfoPage";

export function StorePaymentStrip() {
  const paymentBrands = [
    ["SEB", "seb"],
    ["Luminor", "luminor"],
    ["Citadele", "citadele"],
    ["VISA", "visa"],
    ["Revolut", "revolut"],
    ["Swedbank", "swedbank"],
  ];

  return (
    <section className="levitara-payment-strip" aria-label="Bankai ir mokėjimo būdai">
      <div className="levitara-payment-track">
        {[0, 1].map((copy) => (
          <div className="levitara-payment-group" aria-hidden={copy === 1} key={copy}>
            {paymentBrands.map(([name, brand]) => (
              <span className={`levitara-payment-name levitara-payment-${brand}`} key={name}>
                {brand === "visa" ? <img src="/visa-mark.svg" alt="VISA" /> : name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

export function StoreFooter({ year = new Date().getFullYear() }: { year?: number }) {
  return (
    <footer id="kontaktai" className="levitara-footer">
      <div className="levitara-footer-grid">
        <div className="levitara-footer-brand">
          <Link to="/" className="levitara-logo"><span className="levitara-logo-mark" aria-hidden="true">M</span><span>milishop</span></Link>
          <p>Apgalvoti daiktai automobiliui, namams ir kasdienai.</p>
        </div>
        <div><h3>Kategorijos</h3><a href="/?category=automobiliui#produktai">Automobiliui</a><a href="/?category=kasdienai#produktai">Kasdienai</a><a href="/?category=namams#produktai">Namams</a></div>
        <div><h3>Informacija</h3><Link to="/apie-mus">Apie mus</Link><Link to="/pristatymas">Pristatymas</Link><Link to="/grazinimas">Grąžinimas</Link><Link to="/privatumo-politika">Privatumo politika</Link></div>
        <div><h3>Pagalba</h3><Link to="/admin">Prisijungti</Link><StoreSocialLinks /></div>
      </div>
      <div className="levitara-footer-bottom">
        <span>© {year} Milishop. Visos teisės saugomos.</span>
        <CookieSettingsLink />
      </div>
    </footer>
  );
}
