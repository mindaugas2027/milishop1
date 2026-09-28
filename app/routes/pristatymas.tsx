import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [{ title: "Pristatymas — Milishop" }];
}

export default function DeliveryRoute() {
  return (
    <StoreInfoPage
      title="Pristatymas"
      intro="Nemokamas pristatymas nuo 50 €."
      paragraphs={[
        "Užsakymus paruošiame ir išsiunčiame per 1–2 darbo dienas.",
        "Galutinė pristatymo informacija pateikiama prieš patvirtinant užsakymą.",
      ]}
    />
  );
}