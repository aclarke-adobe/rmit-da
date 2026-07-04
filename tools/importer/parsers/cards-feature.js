/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-feature
 * Base block: cards
 * Source: https://www.rmit.edu.au/ (.generic-gridlist)
 * Generated: 2026-07-03
 *
 * Cards block contract (2 columns, multiple rows):
 *   Row 1: block name
 *   Each card row: [image cell, text cell (heading + description + CTA)]
 *
 * Source: each ".cmp-list__item" is a promo card with an image
 * (.cmp-list__item-img img), a heading (h3), a description (p.short-desc-gen)
 * and a link (the item content anchor). The source heading is wrapped in the
 * anchor together with a chevron span; the CTA is rebuilt cleanly.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.cmp-list__item'));

  const cells = [];

  cards.forEach((card) => {
    // Image (first column).
    const image = card.querySelector('.cmp-list__item-img img, figure img, img');

    // Heading, description, and the destination link.
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    const description = card.querySelector('p.short-desc-gen, p');
    const linkEl = card.querySelector('.cmp-list__item-content a[href], a[href]');

    if (!image && !heading && !description) return;

    const imageCell = image || '';

    const textCell = [];
    if (heading) {
      // Strip any chevron/icon spans that sit alongside the heading text.
      card.querySelectorAll('.generic-chevron, .fa').forEach((el) => el.remove());
      textCell.push(heading);
    }
    if (description) textCell.push(description);

    // CTA: rebuild a clean link using the heading text as label.
    if (linkEl && linkEl.getAttribute('href')) {
      const cta = document.createElement('a');
      cta.href = linkEl.getAttribute('href');
      const label = (heading?.textContent || linkEl.textContent || '').trim();
      cta.textContent = label;
      if (cta.textContent) textCell.push(cta);
    }

    cells.push([imageCell, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-feature', cells });
  element.replaceWith(block);
}
