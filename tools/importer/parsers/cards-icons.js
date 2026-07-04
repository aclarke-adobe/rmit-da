/* eslint-disable */
/* global WebImporter */
/**
 * Parser for cards-icons
 * Base block: cards
 * Source: https://www.rmit.edu.au/ (.iconlistsvg)
 * Generated: 2026-07-03
 *
 * Cards block contract (2 columns, multiple rows):
 *   Row 1: block name
 *   Each card row: [icon cell, text/link cell]
 *
 * Source: each ".iconlistsvg__section" is a study-area item with an SVG icon
 * (.iconlistsvg__section--svg img) and a linked label (.iconlistsvg__section--text a > span).
 * The section heading (h3 "What would you like to study?") is section-level default
 * content and is intentionally excluded from the block.
 */
export default function parse(element, { document }) {
  const cards = Array.from(element.querySelectorAll('.iconlistsvg__section'));

  const cells = [];

  cards.forEach((card) => {
    // Icon: the SVG image inside the icon cell.
    const icon = card.querySelector('.iconlistsvg__section--svg img, img');

    // Label + link: the anchor inside the text cell.
    const link = card.querySelector('.iconlistsvg__section--text a, a[href]');

    // Skip malformed items that have neither icon nor link.
    if (!icon && !link) return;

    // Icon cell (first column).
    const iconCell = icon || '';

    // Text cell (second column): rebuild a clean anchor with the label text.
    let textCell = '';
    if (link) {
      const a = document.createElement('a');
      a.href = link.getAttribute('href') || '';
      const label = (link.querySelector('span')?.textContent || link.textContent || '').trim();
      a.textContent = label;
      textCell = a;
    }

    cells.push([iconCell, textCell]);
  });

  // Empty-block guard.
  if (cells.length === 0) {
    element.replaceWith(...element.childNodes);
    return;
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-icons', cells });

  // Preserve the section heading ("What would you like to study?") as default
  // content before the block, so it is not lost when the block replaces .iconlistsvg.
  const headingSrc = element.querySelector('.iconlistsvg__content > h3, h3, h2');
  if (headingSrc) {
    const heading = document.createElement(headingSrc.tagName.toLowerCase());
    heading.textContent = headingSrc.textContent.trim();
    element.replaceWith(heading, block);
  } else {
    element.replaceWith(block);
  }
}
