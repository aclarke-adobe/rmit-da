/* eslint-disable */
/* global WebImporter */
/**
 * Parser for columns-media
 * Base block: columns
 * Source: https://www.rmit.edu.au/
 *   Instances: .standardbanners.stdbanner--red, .textandmedia, .acknowledgementofcountry
 * Generated: 2026-07-03
 *
 * Columns block contract (flexible columns/rows):
 *   Row 1: block name
 *   Row 2: one cell per visual column.
 *
 * Each of the three source instances is a two-column text + media layout:
 *   - .standardbanners.stdbanner--red : image + red content panel (heading, copy, CTA)
 *   - .textandmedia                   : image + story text (heading, copy, "Read the story" CTA)
 *   - .acknowledgementofcountry       : text (flags, heading, copy, CTA) + image
 * The parser builds a single row of [text cell, image cell]. The main content
 * image is placed in the image cell; inline data:-URI chevron icons are ignored.
 */
export default function parse(element, { document }) {
  // Flag images specific to the acknowledgement instance (kept with the text cell).
  const flagImages = Array.from(element.querySelectorAll('.aoc-flags img'));

  // Main content image: prefer the dedicated media container, otherwise the first
  // non-data image that is not a flag or inline SVG chevron/decoration.
  const contentImage = element.querySelector(
    '.stdbanner_imagebox img, .imagebox img, .aoc-image img',
  ) || Array.from(element.querySelectorAll('img')).find((img) => {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) return false;
    if (flagImages.includes(img)) return false;
    return true;
  });

  // Heading (across the three instance markups).
  const heading = element.querySelector(
    '.stdbanner_heading, .txtmediaheading, h1, h2, h3, h4, h5, h6',
  );

  // Description paragraph(s).
  const description = element.querySelector(
    '.stdbanner_description p, .txtmediadescription p, .aoc p, p',
  );

  // CTA link (rebuilt cleanly; source anchors wrap spans/chevrons).
  const linkEl = element.querySelector(
    '.btn_Wrap_Secondary_stdban a[href], .learnmoreCTA a[href], .aoc-cta, a[href]',
  );

  const textCell = [];
  flagImages.forEach((img) => textCell.push(img));
  if (heading) textCell.push(heading);
  if (description) textCell.push(description);
  if (linkEl && linkEl.getAttribute('href')) {
    const cta = document.createElement('a');
    cta.href = linkEl.getAttribute('href');
    // Prefer the anchor's own text; fall back to a nested span/text.
    const label = (
      linkEl.querySelector('span')?.textContent
      || linkEl.textContent
      || ''
    ).trim();
    cta.textContent = label;
    if (cta.textContent) textCell.push(cta);
  }

  // Empty-block guard.
  if (textCell.length === 0 && !contentImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  // Two-column row: text + media. Pad with an empty cell if a side is missing so
  // the row keeps a consistent 2-column shape.
  const cells = [[
    textCell.length ? textCell : '',
    contentImage || '',
  ]];

  const block = WebImporter.Blocks.createBlock(document, { name: 'columns-media', cells });
  element.replaceWith(block);
}
