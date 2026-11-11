# Figma board

The presentation board for the Figma submission. It has 9 pages, each 1920px wide.

- `export/01-cover.png` … `export/09-next.png`: each page rendered as an image. Drag them into Figma, one frame per page.
- `screens/`: the individual app screens at 2x (mobile 390×844, desktop 1440×900), taken from the running app.
- `index.html`: the source of the board. Edit it, then re-render: with `npm run dev` running, `node scripts/capture-board.mjs` re-takes the screens and re-renders every page (`screens` or `pages` does just one half).

To bring the board into Figma as editable layers instead of images, use the live page at https://ooca-mindscape.vercel.app/board/index.html and import it with the html.to.design plugin.
