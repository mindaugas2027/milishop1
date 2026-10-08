import { configureTracking, setTrackingContentCaptureEnabled } from "@agent-native/core/client/analytics";
import { useEffect, useState } from "react";

import { APP_NAME } from "@/lib/app-config";

const consentStorageKey = "milishop-cookie-consent";
const policyVersion = "2026-10";

type CookieChoices = {
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
};

type SavedConsent = CookieChoices & {
  necessary: true;
  policyVersion: string;
  consentedAt: string;
};

const defaultChoices: CookieChoices = {
  preferences: false,
  statistics: false,
  marketing: false,
};

function choicesFromConsent(consent: SavedConsent | null): CookieChoices {
  return consent
    ? { preferences: consent.preferences, statistics: consent.statistics, marketing: consent.marketing }
    : defaultChoices;
}

function parseSavedConsent(value: string | null): SavedConsent | null {
  if (!value) return null;
  try {
    const parsed = JSON.parse(value) as Partial<SavedConsent>;
    if (
      parsed.necessary !== true ||
      typeof parsed.preferences !== "boolean" ||
      typeof parsed.statistics !== "boolean" ||
      typeof parsed.marketing !== "boolean" ||
      typeof parsed.policyVersion !== "string" ||
      typeof parsed.consentedAt !== "string"
    ) return null;
    return parsed as SavedConsent;
  } catch {
    return null;
  }
}

function enableStatisticsTracking() {
  configureTracking({
    getDefaultProps: (_name, properties) => ({ ...properties, app: APP_NAME }),
  });
}

export function CookieConsentManager() {
  const [consent, setConsent] = useState<SavedConsent | null>(null);
  const [choices, setChoices] = useState(defaultChoices);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [loadFailed, setLoadFailed] = useState(false);

  useEffect(() => {
    try {
      const saved = parseSavedConsent(window.localStorage.getItem(consentStorageKey));
      setConsent(saved);
      setChoices(choicesFromConsent(saved));
      if (saved?.statistics && saved.policyVersion === policyVersion) enableStatisticsTracking();
    } catch {
      setLoadFailed(true);
    }
    setHasLoaded(true);
  }, []);

  useEffect(() => {
    const openSettings = () => {
      setChoices(choicesFromConsent(consent));
      setSettingsOpen(true);
    };
    window.addEventListener("milishop-cookies:settings", openSettings);
    return () => window.removeEventListener("milishop-cookies:settings", openSettings);
  }, [consent]);

  const save = (nextChoices: CookieChoices) => {
    const hadStatisticsConsent = consent?.statistics === true;
    const saved: SavedConsent = {
      necessary: true,
      ...nextChoices,
      policyVersion,
      consentedAt: new Date().toISOString(),
    };
    try {
      window.localStorage.setItem(consentStorageKey, JSON.stringify(saved));
    } catch {
      setLoadFailed(true);
      return;
    }
    if (saved.statistics) {
      enableStatisticsTracking();
    } else if (hadStatisticsConsent) {
      setTrackingContentCaptureEnabled(false);
      window.location.reload();
      return;
    }
    setConsent(saved);
    setChoices(choicesFromConsent(saved));
    setSettingsOpen(false);
    setLoadFailed(false);
  };

  const needsConsent = !consent || consent.policyVersion !== policyVersion;
  if (!hasLoaded || (!needsConsent && !settingsOpen)) return null;

  const acceptAll = () => save({ preferences: true, statistics: true, marketing: true });
  const rejectOptional = () => save(defaultChoices);

  return (
    <>
      {settingsOpen ? (
        <div className="cookie-consent-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSettingsOpen(false); }}>
          <section className="cookie-consent-dialog" role="dialog" aria-modal="true" aria-labelledby="cookie-settings-title">
            <div className="cookie-consent-dialog-heading">
              <div>
                <p className="cookie-consent-kicker">Milishop privatumas</p>
                <h2 id="cookie-settings-title">Slapukų nustatymai</h2>
              </div>
              <button type="button" className="cookie-consent-close" onClick={() => setSettingsOpen(false)} aria-label="Uždaryti slapukų nustatymus">×</button>
            </div>
            <p className="cookie-consent-description">Pasirinkite, kokias pasirenkamų slapukų kategorijas leidžiate. Savo pasirinkimą galėsite pakeisti bet kada per nuorodą puslapio apačioje.</p>
            <div className="cookie-consent-categories">
              <div className="cookie-consent-category">
                <div><strong>Būtinieji</strong><p>Reikalingi svetainės saugumui, prisijungimui ir pagrindinėms funkcijoms.</p></div>
                <span className="cookie-consent-always">Visada aktyvūs</span>
              </div>
              <label className="cookie-consent-category">
                <span><strong>Nuostatos</strong><span>Įsimena jūsų pasirinkimus ir svetainės nustatymus.</span></span>
                <input type="checkbox" checked={choices.preferences} onChange={(event) => setChoices({ ...choices, preferences: event.target.checked })} />
              </label>
              <label className="cookie-consent-category">
                <span><strong>Statistika</strong><span>Padeda suprasti, kaip naudojamasi svetaine.</span></span>
                <input type="checkbox" checked={choices.statistics} onChange={(event) => setChoices({ ...choices, statistics: event.target.checked })} />
              </label>
              <label className="cookie-consent-category">
                <span><strong>Rinkodara</strong><span>Naudojama rinkodaros turiniui ir kampanijoms.</span></span>
                <input type="checkbox" checked={choices.marketing} onChange={(event) => setChoices({ ...choices, marketing: event.target.checked })} />
              </label>
            </div>
            {loadFailed && <p className="cookie-consent-error" role="status">Naršyklės saugykla neprieinama. Įsitikinkite, kad ji įjungta, ir bandykite dar kartą.</p>}
            <div className="cookie-consent-dialog-actions">
              <button type="button" className="cookie-consent-button cookie-consent-button-secondary" onClick={rejectOptional}>Atmesti pasirenkamus</button>
              <button type="button" className="cookie-consent-button cookie-consent-button-primary" onClick={() => save(choices)}>Išsaugoti pasirinkimą</button>
              <button type="button" className="cookie-consent-button cookie-consent-button-text" onClick={acceptAll}>Priimti visus</button>
            </div>
          </section>
        </div>
      ) : (
        <section className="cookie-consent-banner" aria-labelledby="cookie-consent-title" aria-describedby="cookie-consent-copy">
          <div className="cookie-consent-banner-copy">
            <h2 id="cookie-consent-title">Jūsų privatumas svarbus</h2>
            <p id="cookie-consent-copy">Naudojame būtinuosius slapukus svetainei veikti. Pasirenkamus slapukus naudosime tik gavę jūsų sutikimą.</p>
            {loadFailed && <p className="cookie-consent-error" role="status">Naršyklės saugykla neprieinama. Įsitikinkite, kad ji įjungta, ir bandykite dar kartą.</p>}
          </div>
          <div className="cookie-consent-banner-actions">
            <button type="button" className="cookie-consent-button cookie-consent-button-secondary" onClick={rejectOptional}>Atmesti pasirenkamus</button>
            <button type="button" className="cookie-consent-button cookie-consent-button-text" onClick={() => { setChoices(choicesFromConsent(consent)); setSettingsOpen(true); }}>Nustatymai</button>
            <button type="button" className="cookie-consent-button cookie-consent-button-primary" onClick={acceptAll}>Priimti visus</button>
          </div>
        </section>
      )}
    </>
  );
}