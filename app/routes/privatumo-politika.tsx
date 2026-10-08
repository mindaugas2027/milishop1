import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [
    { title: "Privatumo politika — Milishop" },
    { name: "description", content: "Sužinokite, kokius asmens duomenis Milishop tvarko, kodėl juos renka ir kokias teises turite." },
  ];
}

export default function PrivacyPolicyRoute() {
  return (
    <StoreInfoPage
      className="store-info-privacy"
      eyebrow="Asmens duomenų apsauga"
      eyebrowPlacement="below"
      title="Privatumo politika"
      intro="Ši politika paaiškina, kaip Milishop tvarko asmens duomenis, kai naršote parduotuvėje, pateikiate užsakymą ar kreipiatės į mus."
    >
      <section>
        <h2>1. Duomenų valdytojas ir kontaktai</h2>
        <p>Duomenų valdytojas yra „Milishop“ internetinę parduotuvę valdantis pardavėjas. Dėl su asmens duomenų tvarkymu susijusių klausimų kreipkitės parduotuvėje naudojamu kontaktiniu kanalu.</p>
      </section>

      <section>
        <h2>2. Kokius duomenis tvarkome</h2>
        <ul>
          <li><strong>Užsakymo duomenis:</strong> vardą ir pavardę, el. pašto adresą, telefono numerį, pristatymo adresą, pasirinktas prekes, kiekius, užsakymo sumą ir būseną.</li>
          <li><strong>Susirašinėjimo duomenis:</strong> informaciją, kurią pateikiate kreipdamiesi dėl užsakymo, prekės, grąžinimo ar kito klausimo.</li>
          <li><strong>Slapukų pasirinkimus:</strong> pasirenkamų kategorijų pasirinkimą, politikos versiją ir pasirinkimo laiką, saugomus tik jūsų naršyklėje.</li>
          <li><strong>Techninius duomenis:</strong> informaciją apie apsilankymą ir įrenginį, pavyzdžiui, IP adresą, naršyklės tipą, prisijungimo laiką ir saugumo įvykius, kai ji gaunama veikiant svetainei ar jos infrastruktūrai.</li>
          <li><strong>Krepšelio duomenis:</strong> pasirinktas prekes ir jų kiekius, kurie išsaugomi jūsų naršyklės saugykloje, kad krepšelis išliktų naršant parduotuvėje.</li>
        </ul>
        <p>Užsakymo pateikti neprivalote, tačiau nepateikus užsakymui būtinų kontaktinių ir pristatymo duomenų negalėsime jo priimti ir įvykdyti.</p>
      </section>

      <section>
        <h2>3. Duomenų tvarkymo tikslai ir teisiniai pagrindai</h2>
        <ul>
          <li><strong>Užsakymui priimti, administruoti, pristatyti ir su jumis susisiekti</strong> – tvarkome duomenis, būtinus sutarčiai sudaryti ir vykdyti.</li>
          <li><strong>Apskaitai ir teisinių reikalavimų vykdymui</strong> – tvarkome duomenis, kai to reikalauja teisės aktai.</li>
          <li><strong>Svetainės saugumui užtikrinti, piktnaudžiavimui nustatyti ir galimiems reikalavimams nagrinėti</strong> – tvarkome duomenis siekdami teisėtų interesų, įvertinę jūsų teises ir interesus.</li>
          <li><strong>Į užklausas atsakyti ir aptarnavimui suteikti</strong> – duomenis tvarkome sutarčiai vykdyti arba turėdami teisėtą interesą atsakyti į kreipimąsi.</li>
        </ul>
        <p>Šiuo metu internetinis mokėjimas svetainėje nėra apdorojamas. Jei atsiskaitote bankiniu pavedimu, mokėjimo duomenis tvarko jūsų bankas ir gavėjo bankas pagal jų privatumo pranešimus.</p>
      </section>

      <section>
        <h2>4. Kam galime perduoti duomenis</h2>
        <p>Duomenys perduodami tik tiek, kiek būtina, ir tik tiems gavėjams, kuriems jų reikia:</p>
        <ul>
          <li>svetainės talpinimo, duomenų bazės ir IT priežiūros paslaugų teikėjams;</li>
          <li>kurjeriams ar kitiems pristatymo paslaugų teikėjams, kad užsakymas pasiektų nurodytą adresą;</li>
          <li>apskaitos, teisinių paslaugų teikėjams ir institucijoms, kai to reikalauja teisės aktai arba būtina apginti teisinius reikalavimus.</li>
        </ul>
        <p>Asmens duomenų neparduodame. Jei pasitelkiamas duomenų tvarkytojas, jis duomenis tvarko pagal sutartį ir tik nustatytais tikslais. Jei duomenys būtų perduodami už Europos ekonominės erdvės ribų, taikomos teisės aktuose numatytos apsaugos priemonės.</p>
      </section>

      <section>
        <h2>5. Kiek laiko saugome duomenis</h2>
        <p>Užsakymų ir apskaitos duomenis saugome teisės aktuose nustatytą laikotarpį. Susirašinėjimą saugome tiek, kiek reikia užklausai išnagrinėti ir galimiems reikalavimams apginti. Techninius saugumo duomenis saugome tik tiek, kiek būtina svetainės veikimui ir saugumui užtikrinti.</p>
        <p>Krepšelio informacija saugoma jūsų naršyklėje iki tol, kol ją pašalinate arba išvalote naršyklės saugyklą. Pasibaigus saugojimo tikslui duomenis ištriname arba nuasmeniname, išskyrus atvejus, kai įstatymai įpareigoja juos saugoti ilgiau.</p>
      </section>

      <section>
        <h2>6. Slapukai ir naršyklės saugykla</h2>
        <p>Būtinieji slapukai reikalingi svetainės saugumui, prisijungimo sesijai ir pagrindinėms funkcijoms. Pasirenkami nuostatų, statistikos ir rinkodaros slapukai naudojami tik gavus jūsų sutikimą; juos galite bet kada peržiūrėti arba pakeisti paspaudę „Slapukų nustatymai“ puslapio apačioje. Kol sutikimo nėra, pasirenkamos kategorijos išjungtos.</p>
        <p>Slapukų pasirinkimus, politikos versiją ir pasirinkimo laiką saugome tik jūsų naršyklės vietinėje saugykloje. Šio sutikimo įrašo į serverį nesiunčiame. Automatinį statistinį sekimą įjungiame tik tada, kai galioja jūsų statistikos sutikimas.</p>
        <p>Krepšelio turinys saugomas naršyklės vietinėje saugykloje. Naršyklės nustatymuose galite išvalyti šiuos duomenis; juos išjungus kai kurios funkcijos, pavyzdžiui, krepšelio išsaugojimas, gali neveikti.</p>
      </section>

      <section>
        <h2>7. Jūsų teisės</h2>
        <p>Pagal taikomus duomenų apsaugos teisės aktus turite teisę:</p>
        <ul>
          <li>gauti informaciją apie savo duomenų tvarkymą ir susipažinti su duomenimis;</li>
          <li>reikalauti ištaisyti netikslius ar papildyti neišsamius duomenis;</li>
          <li>prašyti ištrinti duomenis arba apriboti jų tvarkymą, kai tam yra teisinis pagrindas;</li>
          <li>nesutikti su duomenų tvarkymu, grindžiamu teisėtu interesu;</li>
          <li>gauti savo pateiktus duomenis perkeliamu formatu, kai ši teisė taikoma;</li>
          <li>pateikti skundą Valstybinei duomenų apsaugos inspekcijai adresu <a href="https://vdai.lrv.lt/" target="_blank" rel="noreferrer">vdai.lrv.lt</a>.</li>
        </ul>
        <p>Norėdami pasinaudoti šiomis teisėmis, kreipkitės į pardavėją tuo kontaktiniu kanalu, kuriuo bendravote dėl užsakymo. Kai prašymas akivaizdžiai nepagrįstas ar perteklinis, gali būti taikomos teisės aktuose numatytos išimtys.</p>
      </section>

      <section>
        <h2>8. Politikos pakeitimai</h2>
        <p>Politiką atnaujiname pasikeitus duomenų tvarkymui ar teisės aktams. Naujausia versija skelbiama šiame puslapyje; jos įsigaliojimo data: 2026 m. spalio 2 d.</p>
      </section>
    </StoreInfoPage>
  );
}