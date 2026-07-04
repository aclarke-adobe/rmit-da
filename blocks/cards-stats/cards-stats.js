/**
 * cards-stats — reputation / key-metric callout band.
 * Each authored row = one stat: cell 1 is an icon (picture), cell 2 is the
 * stat heading (h3) + caption (p). We keep the authored row/cell structure
 * and add semantic classes for styling. Icons are SVGs, so they are left as
 * authored (no image-optimization pipeline).
 * @param {Element} block The block element
 */
export default function decorate(block) {
  [...block.children].forEach((row) => {
    row.classList.add('cards-stats-item');
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture, img')) {
        cell.classList.add('cards-stats-icon');
      } else {
        cell.classList.add('cards-stats-body');
      }
    });
  });
}
