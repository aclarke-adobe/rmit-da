export default function decorate(block) {
  const rows = [...block.children];
  // First row holds the background image, remaining content lives in the last row.
  const imageRow = rows[0];
  const contentRow = rows[rows.length - 1];

  if (!imageRow?.querySelector('picture')) {
    block.classList.add('no-image');
  } else {
    imageRow.classList.add('hero-search-media');
  }

  const contentCell = contentRow?.querySelector(':scope > div');
  if (!contentCell) return;
  contentCell.classList.add('hero-search-content');

  // Split content into intro text (heading + lead paragraph) and CTA links,
  // mirroring the source's two-column layout: intro on the left, CTAs on the right.
  const ctaParagraphs = [...contentCell.querySelectorAll(':scope > p')]
    .filter((p) => {
      const link = p.querySelector(':scope > a');
      return link && p.textContent.trim() === link.textContent.trim();
    });

  // Left column: heading + lead paragraph(s) (everything that isn't a CTA).
  const leftCol = document.createElement('div');
  leftCol.className = 'hero-search-left';
  [...contentCell.children].forEach((child) => {
    if (!ctaParagraphs.includes(child)) leftCol.append(child);
  });

  // Right column: CTA buttons + course search field.
  const rightCol = document.createElement('div');
  rightCol.className = 'hero-search-right';
  if (ctaParagraphs.length) {
    const ctaGroup = document.createElement('div');
    ctaGroup.className = 'hero-search-cta';
    ctaParagraphs.forEach((p) => {
      const link = p.querySelector('a');
      link.classList.add('hero-search-link');
      // The final CTA (Apply) uses the RMIT-red accent treatment.
      ctaGroup.append(link);
      p.remove();
    });
    rightCol.append(ctaGroup);
  }

  // Course search field (built in JS per the block contract), matching the source.
  const search = document.createElement('form');
  search.className = 'hero-search-form';
  search.action = 'https://www.rmit.edu.au/search';
  search.method = 'get';
  search.setAttribute('role', 'search');
  search.innerHTML = `<label class="hero-search-label" for="hero-search-input">Search courses</label>
    <input id="hero-search-input" class="hero-search-input" type="text" name="q" placeholder="Search courses" autocomplete="off">
    <button class="hero-search-submit" type="submit" aria-label="Submit search">
      <svg viewBox="0 0 22 22" width="22" height="22" aria-hidden="true" focusable="false">
        <path fill="currentColor" d="M20.6 19.2l-5.4-5.3c1-1.3 1.6-2.9 1.6-4.7C16.8 4.9 13.5 1.6 9.4 1.6S2 4.9 2 9.2s3.3 7.6 7.4 7.6c1.7 0 3.3-.6 4.5-1.6l5.4 5.3 1.3-1.3zM3.9 9.2c0-3 2.4-5.4 5.5-5.4s5.5 2.4 5.5 5.4-2.4 5.4-5.5 5.4-5.5-2.4-5.5-5.4z"></path>
      </svg>
    </button>`;
  rightCol.append(search);

  contentCell.append(leftCol, rightCol);
}
