export function CookieSettingsLink() {
  return (
    <span
      dangerouslySetInnerHTML={{
        __html: '<a class="cookie-settings-link" href="#" onclick="window.Cookiebot.show(); return false;">Privacy settings</a>',
      }}
    />
  );
}