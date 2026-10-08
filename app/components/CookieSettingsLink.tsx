export function CookieSettingsLink() {
  return (
    <a
      className="cookie-settings-link"
      href="#"
      onClick={(event) => {
        event.preventDefault();
        window.dispatchEvent(new Event("milishop-cookies:settings"));
      }}
    >
      Slapukų nustatymai
    </a>
  );
}