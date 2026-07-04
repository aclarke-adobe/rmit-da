const ICON_BASE = '/content/images/study-icons';

// Study-area labels whose icon slug differs from a plain slug of the label.
const ICON_SLUG_OVERRIDES = {
  'social and community': 'social-and-community',
};

function iconSlug(label) {
  const key = label.trim().toLowerCase();
  if (ICON_SLUG_OVERRIDES[key]) return ICON_SLUG_OVERRIDES[key];
  return key.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function decorate(block) {
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    while (row.firstElementChild) li.append(row.firstElementChild);

    const cells = [...li.children];
    const bodyCell = cells.find((c) => c.querySelector('a') || c.textContent.trim());
    const iconCell = cells.find((c) => c !== bodyCell) || cells[0];

    cells.forEach((cell) => {
      if (cell === bodyCell) cell.className = 'cards-icons-card-body';
      else cell.className = 'cards-icons-card-icon';
    });

    // The source icons are inline SVGs not captured on import; inject the
    // matching discipline icon based on the study-area label.
    const link = bodyCell?.querySelector('a');
    if (iconCell && link && !iconCell.querySelector('img, svg, picture')) {
      const label = link.textContent.trim();
      const img = document.createElement('img');
      img.src = `${ICON_BASE}/${iconSlug(label)}.svg`;
      img.alt = '';
      img.width = 32;
      img.height = 32;
      img.loading = 'lazy';
      iconCell.append(img);
    }

    ul.append(li);
  });

  // Navy corner ribbon (bottom-right), matching the source.
  const ribbon = document.createElement('img');
  ribbon.className = 'cards-icons-ribbon';
  ribbon.src = '/content/images/study-ribbon.svg';
  ribbon.alt = '';
  ribbon.setAttribute('aria-hidden', 'true');
  ribbon.loading = 'lazy';

  block.textContent = '';
  block.append(ul, ribbon);
}
