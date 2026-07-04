/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-homepage.js
  var import_homepage_exports = {};
  __export(import_homepage_exports, {
    default: () => import_homepage_default
  });

  // tools/importer/parsers/hero-search.js
  function parse(element, { document }) {
    const bgImage = Array.from(
      element.querySelectorAll('img.hero-home-img, img[class*="hero"], img')
    ).find((img) => img.src && !img.src.startsWith("data:"));
    const heading = element.querySelector('h1, h2, h3, [class*="title"]:not(.quicklinks-title):not(.section-title)');
    const introEl = element.querySelector(".quicklinks-title");
    let intro;
    if (introEl && introEl.textContent.trim()) {
      intro = document.createElement("p");
      intro.textContent = introEl.textContent.trim();
    }
    const ctaLinks = Array.from(element.querySelectorAll("a.home-cta, .cta-section a")).filter((a) => a.getAttribute("href")).map((a) => {
      var _a;
      const link = document.createElement("a");
      link.href = a.getAttribute("href");
      const label = (((_a = a.querySelector(".layer")) == null ? void 0 : _a.textContent) || a.textContent || "").trim();
      link.textContent = label;
      return link;
    }).filter((a) => a.textContent);
    const cells = [];
    if (bgImage) {
      cells.push([bgImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (intro) contentCell.push(intro);
    contentCell.push(...ctaLinks);
    if (!heading && contentCell.length === 0 && !bgImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    cells.push([contentCell]);
    const block = WebImporter.Blocks.createBlock(document, { name: "hero-search", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-icons.js
  function parse2(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".iconlistsvg__section"));
    const cells = [];
    cards.forEach((card) => {
      var _a;
      const icon = card.querySelector(".iconlistsvg__section--svg img, img");
      const link = card.querySelector(".iconlistsvg__section--text a, a[href]");
      if (!icon && !link) return;
      const iconCell = icon || "";
      let textCell = "";
      if (link) {
        const a = document.createElement("a");
        a.href = link.getAttribute("href") || "";
        const label = (((_a = link.querySelector("span")) == null ? void 0 : _a.textContent) || link.textContent || "").trim();
        a.textContent = label;
        textCell = a;
      }
      cells.push([iconCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-icons", cells });
    const headingSrc = element.querySelector(".iconlistsvg__content > h3, h3, h2");
    if (headingSrc) {
      const heading = document.createElement(headingSrc.tagName.toLowerCase());
      heading.textContent = headingSrc.textContent.trim();
      element.replaceWith(heading, block);
    } else {
      element.replaceWith(block);
    }
  }

  // tools/importer/parsers/cards-stats.js
  function parse3(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".icon-feature"));
    const cells = [];
    cards.forEach((card) => {
      const icon = card.querySelector("figure img, img.icon, img");
      const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
      const caption = card.querySelector("p");
      if (!icon && !heading && !caption) return;
      const iconCell = icon || "";
      const textCell = [];
      if (heading) textCell.push(heading);
      if (caption) textCell.push(caption);
      cells.push([iconCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-stats", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-feature.js
  function parse4(element, { document }) {
    const cards = Array.from(element.querySelectorAll(".cmp-list__item"));
    const cells = [];
    cards.forEach((card) => {
      const image = card.querySelector(".cmp-list__item-img img, figure img, img");
      const heading = card.querySelector("h1, h2, h3, h4, h5, h6");
      const description = card.querySelector("p.short-desc-gen, p");
      const linkEl = card.querySelector(".cmp-list__item-content a[href], a[href]");
      if (!image && !heading && !description) return;
      const imageCell = image || "";
      const textCell = [];
      if (heading) {
        card.querySelectorAll(".generic-chevron, .fa").forEach((el) => el.remove());
        textCell.push(heading);
      }
      if (description) textCell.push(description);
      if (linkEl && linkEl.getAttribute("href")) {
        const cta = document.createElement("a");
        cta.href = linkEl.getAttribute("href");
        const label = ((heading == null ? void 0 : heading.textContent) || linkEl.textContent || "").trim();
        cta.textContent = label;
        if (cta.textContent) textCell.push(cta);
      }
      cells.push([imageCell, textCell]);
    });
    if (cells.length === 0) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const block = WebImporter.Blocks.createBlock(document, { name: "cards-feature", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/columns-media.js
  function parse5(element, { document }) {
    var _a;
    const flagImages = Array.from(element.querySelectorAll(".aoc-flags img"));
    const contentImage = element.querySelector(
      ".stdbanner_imagebox img, .imagebox img, .aoc-image img"
    ) || Array.from(element.querySelectorAll("img")).find((img) => {
      const src = img.getAttribute("src");
      if (!src || src.startsWith("data:")) return false;
      if (flagImages.includes(img)) return false;
      return true;
    });
    const heading = element.querySelector(
      ".stdbanner_heading, .txtmediaheading, h1, h2, h3, h4, h5, h6"
    );
    const description = element.querySelector(
      ".stdbanner_description p, .txtmediadescription p, .aoc p, p"
    );
    const linkEl = element.querySelector(
      ".btn_Wrap_Secondary_stdban a[href], .learnmoreCTA a[href], .aoc-cta, a[href]"
    );
    const textCell = [];
    flagImages.forEach((img) => textCell.push(img));
    if (heading) textCell.push(heading);
    if (description) textCell.push(description);
    if (linkEl && linkEl.getAttribute("href")) {
      const cta = document.createElement("a");
      cta.href = linkEl.getAttribute("href");
      const label = (((_a = linkEl.querySelector("span")) == null ? void 0 : _a.textContent) || linkEl.textContent || "").trim();
      cta.textContent = label;
      if (cta.textContent) textCell.push(cta);
    }
    if (textCell.length === 0 && !contentImage) {
      element.replaceWith(...element.childNodes);
      return;
    }
    const cells = [[
      textCell.length ? textCell : "",
      contentImage || ""
    ]];
    const block = WebImporter.Blocks.createBlock(document, { name: "columns-media", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/rmit-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Qualtrics website-feedback widget (cleaned.html L3837, L3845-3846)
        "#ZN_0qv48Ja0WN6tQkh",
        ".QSIFeedbackButton",
        "#QSIFeedbackButton-btn",
        // Campaign-notification experience-fragment chrome (cleaned.html L10-L12)
        "#root-experiencefragment",
        "#campaign-notification-master"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        // Header / primary + utility navigation wrapper (cleaned.html L15) -> EDS header region
        ".top-nav",
        // Primary mega-navigation container (cleaned.html L1166) -> EDS header region
        ".primarynav",
        // Hidden mobile-nav accordion embedded near the hero (cleaned.html L2138-L2139, L226)
        ".mobinav__display",
        ".mobinav__wrapper",
        "#mobinav-accsection",
        // Footer multi-column link megamenu (cleaned.html L3542) -> EDS footer region
        ".footer",
        // Tracking pixels / empty embeds (everesttech pixel + empty iframe, cleaned.html L3834, L3850)
        "iframe",
        // Non-authorable asset/markup leftovers
        "noscript",
        "link",
        "style",
        "source"
      ]);
      element.querySelectorAll("*").forEach((el) => {
        el.removeAttribute("data-cmp-data-layer-enabled");
        el.removeAttribute("onclick");
        el.removeAttribute("data-track");
      });
    }
  }

  // tools/importer/transformers/rmit-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.beforeTransform) {
      const sections = payload && payload.template && payload.template.sections || [];
      if (sections.length < 2) return;
      const doc = element.ownerDocument;
      for (let i = sections.length - 1; i >= 0; i -= 1) {
        const section = sections[i];
        if (!section || !section.selector) continue;
        const target = element.querySelector(section.selector);
        if (!target) continue;
        if (section.style) {
          const metadata = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          if (target.nextSibling) {
            target.parentNode.insertBefore(metadata, target.nextSibling);
          } else {
            target.parentNode.appendChild(metadata);
          }
        }
        if (i > 0) {
          const hr = doc.createElement("hr");
          const selectors = sections.map((s) => s.selector).filter(Boolean);
          const prev = target.previousElementSibling;
          let breakBefore = target;
          if (prev) {
            const isOwnSectionAnchor = selectors.some((sel) => {
              try {
                return prev.matches(sel) || prev.querySelector(sel);
              } catch (e) {
                return false;
              }
            });
            const hasHeading = prev.querySelector("h1, h2, h3, h4, h5, h6") || /^h[1-6]$/i.test(prev.tagName);
            const hasImage = prev.querySelector("img, picture");
            if (!isOwnSectionAnchor && hasHeading && !hasImage) {
              breakBefore = prev;
            }
          }
          breakBefore.parentNode.insertBefore(hr, breakBefore);
        }
      }
    }
  }

  // tools/importer/import-homepage.js
  var parsers = {
    "hero-search": parse,
    "cards-icons": parse2,
    "cards-stats": parse3,
    "cards-feature": parse4,
    "columns-media": parse5
  };
  var PAGE_TEMPLATE = {
    name: "homepage",
    description: "RMIT university homepage: header/nav, hero banner with search, study-area icon grid, reputation/stats section, feature cards (transfer/pathways), text+media application CTA, in-the-news featured story, acknowledgement of country, and footer with megamenu.",
    urls: [
      "https://www.rmit.edu.au/"
    ],
    blocks: [
      {
        name: "hero-search",
        instances: [".hero-home"]
      },
      {
        name: "cards-icons",
        instances: [".iconlistsvg"]
      },
      {
        name: "cards-stats",
        instances: [".iconfeature"]
      },
      {
        name: "cards-feature",
        instances: [".generic-gridlist"]
      },
      {
        name: "columns-media",
        instances: [".standardbanners.stdbanner--red", ".textandmedia", ".acknowledgementofcountry"]
      }
    ],
    sections: [
      { id: "rc2", name: "Hero banner", selector: ".hero-home", style: null, blocks: ["hero-search"], defaultContent: [] },
      { id: "rc3", name: "What would you like to study", selector: ".iconlistsvg", style: "light", blocks: ["cards-icons"], defaultContent: [".iconlistsvg__content > h3"] },
      { id: "rc4", name: "Reputation and stats", selector: ".iconfeature", style: "light", blocks: ["cards-stats"], defaultContent: [] },
      { id: "rc5", name: "Pathways feature cards", selector: ".generic-gridlist", style: "light", blocks: ["cards-feature"], defaultContent: [] },
      { id: "rc6", name: "Local student applications", selector: ".standardbanners.stdbanner--red", style: "accent-red", blocks: ["columns-media"], defaultContent: [] },
      { id: "rc7", name: "In the news", selector: ".textandmedia", style: "grey", blocks: ["columns-media"], defaultContent: [".section-title .h2"] },
      { id: "rc8", name: "Acknowledgement of Country", selector: ".acknowledgementofcountry", style: "light", blocks: ["columns-media"], defaultContent: [] }
    ]
  };
  var transformers = [
    transform,
    ...PAGE_TEMPLATE.sections && PAGE_TEMPLATE.sections.length > 1 ? [transform2] : []
  ];
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), {
      template: PAGE_TEMPLATE
    });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
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
            section: blockDef.section || null
          });
        });
      });
    });
    console.log(`Found ${pageBlocks.length} block instances on page`);
    return pageBlocks;
  }
  var import_homepage_default = {
    transform: (payload) => {
      const { document, url, params } = payload;
      const main = document.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);
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
      executeTransformers("afterTransform", main, payload);
      const hr = document.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document);
      WebImporter.rules.transformBackgroundImages(main, document);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "") || "/index"
      );
      return [{
        element: main,
        path,
        report: {
          title: document.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_homepage_exports);
})();
