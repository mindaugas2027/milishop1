import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [
    { title: "Siuntimo politika — Milishop" },
    { name: "description", content: "Milishop užsakymų apdorojimo, siuntimo ir pristatymo terminai." },
  ];
}

export default function DeliveryRoute() {
  return (
    <StoreInfoPage
      className="store-info-delivery"
      eyebrow=""
      title="Siuntimo politika"
    >
      <section className="delivery-policy-section">
        <h2>1. Pristatymo terminai</h2>
        <p className="delivery-policy-item"><strong>Apdorojimas:</strong><br />Užsakymai paruošiami ir išsiunčiami per 1–2 darbo dienas.</p>
        <p className="delivery-policy-item"><strong>Siuntimo grafikas:</strong><br />Siunčiame tik darbo dienomis (I–V). Savaitgaliais ir švenčių dienomis užsakymai neapdorojami.</p>
        <p className="delivery-policy-item"><strong>Pristatymo trukmė:</strong><br />Įprastai prekės pristatomos per 3–5 darbo dienas nuo išsiuntimo.</p>
        <p className="delivery-policy-item"><strong>Išskirtinės prekės:</strong><br />Tam tikrų prekių pristatymas gali užtrukti 5–10 darbo dienų.</p>
      </section>
      <section className="delivery-policy-section">
        <h2>2. Svarbi informacija</h2>
        <p className="delivery-policy-note">Švenčių ar išpardavimų metu siuntos gali vėluoti dėl kurjerių apkrovos. Jei siunta vėluoja, susisiekite su mumis – padėsime spręsti problemą.</p>
      </section>
    </StoreInfoPage>
  );
}