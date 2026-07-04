/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-stats
 * Base block: cards
 * Source: https://www.rmit.edu.au/ (.iconfeature)
 * Generated: 2026-07-03
 *
 * Cards block contract (2 columns, multiple rows):
 *   Row 1: block name
 *   Each card row: [icon cell, text cell (heading + caption)]
 *
 * Source: each ".icon-feature" is a metric callout with an icon (figure img.icon),
 * a big-number heading (h3) and a caption (p).
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.icon-feature'));

  const cells = [];

  cards.forEach((card) => {
    // Icon: the metric icon image.
    const icon = card.querySelector('figure img, img.icon, img');

    // Heading (big number) + caption.
    const heading = card.querySelector('h1, h2, h3, h4, h5, h6');
    const caption = card.querySelector('p');

    if (!icon && !heading && !caption) return;

    const iconCell = icon || '';

    const textCell = [];
    if (heading) textCell.push(heading);
    if (caption) textCell.push(caption);

    cells.push([iconCell, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-stats', cells });
  element.replaceWith(block);
}
