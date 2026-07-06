import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  // load footer as fragment. Local preview serves the doc under /content;
  // the published site serves it at the root.
  const footerMeta = getMetadata('footer');
  const defaultPath = window.location.hostname === 'localhost' ? '/content/footer' : '/footer';
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : defaultPath;
  const fragment = await loadFragment(footerPath);
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

  // Normalize the link columns. The published footer delivers them as a flat
  // sequence of heading (<p>) + list (<ul>) pairs inside a single content
  // wrapper, while nested authoring can wrap each group in its own div. Collect
  // every heading/list in order and regroup each heading with its following
  // lists into a .footer-column, so the CSS grid always has one child per
  // column regardless of the source nesting.
  const columns = footer.querySelector('.footer-columns');
  if (columns) {
    const items = [...columns.querySelectorAll('p, ul')];
    const groups = [];
    let current = null;
    items.forEach((node) => {
      if (node.tagName === 'P') {
        current = document.createElement('div');
        current.className = 'footer-column';
        groups.push(current);
        current.append(node);
      } else if (current) {
        current.append(node);
      }
    });
    if (groups.length) {
      const wrapper = columns.querySelector('.default-content-wrapper') || columns;
      wrapper.textContent = '';
      wrapper.append(...groups);
      wrapper.classList.add('footer-columns-grid');
    }
  }

  block.append(footer);
}
