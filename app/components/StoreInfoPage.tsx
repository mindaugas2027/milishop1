import { useActionQuery } from "@agent-native/core/client/hooks";
import type { ReactNode } from "react";
import { Link } from "react-router";

export function StoreSocialLinks() {
  const { data } = useActionQuery("get-store-social-links", {});
  if (!data?.instagramUrl && !data?.facebookUrl) return null;

  return (
    <span className="store-social-links" aria-label="Milishop socialiniai tinklai">
      {data.instagramUrl && (
        <a href={data.instagramUrl} target="_blank" rel="noreferrer">Instagram</a>
      )}
      {data.facebookUrl && (
        <a href={data.facebookUrl} target="_blank" rel="noreferrer">Facebook</a>
      )}
    </span>
  );
}

export function StoreInfoPage({
  title,
  intro,
  paragraphs,
  children,
  eyebrow = "Milishop",
  className = "",
  eyebrowPlacement = "above",
}: {
  title: string;
  intro?: ReactNode;
  paragraphs?: string[];
  children?: ReactNode;
  eyebrow?: string;
  className?: string;
  eyebrowPlacement?: "above" | "below";
}) {
  return (
    <div className={`store-info-page ${className}`.trim()}>
      <header className="store-info-header">
        <Link to="/" className="levitara-logo" aria-label="Milishop pradžia">
          <span className="levitara-logo-mark" aria-hidden="true">M</span>
          <span>milishop</span>
        </Link>
        <Link to="/" className="store-info-back">Į parduotuvę</Link>
      </header>
      <main className="store-info-content">
        {eyebrow && eyebrowPlacement === "above" && <p className="levitara-kicker dark">{eyebrow}</p>}
        <h1>{title}</h1>
        {eyebrow && eyebrowPlacement === "below" && <p className="levitara-kicker dark">{eyebrow}</p>}
        {intro && <p className="store-info-intro">{intro}</p>}
        <div className="store-info-copy">
          {paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          {children}
        </div>
      </main>
      <footer className="store-info-footer">
        <Link to="/" className="levitara-logo">
          <span className="levitara-logo-mark" aria-hidden="true">M</span>
          <span>milishop</span>
        </Link>
        <StoreSocialLinks />
      </footer>
    </div>
  );
}