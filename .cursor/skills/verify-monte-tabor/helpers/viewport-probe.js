(() => {
  const pxColumns = (el) => {
    if (!el) return null;
    const t = getComputedStyle(el).gridTemplateColumns;
    if (!t || t === "none") return 0;
    return t.split(" ").filter((tok) => /px$/.test(tok)).length;
  };
  const root = document.documentElement;
  const body = document.body;
  const tableHint = document.querySelector(".table-hint");
  const floatBtn = document.getElementById("wa-float");
  const heroCta = document.querySelector(".hero .cta");
  const heroCtaBox = heroCta ? heroCta.getBoundingClientRect() : null;
  const opSince = document.querySelector(".op-since");
  const plans = Array.from(document.querySelectorAll(".plan-board .plan"));
  const featured = document.querySelector(".plan--featured");
  const pageScrollWidth = Math.max(root.scrollWidth, body.scrollWidth);
  const lineCount = (el) => {
    if (!el) return 0;
    const range = document.createRange();
    range.selectNodeContents(el);
    return range.getClientRects().length;
  };
  const visibleOpNode = (wrap) => {
    const brief = wrap.querySelector(".op-brief");
    if (brief && getComputedStyle(brief).display !== "none") return brief;
    const full = wrap.querySelector(".op-full");
    if (full) return full;
    return wrap;
  };
  const opWraps = Array.from(
    document.querySelectorAll(".op-band .op-lead, .op-band .op-hours, .op-band .op-since")
  ).filter((el) => getComputedStyle(el).display !== "none");
  const opPhrases = opWraps.map((wrap) => {
    const node = visibleOpNode(wrap);
    const box = node.getBoundingClientRect();
    return {
      text: (node.textContent || "").replace(/\s+/g, " ").trim(),
      top: Math.round(box.top),
      height: Math.round(box.height),
      right: Math.round(box.right),
      lines: lineCount(node),
    };
  });
  const planHeads = Array.from(document.querySelectorAll(".plan-board .plan-head"));
  const planPhotos = Array.from(
    document.querySelectorAll(".plan-board .plan .plan-photo")
  );
  const planFacts = Array.from(
    document.querySelectorAll(".plan-board .plan .plan-fact:first-child")
  );
  return {
    innerWidth: window.innerWidth,
    innerHeight: window.innerHeight,
    clientWidth: root.clientWidth,
    scrollWidth: pageScrollWidth,
    pageOverflowX: pageScrollWidth > root.clientWidth + 1,
    tableHintDisplay: tableHint ? getComputedStyle(tableHint).display : null,
    tableHintText: tableHint ? tableHint.textContent.trim() : null,
    mastheadColumns: pxColumns(document.querySelector(".masthead")),
    heroColumns: pxColumns(document.querySelector(".hero")),
    benefitColumns: pxColumns(document.querySelector(".benefit-layout")),
    contactColumns: pxColumns(document.querySelector(".contact-layout")),
    metaRowColumns: pxColumns(document.querySelector(".meta-row")),
    planBoardColumns: pxColumns(document.querySelector(".plan-board")),
    planCount: plans.length,
    planRights: plans.map((el) => Math.round(el.getBoundingClientRect().right)),
    featuredRight: featured
      ? Math.round(featured.getBoundingClientRect().right)
      : null,
    heroCtaTop: heroCtaBox ? Math.round(heroCtaBox.top) : null,
    heroCtaBottom: heroCtaBox ? Math.round(heroCtaBox.bottom) : null,
    heroCtaWidth: heroCtaBox ? Math.round(heroCtaBox.width) : null,
    opSinceDisplay: opSince ? getComputedStyle(opSince).display : null,
    opPhrases,
    opBandSingleRow: opPhrases.length > 0 && opPhrases.every((p) => p.top === opPhrases[0].top),
    opBandWraps: opPhrases.some((p) => p.lines > 1),
    planHeadHeights: planHeads.map((el) => Math.round(el.getBoundingClientRect().height)),
    planPhotoTops: planPhotos.map((el) => Math.round(el.getBoundingClientRect().top)),
    planFactTops: planFacts.map((el) => Math.round(el.getBoundingClientRect().top)),
    floatVisibility: floatBtn ? getComputedStyle(floatBtn).visibility : null,
    company: (document.querySelector(".company") || {}).textContent || null,
  };
})()
