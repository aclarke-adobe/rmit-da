import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment. Try the local preview path (/content/footer) first,
  // then fall back to the published root path (/footer).
  const footerMeta = getMetadata('footer');
  let fragment;
  if (footerMeta) {
    fragment = await loadFragment(new URL(footerMeta, window.location).pathname);
  } else {
    fragment = await loadFragment('/content/footer') || await loadFragment('/footer');
  }
  if (!fragment) return;

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
