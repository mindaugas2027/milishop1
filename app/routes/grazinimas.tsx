import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [
    { title: "Grąžinimas — Milishop" },
    { name: "description", content: "Milishop prekių grąžinimo, pinigų grąžinimo ir prekės kokybės trūkumų nagrinėjimo sąlygos." },
  ];
}

export default function ReturnsRoute() {
  return (
    <StoreInfoPage
      title="Grąžinimas"
      intro="Siekiame, kad kiekvienas pirkinys jus džiugintų. Jei prekė netiko arba turi trūkumų, žemiau rasite grąžinimo tvarką."
    >
      <section>
        <h2>Garantija</h2>
        <p>14 dienų yra teisės atsisakyti nuotolinio pirkimo terminas, o ne garantijos laikotarpis. Jei prekė turi trūkumų arba neatitinka aprašymo, vartotojas dėl jos kokybės gali kreiptis per įstatymuose nustatytą terminą, kuris paprastai yra dveji metai nuo prekės pristatymo.</p>
        <p>Atsižvelgiant į situaciją ir teisės aktus, gali būti taikomas prekės taisymas ar pakeitimas, kainos sumažinimas arba sutarties nutraukimas ir pinigų grąžinimas. Šios įstatyminės teisės nėra ribojamos komercinės garantijos sąlygomis.</p>
      </section>

      <section>
        <h2>Prekių grąžinimas ir keitimas</h2>
        <p><strong>Kokybiška prekė.</strong> Daugumos internetu įsigytų prekių pirkimo galite atsisakyti per 14 dienų nuo kitos dienos po prekės gavimo. Priežasties nurodyti nereikia. Apie sprendimą praneškite pardavėjui raštu ir prekę išsiųskite arba perduokite per 14 dienų nuo pranešimo.</p>
        <p>Prekę galite apžiūrėti tiek, kiek tai būtų galima padaryti fizinėje parduotuvėje. Jei ją naudojote daugiau, nei būtina savybėms ir veikimui patikrinti, gali tekti atlyginti sumažėjusią prekės vertę. Originali pakuotė pageidautina, tačiau nėra savaiminė įstatyminės grąžinimo teisės sąlyga.</p>
        <p><strong>Brokuota arba ne ta prekė.</strong> Parašykite pardavėjui, nurodykite užsakymo numerį ir aprašykite problemą. Pridėkite nuotraukų, jei jų turite. Prekės trūkumo atveju taikomos įstatyminės teisės dėl taisymo, pakeitimo, kainos sumažinimo arba pinigų grąžinimo.</p>
        <p><strong>Grąžinimo siuntimas.</strong> Kokybiškos prekės grąžinimo tiesiogines išlaidas apmoka pirkėjas, jei prieš pirkimą apie tai buvo informuotas. Broko, neatitikties ar pardavėjo klaidos atveju dėl siuntimo susisiekite su pardavėju.</p>
      </section>

      <section>
        <h2>Pinigų grąžinimo politika</h2>
        <p>Atsisakius pirkimo, už prekę ir standartinį pristatymą sumokėtos sumos grąžinamos ne vėliau kaip per 14 dienų nuo pranešimo gavimo. Jei pasirinkote brangesnį pristatymo būdą, papildoma jo kaina negrąžinama.</p>
        <p>Pardavėjas gali sulaikyti pinigų grąžinimą, kol gaus prekę arba jos išsiuntimo įrodymą, atsižvelgiant į tai, kas įvyksta anksčiau. Pinigai grąžinami tuo pačiu mokėjimo būdu, nebent susitariama kitaip. Banko įskaitymo terminas gali skirtis.</p>
      </section>

      <section>
        <h2>Turite klausimų dėl grąžinimo?</h2>
        <p>Rašytiniame pranešime nurodykite užsakymo numerį, savo vardą ir pavardę, grąžinamas prekes bei aiškų prašymą. Pardavėjo kontaktus ir grąžinimo adresą rasite pirkimo dokumentuose. Prieš siųsdami prekę gaukite grąžinimo instrukcijas ir išsaugokite siuntimo įrodymą.</p>
      </section>
    </StoreInfoPage>
  );
}