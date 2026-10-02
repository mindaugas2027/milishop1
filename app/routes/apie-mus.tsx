import { StoreInfoPage } from "@/components/StoreInfoPage";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Apie mus — Milishop" },
    { name: "description", content: "Susipažinkite su Milishop: apgalvoti radiniai kelionėms, namams, kasdienai ir dovanoms." },
  ];
}

export default function AboutRoute() {
  return (
    <StoreInfoPage
      eyebrow="Kas mes esame"
      title="Apie Milishop"
      intro="Apgalvoti radiniai kelionėms, namams ir kasdienai – vienoje vietoje."
    >
      <section>
        <h2>Mažos detalės. Daugiau patogumo.</h2>
        <p>Milishop – internetinė parduotuvė tiems, kurie mėgsta praktiškus daiktus ir jaukius atradimus. Norime, kad ieškant reikalingo daikto nereikėtų klaidžioti po daugybę skirtingų vietų.</p>
        <p>Mūsų kataloge susitinka naudingos smulkmenos kasdienai, patogesnės kelionės ir akcentai namų erdvei. O kai ieškai dovanos, čia gali rasti ir žaislų, kvapų bei kitų jaukių idėjų įvairioms progoms.</p>
      </section>

      <section>
        <h2>Ką rasi Milishop?</h2>
        <p><strong>Kelionėms:</strong> OBD2 diagnostikos įrenginius ir telefono laikiklius, kurie padeda kasdieniuose maršrutuose.</p>
        <p><strong>Namams:</strong> keramikos akcentus ir jaukius daiktus, suteikiančius erdvei savitumo.</p>
        <p><strong>Kasdienai ir dovanoms:</strong> praktiškus radinius, žaislus, kvapus ir mažas staigmenas įvairioms progoms.</p>
      </section>

      <section>
        <h2>Paprasta išsirinkti</h2>
        <p>Stengiamės aiškiai pateikti informaciją apie prekes, jų kainą ir užsakymo sąlygas, kad galėtum ramiai įvertinti, kas tinka tau. Jei prieš pirkdamas turi klausimų, peržiūrėk informaciją apie <Link to="/pristatymas">pristatymą</Link> ir <Link to="/grazinimas">prekių grąžinimą</Link>.</p>
        <p>Ačiū, kad užsukai į Milishop. Tikimės, kad čia rasi daiktą, kuris pravers tau arba taps miela dovana kitam.</p>
      </section>
    </StoreInfoPage>
  );
}