import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

import { component$ } from "@builder.io/qwik";

/**
 * The RouterHead component is placed inside of the document `<head>` element.
 */
export const RouterHead = component$(() => {
  const head = useDocumentHead();
  const loc = useLocation();

  return (
    <>
      <title>{head.title}</title>

      <link rel="canonical" href={loc.url.href} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="icon" type="image/png" href="/favicon.png" />

      {head.meta.map((m) => (
        <meta key={m.key} {...m} />
      ))}

      {head.links.map((l) => (
        <link key={l.key} {...l} />
      ))}

      {head.styles.map((s) => (
        <style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
      ))}

      {head.scripts.map((s) => (
        <script key={s.key} {...s.props} dangerouslySetInnerHTML={s.script} />
      ))}

      <ThemeSetter />
    </>
  );
});

export const THEME_STORAGE_KEY = "theme-preference";

export const ThemeSetter = () => {
  const themeScript = `
    function setTheme() {
      const theme = localStorage.getItem('${THEME_STORAGE_KEY}') ?? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      document.firstElementChild.setAttribute('data-theme', theme);
      document.firstElementChild.classList.remove(theme === 'dark' ? 'light' : 'dark');
      document.firstElementChild.classList.add(theme === 'dark' ? 'dark' : 'light');
    }
    setTheme();`;
  return <script dangerouslySetInnerHTML={themeScript} />;
};
