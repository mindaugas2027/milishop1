import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [
    { title: "Grąžinimo ir pinigų grąžinimo politika — Milishop" },
    { name: "description", content: "Milishop prekių grąžinimo, pinigų grąžinimo ir prekės kokybės trūkumų nagrinėjimo sąlygos." },
  ];
}

export default function ReturnsRoute() {
  return (
    <StoreInfoPage
      title="Grąžinimas ir pinigų grąžinimas"
      intro="Aiškiai apie 14 dienų teisę atsisakyti nuotolinio pirkimo, prekės kokybės trūkumus ir pinigų grąžinimą."
    >
      <section>
        <h2>14 dienų teisė atsisakyti pirkimo</h2>
        <p>Jei pirkote kaip vartotojas, daugumos internetu įsigytų prekių galite atsisakyti per 14 dienų nuo kitos dienos po prekės gavimo. Priežasties nurodyti nereikia.</p>
        <p>Apie sprendimą atsisakyti pirkimo praneškite pardavėjui aiškiu rašytiniu pranešimu per šį terminą. Pranešime nurodykite užsakymo numerį, savo vardą ir pavardę bei grąžinamas prekes. Prekes išsiųskite arba perduokite ne vėliau kaip per 14 dienų nuo pranešimo pateikimo.</p>
        <p>Prekę galite apžiūrėti ir patikrinti tiek, kiek tai būtų galima padaryti fizinėje parduotuvėje. Jei ji buvo naudota daugiau, nei būtina jos savybėms ir veikimui patikrinti, gali būti taikoma įstatyme numatyta atsakomybė už sumažėjusią prekės vertę. Originali pakuotė pageidautina, bet savaime nėra būtina sąlyga pasinaudoti įstatymine teise atsisakyti sutarties.</p>
        <p>Teisė atsisakyti sutarties netaikoma įstatyme numatytoms išimtims, pavyzdžiui, pagal individualų užsakymą pagamintoms prekėms.</p>
      </section>

      <section>
        <h2>Prekės kokybės trūkumai</h2>
        <p>14 dienų yra pirkimo atsisakymo terminas, o ne prekės garantijos laikotarpis. Jei prekė turi trūkumą arba neatitinka aprašymo, susisiekite su pardavėju ir pateikite užsakymo numerį bei trūkumo aprašymą. Jei įmanoma, pridėkite nuotraukas.</p>
        <p>Vartotojas įstatymuose nustatyta tvarka gali reikšti reikalavimus dėl prekės neatitikties, paaiškėjusios per dvejus metus nuo prekės pristatymo. Atsižvelgiant į situaciją ir teisės aktus, gali būti taikomas prekės taisymas ar pakeitimas, kainos sumažinimas arba sutarties nutraukimas ir pinigų grąžinimas. Šios teisės nepriklauso nuo komercinės garantijos ir nėra ribojamos šio puslapio sąlygomis.</p>
      </section>

      <section>
        <h2>Pinigų grąžinimas</h2>
        <p>Atsisakius pirkimo, už prekę ir standartinį pristatymą sumokėtos sumos grąžinamos ne vėliau kaip per 14 dienų nuo pranešimo apie sutarties atsisakymą gavimo. Jei pasirinkote brangesnį pristatymo būdą, papildoma jo kaina negrąžinama.</p>
        <p>Pardavėjas gali sulaikyti pinigų grąžinimą, kol gaus grąžinamą prekę arba įrodymą, kad ją išsiuntėte, atsižvelgiant į tai, kas įvyksta anksčiau. Pinigai grąžinami tuo pačiu mokėjimo būdu, kuriuo atsiskaitėte, nebent aiškiai susitariama kitaip. Banko įskaitymo laikas gali skirtis.</p>
      </section>

      <section>
        <h2>Grąžinimo siuntimo išlaidos</h2>
        <p>Atsisakant kokybiškos prekės pirkimo, tiesiogines grąžinimo išlaidas apmoka pirkėjas, jei prieš pirkimą buvo apie tai informuotas. Jei grąžinama dėl broko, prekės neatitikties ar pardavėjo klaidos, dėl grąžinimo būdo ir išlaidų susisiekite su pardavėju.</p>
        <p>Prieš siųsdami prekę, gaukite iš pardavėjo grąžinimo adresą ir instrukcijas. Siuntoje nurodykite užsakymo numerį ir saugokite išsiuntimo įrodymą.</p>
      </section>

      <section>
        <h2>Kaip pateikti prašymą</h2>
        <p>Rašytiniame pranešime pateikite užsakymo numerį, vardą ir pavardę, grąžinamų prekių pavadinimus ir aiškų prašymą atsisakyti pirkimo arba informaciją apie prekės trūkumą. Pardavėjo kontaktinius duomenis ir grąžinimo adresą rasite pirkimo dokumentuose. Jei jų negavote, prieš siunčiant prekę būtina susisiekti su pardavėju ir gauti grąžinimo instrukcijas.</p>
      </section>
    </StoreInfoPage>
  );
}