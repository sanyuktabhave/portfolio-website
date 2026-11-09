# First 50 deliveries

Portfolio route: `/case-studies/first-50-deliveries`.

The approved Figma case study is rendered as React components with local illustrations, fonts, and three videos. The Impact section reuses the 2–20 order recording. Video playback pauses outside the viewport and respects reduced-motion preferences.

`styles.css` contains the compiled Tailwind utilities and custom responsive CSS from the approved page. It is self-contained and loads only on this route; the portfolio does not need a Tailwind dependency. Edit page styling here, or regenerate from the original case study source if changing utility classes. Media is namespaced under `public/first-fifty/`.

The homepage remains unchanged. A future project CTA can link to this route.

Validate with `npm run build`; preview using `npm run dev`.
