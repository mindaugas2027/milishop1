import { StoreInfoPage } from "@/components/StoreInfoPage";
import { IconCash, IconCircleCheck, IconPackageExport, IconShieldCheck } from "@tabler/icons-react";

export function meta() {
  return [
    { title: "Grąžinimas — Milishop" },
    { name: "description", content: "Milishop prekių grąžinimo, pinigų grąžinimo ir prekės kokybės trūkumų nagrinėjimo sąlygos." },
  ];
}

export default function ReturnsRoute() {
  return (
    <StoreInfoPage
      className="store-info-return"
      eyebrow="Garantijos ir grąžinimo politika"
      eyebrowPlacement="below"
      title="Grąžinimas"
      intro={<><IconCircleCheck size={18} aria-hidden="true" />Siekiame, kad kiekvienas pirkinys jus džiugintų.</>}
    >
      <section className="return-policy-guarantee">
        <h2><IconShieldCheck size={18} aria-hidden="true" />Garantija ir prekės kokybė</h2>
        <p>14 dienų yra nuotolinio pirkimo atsisakymo terminas, o ne garantijos laikotarpis. Dėl prekės neatitikties įstatymines teises vartotojas paprastai gali įgyvendinti per dvejus metus nuo prekės pristatymo.</p>
        <p>Atsižvelgiant į situaciją, gali būti taikomas taisymas, pakeitimas, kainos sumažinimas arba pinigų grąžinimas. Šios teisės nėra ribojamos komercinės garantijos sąlygomis.</p>
        <aside className="return-policy-notice">
          <strong>Svarbu</strong>
          <p>Prekę galite apžiūrėti tiek, kiek būtina jos savybėms patikrinti. Jei ji naudota daugiau, gali tekti atlyginti sumažėjusią vertę. Originali pakuotė pageidautina, bet nėra būtina sąlyga pasinaudoti įstatymine teise atsisakyti pirkimo.</p>
        </aside>
      </section>

      <section>
        <h2><IconPackageExport size={18} aria-hidden="true" />Prekių grąžinimas ir keitimas</h2>
        <p className="return-policy-line"><strong>Kokybiška prekė.</strong> Daugumos internetu įsigytų prekių pirkimo galite atsisakyti per 14 dienų nuo kitos dienos po gavimo. Priežasties nurodyti nereikia. Apie sprendimą praneškite pardavėjui raštu.</p>
        <p className="return-policy-line"><strong>Brokuota arba ne ta prekė.</strong> Nurodykite užsakymo numerį, aprašykite problemą ir, jei galite, pridėkite nuotraukų. Dėl prekės trūkumų taikomos įstatyminės teisės į taisymą, pakeitimą, kainos sumažinimą arba pinigų grąžinimą.</p>
        <p className="return-policy-shipping">Grąžinimo siuntimo išlaidas už kokybišką prekę apmoka pirkėjas, jei apie tai buvo informuotas prieš pirkimą. Broko ar pardavėjo klaidos atveju susisiekite prieš siųsdami prekę.</p>
      </section>

      <section>
        <h2><IconCash size={18} aria-hidden="true" />Pinigų grąžinimo politika</h2>
        <ul className="return-policy-refunds">
          <li>Pinigus siekiame grąžinti per 1–3 darbo dienas nuo prekės gavimo ir patikrinimo. Įstatyminis terminas – ne vėliau kaip 14 dienų nuo pranešimo apie pirkimo atsisakymą, tačiau grąžinimą galima sulaikyti, kol gaunama prekė arba jos išsiuntimo įrodymas.</li>
          <li>Grąžinama tuo pačiu mokėjimo būdu, kuriuo atliktas pirkimas, nebent susitariama kitaip.</li>
          <li>Grąžinama prekės ir standartinio pristatymo suma. Brangesnio pristatymo pasirinkimo papildoma kaina negrąžinama.</li>
          <li>Galutinis pinigų įskaitymo laikas gali priklausyti nuo banko ar mokėjimo paslaugos teikėjo.</li>
        </ul>
      </section>

      <section>
        <h2>Turite klausimų dėl grąžinimo?</h2>
        <p>Pranešime nurodykite užsakymo numerį, savo vardą, grąžinamą prekę ir aiškų prašymą. Pardavėjo kontaktus bei grąžinimo adresą rasite pirkimo dokumentuose. Prieš siųsdami prekę gaukite grąžinimo instrukcijas ir išsaugokite siuntimo įrodymą.</p>
      </section>
    </StoreInfoPage>
  );
}