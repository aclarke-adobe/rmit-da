/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroSearchParser from './parsers/hero-search.js';
import cardsIconsParser from './parsers/cards-icons.js';
import cardsStatsParser from './parsers/cards-stats.js';
import cardsFeatureParser from './parsers/cards-feature.js';
import columnsMediaParser from './parsers/columns-media.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/rmit-cleanup.js';
import sectionsTransformer from './transformers/rmit-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-search': heroSearchParser,
  'cards-icons': cardsIconsParser,
  'cards-stats': cardsStatsParser,
  'cards-feature': cardsFeatureParser,
  'columns-media': columnsMediaParser,
};

// PAGE TEMPLATE CONFIGURATION - Embedded from page-templates.json
const PAGE_TEMPLATE = {
  name: 'homepage',
  description: 'RMIT university homepage: header/nav, hero banner with search, study-area icon grid, reputation/stats section, feature cards (transfer/pathways), text+media application CTA, in-the-news featured story, acknowledgement of country, and footer with megamenu.',
  urls: [
    'https://www.rmit.edu.au/',
  ],
  blocks: [
    {
      name: 'hero-search',
      instances: ['.hero-home'],
    },
    {
      name: 'cards-icons',
      instances: ['.iconlistsvg'],
    },
    {
      name: 'cards-stats',
      instances: ['.iconfeature'],
    },
    {
      name: 'cards-feature',
      instances: ['.generic-gridlist'],
    },
    {
      name: 'columns-media',
      instances: ['.standardbanners.stdbanner--red', '.textandmedia', '.acknowledgementofcountry'],
    },
  ],
  sections: [
    { id: 'rc2', name: 'Hero banner', selector: '.hero-home', style: null, blocks: ['hero-search'], defaultContent: [] },
    { id: 'rc3', name: 'What would you like to study', selector: '.iconlistsvg', style: 'light', blocks: ['cards-icons'], defaultContent: ['.iconlistsvg__content > h3'] },
    { id: 'rc4', name: 'Reputation and stats', selector: '.iconfeature', style: 'light', blocks: ['cards-stats'], defaultContent: [] },
    { id: 'rc5', name: 'Pathways feature cards', selector: '.generic-gridlist', style: 'light', blocks: ['cards-feature'], defaultContent: [] },
    { id: 'rc6', name: 'Local student applications', selector: '.standardbanners.stdbanner--red', style: 'accent-red', blocks: ['columns-media'], defaultContent: [] },
    { id: 'rc7', name: 'In the news', selector: '.textandmedia', style: 'grey', blocks: ['columns-media'], defaultContent: ['.section-title .h2'] },
    { id: 'rc8', name: 'Acknowledgement of Country', selector: '.acknowledgementofcountry', style: 'light', blocks: ['columns-media'], defaultContent: [] },
  ],
};

// TRANSFORMER REGISTRY - cleanup runs first, sections after (section transformer needs 2+ sections)
const transformers = [
  cleanupTransformer,
  ...(PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [sectionsTransformer] : []),
];

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = {
    ...payload,
    template: PAGE_TEMPLATE,
  };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      if (elements.length === 0) {
        console.warn(`Block "${blockDef.name}" selector not found: ${selector}`);
      }
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
          section: blockDef.section || null,
        });
      });
    });
  });
  console.log(`Found ${pageBlocks.length} block instances on page`);
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;

    const main = document.body;

    // 1. beforeTransform (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block (skip already-replaced/detached elements)
    pageBlocks.forEach((block) => {
      if (!block.element.parentNode) return;
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      } else {
        console.warn(`No parser found for block: ${block.name}`);
      }
    });

    // 4. afterTransform (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, '') || '/index',
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
