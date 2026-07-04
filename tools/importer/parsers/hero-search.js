/* eslint-disable */
/* global WebImporter */
/**
 * Parser for hero-search
 * Base block: hero
 * Source: https://www.rmit.edu.au/ (.hero-home)
 * Generated: 2026-07-03
 *
 * Hero block contract (1 column, 3 rows):
 *   Row 1: block name
 *   Row 2: background image (optional)
 *   Row 3: title (heading), subheading, CTAs
 */
export default function parse(element, { document }) {
  // Background image: the full-bleed hero image. Skip inline data: SVGs (logo/search icon).
  const bgImage = Array.from(
    element.querySelectorAll('img.hero-home-img, img[class*="hero"], img'),
  ).find((img) => img.src && !img.src.startsWith('data:'));

  // Headline
  const heading = element.querySelector('h1, h2, h3, [class*="title"]:not(.quicklinks-title):not(.section-title)');

  // Intro / subheading line
  const introEl = element.querySelector('.quicklinks-title');
  let intro;
  if (introEl && introEl.textContent.trim()) {
    intro = document.createElement('p');
    intro.textContent = introEl.textContent.trim();
  }

  // CTA links (Study / Research / Partner / Apply). The source anchors contain a
  // duplicate ".layer" label div; rebuild clean anchors with just the visible text + href.
  const ctaLinks = Array.from(element.querySelectorAll('a.home-cta, .cta-section a'))
    .filter((a) => a.getAttribute('href'))
    .map((a) => {
      const link = document.createElement('a');
      link.href = a.getAttribute('href');
      const label = (a.querySelector('.layer')?.textContent || a.textContent || '').trim();
      link.textContent = label;
      return link;
    })
    .filter((a) => a.textContent);

  const cells = [];

  // Row 2: background image (optional)
  if (bgImage) {
    cells.push([bgImage]);
  }

  // Row 3: title + subheading + CTAs, all in a single cell (hero is 1-column)
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (intro) contentCell.push(intro);
  contentCell.push(...ctaLinks);

  // Empty-block guard
  if (!heading && contentCell.length === 0 && !bgImage) {
    element.replaceWith(...element.childNodes);
    return;
  }

  cells.push([contentCell]);

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-search', cells });
  element.replaceWith(block);
}
