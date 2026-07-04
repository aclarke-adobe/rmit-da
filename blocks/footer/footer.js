import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/content/footer';
  const fragment = await loadFragment(footerPath);

  // decorate footer DOM
  block.textContent = '';
  const footer = document.createElement('div');
  while (fragment.firstElementChild) footer.append(fragment.firstElementChild);

  // tag the three sections: brand/utility row, link columns, legal + social
  const sections = ['footer-brand', 'footer-columns', 'footer-legal'];
  sections.forEach((cls, i) => {
    const section = footer.children[i];
    if (section) section.classList.add(cls);
  });

  block.append(footer);
}
