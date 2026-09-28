import { StoreInfoPage } from "@/components/StoreInfoPage";

export function meta() {
  return [{ title: "Apie mus — Milishop" }];
}

export default function AboutRoute() {
  return (
    <StoreInfoPage
      title="Apie Milishop"
      intro="Praktiški daiktai automobiliui, namams ir kasdienai."
      paragraphs={[
        "Milishop kuriame žmonėms, kurie vertina paprastus, naudingus ir gerai apgalvotus pasirinkimus.",
        "Atrenkame produktus, kurių paskirtis aiški ir kuriuos lengva įtraukti į kasdienį gyvenimą.",
      ]}
    />
  );
}