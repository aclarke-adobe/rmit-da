/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RMIT section breaks + section metadata.
 *
 * Driven entirely by payload.template.sections (from page-templates.json), so it
 * is template-agnostic and reusable across RMIT templates. Runs in beforeTransform
 * so section selectors (e.g. .hero-home, .iconlistsvg) still match the original
 * source DOM — block parsers replace those elements later via replaceWith(), but
 * the <hr> section breaks and Section Metadata blocks inserted as siblings here
 * remain in place around the resulting block tables.
 *
 * For each section (processed in reverse document order so inserts don't shift
 * earlier selectors):
 *   - Insert an <hr> section break before the section element, except for the
 *     first section.
 *   - When the section has a `style`, create a Section Metadata block after the
 *     section element.
 *
 * Section styles for the homepage template (verified in page-templates.json):
 *   rc2 hero -> null  (SKIP metadata per authoring-analysis: full-bleed hero
 *                      background belongs to the block, not a section container)
 *   rc3/rc4/rc5/rc8 -> light
 *   rc6 -> accent-red
 *   rc7 -> grey
 *
 * All section selectors (.hero-home, .iconlistsvg, .iconfeature, .generic-gridlist,
 * .standardbanners.stdbanner--red, .textandmedia, .acknowledgementofcountry) were
 * verified against migration-work/cleaned.html.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    const sections = (payload && payload.template && payload.template.sections) || [];
    if (sections.length < 2) return;

    const doc = element.ownerDocument;

    // Reverse order so DOM inserts do not shift the position of not-yet-processed sections.
    for (let i = sections.length - 1; i >= 0; i -= 1) {
      const section = sections[i];
      if (!section || !section.selector) continue;

      const target = element.querySelector(section.selector);
      if (!target) continue;

      // Section Metadata block after the section (only when a style is defined).
      if (section.style) {
        const metadata = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        if (target.nextSibling) {
          target.parentNode.insertBefore(metadata, target.nextSibling);
        } else {
          target.parentNode.appendChild(metadata);
        }
      }

      // Section break before every section except the first.
      if (i > 0) {
        const hr = doc.createElement('hr');

        // Keep an introductory heading with its section: if the block anchor's
        // immediately-preceding sibling is a heading container (holds an h1-h6,
        // no nested block anchor, no image), the break goes before it so the
        // heading stays in this section rather than trailing the previous one.
        const selectors = sections.map((s) => s.selector).filter(Boolean);
        const prev = target.previousElementSibling;
        let breakBefore = target;
        if (prev) {
          const isOwnSectionAnchor = selectors.some((sel) => {
            try { return prev.matches(sel) || prev.querySelector(sel); } catch (e) { return false; }
          });
          const hasHeading = prev.querySelector('h1, h2, h3, h4, h5, h6')
            || /^h[1-6]$/i.test(prev.tagName);
          const hasImage = prev.querySelector('img, picture');
          if (!isOwnSectionAnchor && hasHeading && !hasImage) {
            breakBefore = prev;
          }
        }
        breakBefore.parentNode.insertBefore(hr, breakBefore);
      }
    }
  }
}
