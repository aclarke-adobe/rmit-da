/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: RMIT site-wide cleanup.
 *
 * Removes non-authorable site chrome and tracking/noise so the import contains
 * only page-level authorable content. Header/nav and footer map to the EDS
 * auto-populated header/footer regions (nav + footer documents), not page body.
 *
 * All selectors below were verified against migration-work/cleaned.html
 * (the scraped DOM of https://www.rmit.edu.au/). Source line references are
 * noted in comments; none are guessed.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Qualtrics website-feedback widget (cleaned.html L3837, L3845-3846)
      '#ZN_0qv48Ja0WN6tQkh',
      '.QSIFeedbackButton',
      '#QSIFeedbackButton-btn',
      // Campaign-notification experience-fragment chrome (cleaned.html L10-L12)
      '#root-experiencefragment',
      '#campaign-notification-master',
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    WebImporter.DOMUtils.remove(element, [
      // Header / primary + utility navigation wrapper (cleaned.html L15) -> EDS header region
      '.top-nav',
      // Primary mega-navigation container (cleaned.html L1166) -> EDS header region
      '.primarynav',
      // Hidden mobile-nav accordion embedded near the hero (cleaned.html L2138-L2139, L226)
      '.mobinav__display',
      '.mobinav__wrapper',
      '#mobinav-accsection',
      // Footer multi-column link megamenu (cleaned.html L3542) -> EDS footer region
      '.footer',
      // Tracking pixels / empty embeds (everesttech pixel + empty iframe, cleaned.html L3834, L3850)
      'iframe',
      // Non-authorable asset/markup leftovers
      'noscript',
      'link',
      'style',
      'source',
    ]);

    // Strip analytics / tracking attributes left on remaining authorable content.
    element.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('data-cmp-data-layer-enabled');
      el.removeAttribute('onclick');
      el.removeAttribute('data-track');
    });
  }
}
