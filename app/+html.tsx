import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * Root HTML template for web in Expo Router.
 * Injects a global CSS reset to eliminate browser focus rings,
 * focus-visible outlines, unwanted text cursors, and white borders.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <ScrollViewStyleReset />
        <style
          id="rights-compass-focus-reset"
          dangerouslySetInnerHTML={{
            __html: `
              /* ── Focus outline reset ──────────────────────────────────────── */
              *, *::before, *::after, input, textarea, select, button, [contenteditable="true"] {
                outline: none !important;
                outline-style: none !important;
                outline-width: 0 !important;
                outline-color: transparent !important;
                -webkit-tap-highlight-color: transparent !important;
                box-shadow: none !important;
              }
              input:focus, input:focus-visible, input:focus-within,
              textarea:focus, textarea:focus-visible, textarea:focus-within,
              select:focus, select:focus-visible, select:focus-within,
              button:focus, button:focus-visible,
              [contenteditable="true"]:focus, [contenteditable="true"]:focus-visible,
              *:focus, *:focus-visible {
                outline: none !important;
                outline-style: none !important;
                outline-width: 0 !important;
                outline-color: transparent !important;
                box-shadow: none !important;
              }

              /* ── Caret / text-cursor fix ──────────────────────────────────────
                 React Native Web renders <Text> as <div>. Browsers default to
                 cursor:text on divs, producing an unwanted I-beam on all static
                 text. Force a neutral cursor on all non-interactive elements,
                 then restore cursor:text only for real inputs.
                 user-select:none stops text being accidentally highlighted when
                 tapping navigation or cards.
              ─────────────────────────────────────────────────────────────────── */
              html, body, div, span, p, h1, h2, h3, h4, h5, h6, li, ul, ol {
                cursor: default !important;
                user-select: none !important;
                -webkit-user-select: none !important;
              }

              /* Restore text cursor & selection for actual editable inputs */
              input, textarea, [contenteditable="true"] {
                cursor: text !important;
                user-select: text !important;
                -webkit-user-select: text !important;
              }

              /* Pointer cursor for clearly interactive elements */
              button, a, [role="button"] {
                cursor: pointer !important;
              }
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
