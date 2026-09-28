import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [{ title: "Grąžinimas — Milishop" }];
}

export default function ReturnsRoute() {
  return (
    <StoreInfoPage
      title="Grąžinimas"
      intro="Prekę galima grąžinti per 14 dienų nuo jos gavimo."
      paragraphs={[
        "Prieš grąžindami įsitikinkite, kad prekė nenaudota ir išsaugotos jos komplektacijos dalys.",
        "Grąžinimo sąlygas ir veiksmus suderinkite per Milishop pateiktą užsakymo kontaktinę informaciją.",
      ]}
    />
  );
}