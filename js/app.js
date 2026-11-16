/* IBD CAPO'S Lite - user interface. No network calls, no storage (agenda.js handles its own local storage). */
(function () {
  "use strict";
  var E = window.IBDEngine, RULES = window.IBD_RULES, FORM = window.IBD_FORM;
  var MIN_FINDINGS = 3;

  // ---------------------------------------------------------------- helpers
  function $(id) { return document.getElementById(id); }
  function T(s) { return String(s).replace(/'/g, "\u2019"); } // typographic apostrophe in visible text
  function h(tag, attrs, children) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") n.className = attrs[k];
      else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function signed(n) { return (n > 0 ? "+" : "\u2212") + Math.abs(n); }

  // ---------------------------------------------------------------- navigation
  var PAGES = ["diagnosis", "scores", "cdai", "marsh", "agenda", "guide"];
  function route() {
    var id = (location.hash || "").replace("#", "");
    if (id === "dxResult") id = "diagnosis"; // in-page anchor used by the mobile bar
    if (PAGES.indexOf(id) === -1) id = "diagnosis";
    PAGES.forEach(function (p) { $("page-" + p).classList.toggle("active", p === id); });
    var navId = (id === "cdai" || id === "marsh") ? "scores" : id;
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      if (a.getAttribute("data-nav") === navId) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    $("mobileBar").hidden = !(id === "diagnosis" && lastReady);
    if (!location.hash.match(/^#dxResult$/)) window.scrollTo(0, 0);
  }
  window.addEventListener("hashchange", route);

  // ---------------------------------------------------------------- diagnosis
  var state = {};
  var LABELS = {};
  var lastReady = false;
  var sectionEls = [];

  FORM.forEach(function (sec) {
    sec.fields.forEach(function (f) { LABELS[f.var] = f.label; });
  });

  function buildForm() {
    var root = $("dxForm");
    clear(root);
    sectionEls = [];
    FORM.forEach(function (sec, idx) {
      var count = h("span", { class: "badge mute", id: "cnt-" + sec.id, text: "0" });
      var body = h("div", { class: "sec-body" });
      sec.fields.forEach(function (f) { body.appendChild(buildField(f)); });
      var d = h("details", { class: "card sec" }, [
        h("summary", {}, [h("span", { text: sec.title }), count]),
        body
      ]);
      if (idx < 3) d.open = true;
      root.appendChild(d);
      sectionEls.push(d);
    });
  }

  function buildField(f) {
    var tip = f.tip ? T(f.tip) : "";
    if (f.kind === "checkbutton") {
      var cb = h("input", { type: "checkbox", "data-var": f.var });
      cb.addEventListener("change", function () { state[f.var] = cb.checked ? 1 : 0; update(); });
      return h("label", { class: "chip", title: tip }, [cb, h("span", { text: T(f.label) })]);
    }
    if (f.kind === "combobox") {
      var sel = h("select", { "data-var": f.var }, [h("option", { value: "", text: "Not specified" })]);
      f.options.forEach(function (o) { sel.appendChild(h("option", { value: o, text: T(o) })); });
      sel.addEventListener("change", function () { state[f.var] = sel.value; update(); });
      return h("label", { class: "field", title: tip }, [h("span", { text: T(f.label) }), sel]);
    }
    // spinbox (age)
    var inp = h("input", { type: "number", min: f.min, max: f.max, step: 1, inputmode: "numeric", "data-var": f.var });
    inp.addEventListener("input", function () { state[f.var] = inp.value; update(); });
    return h("label", { class: "field", title: tip }, [h("span", { text: T(f.label) }), inp]);
  }

  function sectionCounts() {
    FORM.forEach(function (sec) {
      var n = 0;
      sec.fields.forEach(function (f) {
        var v = state[f.var];
        if ((f.kind === "checkbutton" || f.kind === "combobox") && v) n++;
        if (f.kind === "spinbox" && v !== undefined && v !== "") n++;
      });
      var b = $("cnt-" + sec.id);
      b.textContent = String(n);
      b.className = "badge " + (n ? "info" : "mute");
    });
  }

  function barRow(label, score, cls, detail, extraName) {
    var sum = h("summary", {}, [
      h("span", { class: "name", text: T(label) + (extraName || "") }),
      h("span", { class: "pts", text: String(score) }),
      h("span", { class: "bar" }, [h("i", { style: "width:" + Math.max(0, Math.min(100, score)) + "%" })])
    ]);
    return h("li", { class: cls }, [h("details", {}, [sum, detail])]);
  }

  function whyList(items) {
    var ul = h("ul");
    if (!items || !items.length) { ul.appendChild(h("li", {}, [h("span", { class: "muted", text: "No finding adds or removes points." })])); return h("div", { class: "why" }, [ul]); }
    items.slice().sort(function (a, b) { return Math.abs(b.pts) - Math.abs(a.pts); }).forEach(function (it) {
      ul.appendChild(h("li", {}, [h("span", { text: T(it.text) }), h("span", { class: it.pts > 0 ? "plus" : "minus", text: signed(it.pts) })]));
    });
    return h("div", { class: "why" }, [ul]);
  }

  var lastResult = null;

  function update() {
    sectionCounts();
    var n = E.countFilled(state, FORM);
    var box = $("dxResult");
    clear(box);
    lastResult = null;
    if (n < MIN_FINDINGS) {
      lastReady = false;
      box.appendChild(h("div", { class: "head" }, [
        h("h2", { text: "Ranking" }),
        h("p", { class: "muted", text: "Tick or choose at least " + MIN_FINDINGS + " clinical findings to see the ranked differential." }),
        h("div", { class: "need" }, [h("progress", { max: MIN_FINDINGS, value: n, "aria-label": "Findings entered" }), h("span", { class: "muted small", text: n + " of " + MIN_FINDINGS })])
      ]));
      $("mobileBar").hidden = true;
      return;
    }
    lastReady = true;
    var r = E.computeAll(state, RULES, LABELS);
    var d = E.decide(r.scores, r.sub);
    lastResult = { r: r, d: d, n: n };

    var secondaryLabels = {};
    d.secondary.forEach(function (s) { secondaryLabels[s.label] = true; });

    var head = h("div", { class: "head" }, [
      h("span", { class: "muted small", text: d.kind === "inconclusive" ? "Result" : "Leading diagnosis" }),
      h("div", { class: "lead-name" + (d.kind === "inconclusive" ? " incl" : ""), text: T(d.main) }),
      d.kind === "inconclusive"
        ? h("p", { class: "small", text: "No diagnosis reaches 30 points. Add findings or re-evaluate the patient." })
        : h("p", { class: "small muted", text: d.maxScore + " points out of 100. Points are not probabilities." })
    ]);
    if (d.secondary.length) {
      head.appendChild(h("p", { class: "small" }, [h("b", { text: "Also consider: " }), document.createTextNode(T(d.secondary.map(function (s) { return s.label + " (" + s.score + " pts)"; }).join(" · ")))]));
    }

    var ul = h("ul", { class: "rank" });
    var order = E.DISEASES.map(function (dis, i) { return { dis: dis, i: i, score: r.scores[i] }; });
    order.sort(function (a, b) { return b.score - a.score || a.i - b.i; });
    order.forEach(function (o) {
      var isLead = d.kind !== "inconclusive" && o.i === d.maxIndex;
      var isSecond = !isLead && secondaryLabels[o.dis.label];
      var cls = isLead ? "lead" : (isSecond ? "second" : "");
      var detail;
      var extra = "";
      if (o.dis.key === "autre") {
        var subs = E.SUB_DIAGNOSES.map(function (s) { return { s: s, v: r.sub[s.key] }; }).sort(function (a, b) { return b.v - a.v; });
        var ul2 = h("ul");
        subs.forEach(function (x) { ul2.appendChild(h("li", {}, [h("span", { text: T(x.s.label) }), h("span", { text: x.v + " pts" })])); });
        var topKey = subs[0].s.key;
        detail = h("div", { class: "why" }, [
          h("p", { class: "small muted", text: "Highest of the eight non-inflammatory sub-scores:" }), ul2,
          h("p", { class: "small", style: "margin-top:.5rem" }, [h("b", { text: "Findings behind " + T(subs[0].s.label) + ":" })]),
          whyList(r.trace["sub_" + topKey])
        ]);
        extra = "";
      } else {
        detail = whyList(r.trace[o.dis.key]);
      }
      ul.appendChild(barRow(o.dis.label, o.score, cls, detail, extra));
    });

    var foot = h("div", { class: "foot" }, [
      h("div", { class: "notice", text: "Decision support only. Confirm with endoscopy, histology and microbiology, and review by a specialist." }),
      h("div", { class: "row" }, [
        h("button", { class: "btn small", type: "button", text: "Print a summary", onclick: printSummary })
      ])
    ]);
    box.appendChild(head); box.appendChild(ul); box.appendChild(foot);

    $("mobileLead").textContent = d.kind === "inconclusive" ? "Inconclusive" : T(d.main) + " · " + d.maxScore;
    if (location.hash === "" || location.hash === "#diagnosis" || location.hash === "#dxResult") $("mobileBar").hidden = false;
  }

  function resetCase() {
    state = {};
    document.querySelectorAll("#dxForm input[type=checkbox]").forEach(function (c) { c.checked = false; });
    document.querySelectorAll("#dxForm select").forEach(function (s) { s.value = ""; });
    document.querySelectorAll("#dxForm input[type=number]").forEach(function (s) { s.value = ""; });
    update();
  }

  function printSummary() {
    if (!lastResult) return;
    var r = lastResult.r, d = lastResult.d;
    var p = $("printCase");
    clear(p);
    p.appendChild(h("h1", { text: "IBD CAPO\u2019S Lite \u2013 case summary" }));
    p.appendChild(h("p", { text: "Generated " + new Date().toLocaleString("en-GB") + ". Research prototype, decision support only. No patient identifier is included." }));
    p.appendChild(h("h2", { text: "Result" }));
    p.appendChild(h("p", {}, [h("b", { text: T(d.main) }), document.createTextNode(d.kind === "inconclusive" ? "" : " \u2013 " + d.maxScore + " points out of 100")]));
    if (d.secondary.length) p.appendChild(h("p", { text: "Also consider: " + T(d.secondary.map(function (s) { return s.label + " (" + s.score + " pts)"; }).join("; ")) }));
    var rows = E.DISEASES.map(function (dis, i) { return [dis.label, r.scores[i]]; });
    var tb = h("table", {}, [h("thead", {}, [h("tr", {}, [h("th", { text: "Diagnosis" }), h("th", { class: "num", text: "Points" })])]), h("tbody")]);
    rows.forEach(function (x) { tb.lastChild.appendChild(h("tr", {}, [h("td", { text: T(x[0]) }), h("td", { class: "num", text: String(x[1]) })])); });
    p.appendChild(tb);
    p.appendChild(h("h2", { text: "Findings entered" }));
    FORM.forEach(function (sec) {
      var items = [];
      sec.fields.forEach(function (f) {
        var v = state[f.var];
        if (f.kind === "checkbutton" && v) items.push(T(f.label));
        if (f.kind === "combobox" && v) items.push(T(f.label + ": " + v));
        if (f.kind === "spinbox" && v !== undefined && v !== "") items.push(T(f.label + ": " + v));
      });
      if (items.length) p.appendChild(h("p", {}, [h("b", { text: sec.title + ": " }), document.createTextNode(items.join("; "))]));
    });
    p.appendChild(h("p", { class: "muted", text: "Scores are rule-based points, not probabilities. Confirm with endoscopy, histology and microbiology." }));
    window.print();
  }

  // ---------------------------------------------------------------- scores page
  var CARDS = [
    { name: "CDAI", full: "Crohn\u2019s Disease Activity Index", about: "Liquid stools, abdominal pain, general well-being, complications.", img: "img/cdai.png", link: "#cdai" },
    { name: "Marsh", full: "Marsh-Oberhuber classification", about: "Villous atrophy, crypt hyperplasia, intraepithelial lymphocytes.", img: "img/marsh.png", link: "#marsh" },
    { name: "CDEIS", full: "Crohn\u2019s Disease Endoscopic Index of Severity", about: "Mucosal injury, deep ulcerations, stenoses.", img: "img/cdeis.png" },
    { name: "SES-CD", full: "Simple Endoscopic Score for Crohn\u2019s Disease", about: "Ulcer size, ulcerated surface, stenoses.", img: "img/ses-cd.png" },
    { name: "UCEIS", full: "Ulcerative Colitis Endoscopic Index of Severity", about: "Vascular pattern, bleeding, erosions and ulcers.", img: "img/uceis.png" },
    { name: "Rutgeerts", full: "Rutgeerts score", about: "Post-operative ileal recurrence at the anastomosis.", img: "img/rgcd.png" }
  ];
  function buildCards() {
    var root = $("scoreCards");
    CARDS.forEach(function (c) {
      var on = !!c.link;
      var card = h("div", { class: "card score-card" + (on ? "" : " off") }, [
        h("div", { class: "score-top" }, [h("img", { src: c.img, alt: "", width: 56, height: 56 }), h("div", {}, [h("h2", { text: c.name, style: "margin:0" }), h("div", { class: "muted small", text: c.full })])]),
        h("p", { text: c.about }),
        on ? h("a", { class: "btn primary", href: c.link, text: "Open " + c.name }) : h("span", { class: "badge mute", text: "Desktop version only" })
      ]);
      root.appendChild(card);
    });
  }

  // ---------------------------------------------------------------- CDAI
  var PAIN = ["0: None", "1: Mild", "2: Moderate", "3: Severe"];
  var WELL = ["0: Well", "1: Slightly below par", "2: Poor", "3: Very poor", "4: Terrible"];
  var MASS = ["0: None", "1: Questionable", "2: Definite", "3: Definite + tender"];
  var COMPS = ["Arthralgia/Arthritis", "Iritis/Uveitis", "Erythema nodosum/Pyoderma", "Aphthous stomatitis", "Anal fissure/Fistula/Abscess", "Enterocutaneous fistula", "Fever (>37.8\u00B0C)"];

  function fillSelect(id, list) { var s = $(id); list.forEach(function (t, i) { s.appendChild(h("option", { value: String(i), text: t })); }); }

  function cdaiUpdate() {
    var comps = 0;
    document.querySelectorAll("#cd-comps input").forEach(function (c) { if (c.checked) comps++; });
    var w = parseFloat($("cd-weight").value), ht = parseFloat($("cd-height").value);
    var bmi = $("cd-bmi");
    if (w > 0 && ht > 0) {
      var b = w / Math.pow(ht / 100, 2);
      var st = b < 18.5 ? "Underweight" : b < 25 ? "Normal" : b < 30 ? "Overweight" : "Obesity";
      bmi.textContent = "BMI " + b.toFixed(1) + " (" + st + "). Ideal weight used by the formula: " + (22 * Math.pow(ht / 100, 2)).toFixed(1) + " kg (BMI 22).";
    } else bmi.textContent = "";
    var res = E.cdai({
      stools: $("cd-stools").value, pain: +$("cd-pain").value, wellbeing: +$("cd-well").value, mass: +$("cd-mass").value,
      antidiarrheal: +$("cd-anti").value, hematocrit: $("cd-hct").value === "" ? null : parseFloat($("cd-hct").value),
      weight: w, height: ht, sex: $("cd-sex").value, complications: comps
    });
    var out = $("cd-out"); clear(out);
    if (res.error) {
      out.appendChild(h("h2", { text: "Result" }));
      out.appendChild(h("p", { class: "muted", text: res.error }));
      return;
    }
    out.appendChild(h("h2", { text: "Result" }));
    out.appendChild(h("div", { class: "row" }, [h("div", { class: "big", text: String(res.total) }), h("span", { class: "badge " + res.tone, text: res.severity })]));
    out.appendChild(h("p", { class: "muted small", text: "Thresholds: below 150 remission, 150\u2013219 mild, 220\u2013450 moderate, above 450 severe." }));
    var rows = [
      ["Liquid stools", "stools \u00D7 2", res.terms.stools],
      ["Abdominal pain", "score \u00D7 5", res.terms.pain],
      ["General well-being", "score \u00D7 7", res.terms.wellbeing],
      ["Complications", "count \u00D7 20", res.terms.complications],
      ["Antidiarrheal drugs", "0/1 \u00D7 30", res.terms.antidiarrheal],
      ["Abdominal mass", "score \u00D7 10", res.terms.mass],
      ["Hematocrit", "max(0, (" + res.normalHct + " \u2212 " + res.hematocrit + ") \u00D7 6)", res.terms.hematocrit],
      ["Weight", "max(0, 100 \u00D7 (1 \u2212 weight / ideal))", res.terms.weight]
    ];
    var tb = h("tbody");
    rows.forEach(function (x) { tb.appendChild(h("tr", {}, [h("td", { text: x[0] }), h("td", { class: "muted small", text: x[1] }), h("td", { class: "num", text: (Math.round(x[2] * 10) / 10).toString() })])); });
    out.appendChild(h("details", {}, [h("summary", { text: "Show the calculation", style: "cursor:pointer;font-weight:600" }), h("table", {}, [h("thead", {}, [h("tr", {}, [h("th", { text: "Term" }), h("th", { text: "Formula" }), h("th", { class: "num", text: "Points" })])]), tb])]));
    out.appendChild(h("p", { class: "muted small", style: "margin-top:.75rem", text: "The total is the sum of the terms, truncated to a whole number. Normal hematocrit used: " + res.normalHct + "% (47 for men, 42 otherwise). Formula as implemented in IBD CAPO\u2019S." }));
  }

  function buildCdai() {
    fillSelect("cd-pain", PAIN); fillSelect("cd-well", WELL); fillSelect("cd-mass", MASS);
    var box = $("cd-comps");
    COMPS.forEach(function (c) { box.appendChild(h("label", { class: "chip" }, [h("input", { type: "checkbox" }), h("span", { text: c })])); });
    ["cd-sex", "cd-height", "cd-weight", "cd-hct", "cd-stools", "cd-pain", "cd-well", "cd-mass", "cd-anti"].forEach(function (id) {
      $(id).addEventListener("input", cdaiUpdate); $(id).addEventListener("change", cdaiUpdate);
    });
    box.addEventListener("change", cdaiUpdate);
    cdaiUpdate();
  }

  // ---------------------------------------------------------------- Marsh
  var marshBusy = false;
  function marshRender(m, defaulted) {
    var info = E.MARSH_TYPES[m];
    var iel = parseInt($("mh-iel").value, 10);
    var out = $("mh-out"); clear(out);
    out.appendChild(h("h2", { text: "Result" }));
    out.appendChild(h("div", { class: "row" }, [h("div", { class: "big", text: info.name }), h("span", { class: "badge " + info.tone, text: info.interp })]));
    out.appendChild(h("p", { style: "font-weight:600;margin-top:.5rem", text: info.desc }));
    out.appendChild(h("p", { text: T(info.findings) }));
    out.appendChild(h("div", { class: "notice" }, [h("b", { text: "Recommended management: " }), document.createTextNode(info.management)]));
    out.appendChild(h("p", { class: "small muted", text: "Intraepithelial lymphocytes: " + (isNaN(iel) ? "not entered" : iel + "/100 enterocytes (" + (iel > E.IEL_THRESHOLD ? "pathological, above 25" : "normal, 25 or fewer") + ")") }));
    if (defaulted) out.appendChild(h("div", { class: "notice warn", text: "This combination of findings matches no Marsh category, so the rules report Marsh 0. Check the lymphocyte count, crypt hyperplasia and atrophy before relying on this result." }));
    out.appendChild(h("p", { class: "small muted", text: "Confirm celiac disease with serology and a clinical review. Marsh type alone does not make the diagnosis." }));
  }
  function marshFromHistology() {
    if (marshBusy) return;
    var iel = parseInt($("mh-iel").value, 10); if (isNaN(iel)) iel = 0;
    var c = E.marshClassify(iel, $("mh-crypt").checked, $("mh-atrophy").selectedIndex);
    document.querySelectorAll("#mh-types input").forEach(function (r) { r.checked = r.value === c.type; });
    marshRender(c.type, c.defaulted);
  }
  function marshFromType(t) {
    var p = E.MARSH_PRESETS[t];
    marshBusy = true;
    $("mh-iel").value = p.iel; $("mh-vc").value = p.vc; $("mh-crypt").checked = p.crypt; $("mh-atrophy").selectedIndex = p.atrophy;
    marshBusy = false;
    marshRender(t, false);
  }
  function buildMarsh() {
    E.ATROPHY.forEach(function (a) { $("mh-atrophy").appendChild(h("option", { text: a })); });
    var box = $("mh-types");
    Object.keys(E.MARSH_TYPES).forEach(function (k) {
      var r = h("input", { type: "radio", name: "marsh", value: k });
      r.addEventListener("change", function () { marshFromType(k); });
      box.appendChild(h("label", { title: E.MARSH_TYPES[k].desc }, [r, document.createTextNode(E.MARSH_TYPES[k].name)]));
    });
    ["mh-iel", "mh-vc", "mh-crypt", "mh-atrophy"].forEach(function (id) {
      $(id).addEventListener("input", marshFromHistology); $(id).addEventListener("change", marshFromHistology);
    });
    marshFromHistology();
  }

  // ---------------------------------------------------------------- start
  $("expandAll").addEventListener("click", function () { sectionEls.forEach(function (d) { d.open = true; }); });
  $("collapseAll").addEventListener("click", function () { sectionEls.forEach(function (d) { d.open = false; }); });
  $("resetCase").addEventListener("click", resetCase);
  $("mobileJump").addEventListener("click", function (e) { e.preventDefault(); $("dxResult").scrollIntoView({ behavior: "smooth", block: "start" }); });

  buildForm(); buildCards(); buildCdai(); buildMarsh();
  update();
  route();
  if (window.IBDAgenda) window.IBDAgenda.init();
})();
