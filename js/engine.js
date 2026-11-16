/*
 * IBD CAPO'S Lite - decision-support engine (English interface only)
 *
 * Port of the IBD CAPO'S desktop code (Python):
 *   - DiagnosticEngine and determine_diagnosis()  <- collection_ttkb.py
 *   - CDAI calculation                            <- cdai_ttkb.py
 *   - Marsh-Oberhuber classification              <- marsh_score_ttkb.py
 *
 * Rules are NOT retyped here: the six rule-based scores read window.IBD_RULES
 * (js/rules.js), which is generated from DEFAULT_SCORES_CONFIG in the desktop code.
 *
 * Differences from the desktop code are listed in DEVIATIONS below and in the README.
 * No network access, no storage: every function is pure.
 */
(function (root) {
  "use strict";

  var DEVIATIONS = [
    "Indeterminate colitis uses the scores computed for the current case. The desktop code reads the scores displayed from the previous run.",
    "The prediction needs at least 3 clinical elements. The desktop check counts default values and never triggers.",
    "CDAI severity is classified on the displayed integer score, so values between thresholds are never left unclassified.",
    "CDAI refuses to compute without weight and height. The desktop code adds 100 points when weight is empty.",
    "Marsh: combinations the desktop rules map to Marsh 0 by default are flagged with a warning. The classification itself is unchanged."
  ];

  // Two entries of the desktop rule table, 'vih_micro' (tuberculosis, variable 'vih') and 'cmv' (infectious colitis,
  // variable 'cmv'), refer to variables that do not exist in the form. They look like older duplicates of 'vih_sero_tb',
  // 'vih_sero_inf' and 'cmv_sero_inf', which read the real checkboxes and do fire. In the desktop these two entries never
  // fire, and they do not fire here. Do NOT map them with ALIASES: the same finding would be counted twice.
  var ALIASES = {};

  var DISEASES = [
    { key: "crohn", label: "Crohn's disease" },
    { key: "rch", label: "Ulcerative colitis" },
    { key: "tuberculose", label: "Intestinal tuberculosis" },
    { key: "infectieuse", label: "Infectious colitis" },
    { key: "radique", label: "Radiation colitis" },
    { key: "coeliaque", label: "Celiac disease" },
    { key: "indeterminee", label: "Indeterminate colitis" },
    { key: "autre", label: "Other diagnosis" }
  ];

  var SUB_DIAGNOSES = [
    { key: "hemorroides", label: "Hemorrhoids" },
    { key: "diverticulose", label: "Diverticulosis" },
    { key: "dolichocolon", label: "Dolichocolon/IBS" },
    { key: "tumeur", label: "Tumor/Polyp" },
    { key: "microscopique", label: "Microscopic colitis" },
    { key: "hirschsprung", label: "Hirschsprung disease" },
    { key: "behcet", label: "Behçet disease" },
    { key: "autre", label: "Other" }
  ];

  function clamp100(x) { return Math.max(0, Math.min(x, 100)); }
  function within(val, list) { return list.indexOf(val) !== -1; }

  /**
   * Computes all scores for one case.
   * @param {Object} state  var name -> value (checkbox: 1/0, select: option text or "", age: string)
   * @param {Object} rules  window.IBD_RULES
   * @param {Object} labels optional var -> human label, used only for the explanation trace
   * @returns {{scores:number[], sub:Object, trace:Object}}
   */
  function computeAll(state, rules, labels) {
    labels = labels || {};
    var trace = {};

    function v(name) {
      var real = ALIASES[name] || name;
      return Object.prototype.hasOwnProperty.call(state, real) ? state[real] : 0;
    }

    function tracer(key) {
      var list = [];
      trace[key] = list;
      return function (text, pts) { list.push({ text: text, pts: pts }); };
    }

    function calcRules(diseaseKey) {
      var add = tracer(diseaseKey);
      var score = 0;
      var set = rules[diseaseKey] || {};
      Object.keys(set).forEach(function (k) {
        var rule = set[k];
        var val = v(rule.var);
        var pts = rule.points;
        var name = labels[rule.var] || rule.var;
        if (rule.type === "bool") {
          if (val) { score += pts; add(name, pts); }
        } else if (rule.type === "match") {
          if (within(val, rule.values_en)) { score += pts; add(name + ": " + val, pts); }
        } else if (rule.type === "not_match") {
          if (!within(val, rule.values_en)) { score += pts; add(name + ": not " + rule.values_en.join(", "), pts); }
        }
      });
      return clamp100(score);
    }

    function age() {
      var raw = v("patient_age");
      if (raw === "" || raw === 0 || raw === null || raw === undefined) return 0;
      var s = String(raw).trim();
      return /^[+-]?\d+$/.test(s) ? parseInt(s, 10) : 0;
    }

    var scoreMap = {};
    ["crohn", "rch", "tuberculose", "infectieuse", "radique", "coeliaque"].forEach(function (k) {
      scoreMap[k] = calcRules(k);
    });

    function indeterminee() {
      var add = tracer("indeterminee");
      var score = 50; add("Starting value", 50);
      var crohn = scoreMap.crohn, rch = scoreMap.rch, tb = scoreMap.tuberculose,
          inf = scoreMap.infectieuse, rad = scoreMap.radique, coe = scoreMap.coeliaque;
      if (v("fistules")) { score -= 10; add("Fistulas", -10); }
      if (v("rectum_atteint") && within(v("distribution"), ["Continue", "Continuous"])) { score -= 15; add("Rectal involvement with continuous distribution", -15); }
      if (v("tuberculose_ant") || v("quantiferon")) { score -= 15; add("Tuberculosis history or positive QuantiFERON", -15); }
      if (v("cdiff") || v("salmonella") || v("campylobacter")) { score -= 15; add("Positive stool pathogen", -15); }
      if (v("radio")) { score -= 20; add("Pelvic/abdominal radiotherapy", -20); }
      var ttg = v("transglutaminase");
      if (!within(ttg, ["Normale", "Normal", "", null]) || v("endomysium") || v("atrophie_villositaire")) { score -= 20; add("Celiac markers present", -20); }
      if ((crohn > 30 && rch > 30) || (crohn > 30 && coe > 30) || (rch > 30 && coe > 30)) { score += 20; add("Two or more scores above 30", 20); }
      else if (crohn < 30 && rch < 30 && tb < 30 && inf < 30 && rad < 30 && coe < 30) { score += 10; add("All scores below 30", 10); }
      return clamp100(score);
    }

    var sub = {};

    function hemorroides() {
      var add = tracer("sub_hemorroides"), s = 0;
      if (v("hemorroides_endoscopiques")) { s += 60; add("Hemorrhoids seen at endoscopy", 60); }
      if (within(v("rectorragies_type"), ["Isolée (sans diarrhée)", "Isolated (no diarrhea)"])) { s += 25; add("Isolated rectal bleeding", 25); }
      if (within(v("constipation_type"), ["Occasionnelle", "Occasional", "Chronique", "Chronic"])) { s += 10; add("Constipation", 10); }
      if (within(v("diarrhee_type"), ["Chronique (>4 sem)", "Chronic (>4 weeks)"])) { s -= 20; add("Chronic diarrhea", -20); }
      if (v("rectum_atteint") || v("ulcerations")) { s -= 20; add("Rectal involvement or ulcerations", -20); }
      if (v("fievre")) { s -= 10; add("Fever", -10); }
      return clamp100(s);
    }

    function diverticulose() {
      var add = tracer("sub_diverticulose"), s = 0;
      if (!v("diverticules")) return 0;
      s += 60; add("Diverticula seen at endoscopy", 60);
      if (within(v("constipation_type"), ["Chronique", "Chronic"])) { s += 15; add("Chronic constipation", 15); }
      else if (within(v("constipation_type"), ["Occasionnelle", "Occasional"])) { s += 8; add("Occasional constipation", 8); }
      if (within(v("localisation_douleur"), ["Fosse iliaque gauche", "Left lower quadrant"])) { s += 15; add("Left lower quadrant pain", 15); }
      var a = age();
      if (a > 60) { s += 15; add("Age over 60", 15); }
      else if (a > 50) { s += 10; add("Age over 50", 10); }
      else if (a > 40) { s += 5; add("Age over 40", 5); }
      if (v("fistules") || v("fistules_endoscopiques")) { s -= 15; add("Fistulas", -15); }
      if (within(v("diarrhee_type"), ["Chronique (>4 sem)", "Chronic (>4 weeks)"])) { s -= 10; add("Chronic diarrhea", -10); }
      return clamp100(s);
    }

    function dolichocolon() {
      var add = tracer("sub_dolichocolon"), s = 0;
      if (!v("dolichocolon")) return 0;
      s += 65; add("Dolichocolon seen at endoscopy", 65);
      if (within(v("constipation_type"), ["Chronique", "Chronic"])) { s += 20; add("Chronic constipation", 20); }
      if (v("ballonnements")) { s += 10; add("Bloating", 10); }
      if (!within(v("alternance"), ["Absente", "None", "", null])) { s += 10; add("Alternating bowel habit", 10); }
      if (!within(v("rectorragies_type"), ["Absente", "None", "", null])) { s -= 15; add("Rectal bleeding", -15); }
      if (v("fievre")) { s -= 10; add("Fever", -10); }
      return clamp100(s);
    }

    function tumeur() {
      var add = tracer("sub_tumeur"), s = 0;
      if (v("tumeur_polype")) { s += 60; add("Tumor or polyp seen at endoscopy", 60); }
      if (v("anemie")) { s += 20; add("Anemia", 20); }
      if (v("masse_abdominale")) { s += 20; add("Abdominal mass", 20); }
      if (v("melena")) { s += 15; add("Melena", 15); }
      var a = age();
      if (a > 60) { s += 15; add("Age over 60", 15); }
      else if (a > 50) { s += 10; add("Age over 50", 10); }
      else if (a > 40) { s += 5; add("Age over 40", 5); }
      if (v("amaigrissement")) { s += 10; add("Weight loss", 10); }
      if (!within(v("rectorragies_type"), ["Absente", "None", "", null])) { s += 8; add("Rectal bleeding", 8); }
      if (within(v("diarrhee_type"), ["Aiguë (<4 sem)", "Acute (<4 weeks)"])) { s -= 15; add("Acute diarrhea", -15); }
      if (v("tuberculose_ant") || v("bk")) { s -= 20; add("Tuberculosis history or positive BK", -20); }
      return clamp100(s);
    }

    function microscopique() {
      var add = tracer("sub_microscopique"), s;
      if (!within(v("diarrhee_type"), ["Chronique (>4 sem)", "Chronic (>4 weeks)"])) return 0;
      s = 30; add("Chronic diarrhea (required)", 30);
      if (within(v("calprotectine"), ["< 50 µg/g"])) { s += 20; add("Fecal calprotectin below 50 µg/g", 20); }
      if (within(v("crp"), ["Normale", "Normal"])) { s += 15; add("Normal CRP", 15); }
      if (v("ains")) { s += 15; add("NSAID use", 15); }
      if (!v("ulcerations") && !v("rectum_atteint") && !v("ileon_atteint") && !v("stenoses")) { s += 20; add("No endoscopic lesions", 20); }
      if (v("diverticules")) { s -= 15; add("Diverticula", -15); }
      if (v("hemorroides_endoscopiques")) { s -= 15; add("Hemorrhoids", -15); }
      if (v("tumeur_polype")) { s -= 20; add("Tumor or polyp", -20); }
      if (v("dolichocolon")) { s -= 20; add("Dolichocolon", -20); }
      if (v("fievre")) { s -= 10; add("Fever", -10); }
      if (v("amaigrissement")) { s -= 5; add("Weight loss", -5); }
      return clamp100(s);
    }

    function hirschsprung() {
      var add = tracer("sub_hirschsprung"), s = 0;
      var a = age();
      if (within(v("constipation_type"), ["Chronique", "Chronic"]) && a < 10) { s += 50; add("Chronic constipation under age 10", 50); }
      else if (within(v("constipation_type"), ["Chronique", "Chronic"]) && a < 18) { s += 20; add("Chronic constipation under age 18", 20); }
      if (s > 0 && v("ballonnements")) { s += 15; add("Bloating", 15); }
      if (within(v("diarrhee_type"), ["Chronique (>4 sem)", "Chronic (>4 weeks)"])) { s -= 20; add("Chronic diarrhea", -20); }
      return clamp100(s);
    }

    function behcet() {
      var add = tracer("sub_behcet"), s;
      if (!v("aphtes")) return 0;
      s = 35; add("Recurrent oral aphthae (required)", 35);
      if (v("oculaires")) { s += 25; add("Ocular involvement", 25); }
      if (v("cutanees")) { s += 20; add("Skin involvement", 20); }
      if (v("arthralgies")) { s += 10; add("Arthralgia", 10); }
      if (within(v("diarrhee_type"), ["Chronique (>4 sem)", "Chronic (>4 weeks)"])) { s -= 10; add("Chronic diarrhea", -10); }
      if (v("bk")) { s -= 20; add("Positive BK", -20); }
      return clamp100(s);
    }

    function autreNonInflammatoire(others) {
      var add = tracer("sub_autre"), s = 0;
      if (within(v("crp"), ["Normale", "Normal"])) { s += 15; add("Normal CRP", 15); }
      if (within(v("calprotectine"), ["< 50 µg/g"])) { s += 15; add("Fecal calprotectin below 50 µg/g", 15); }
      if (!v("ulcerations") && !v("rectum_atteint") && !v("diverticules") && !v("hemorroides_endoscopiques") &&
          !v("tumeur_polype") && !v("dolichocolon")) { s += 20; add("No lesion pointing to another cause", 20); }
      if (Math.max.apply(null, others) > 40) { s = Math.max(0, s - 20); add("Another non-inflammatory diagnosis is more likely", -20); }
      return clamp100(s);
    }

    sub.hemorroides = hemorroides();
    sub.diverticulose = diverticulose();
    sub.dolichocolon = dolichocolon();
    sub.tumeur = tumeur();
    sub.microscopique = microscopique();
    sub.hirschsprung = hirschsprung();
    sub.behcet = behcet();
    sub.autre = autreNonInflammatoire([sub.hemorroides, sub.diverticulose, sub.dolichocolon, sub.tumeur, sub.microscopique, sub.hirschsprung, sub.behcet]);

    var scores = [
      scoreMap.crohn, scoreMap.rch, scoreMap.tuberculose, scoreMap.infectieuse,
      scoreMap.radique, scoreMap.coeliaque, indeterminee()
    ];
    scores.push(Math.max.apply(null, SUB_DIAGNOSES.map(function (d) { return sub[d.key]; })));
    return { scores: scores, sub: sub, trace: trace };
  }

  /** Port of determine_diagnosis(): picks the main and secondary diagnoses. */
  function decide(scores, sub) {
    var maxScore = Math.max.apply(null, scores);
    var maxIndex = scores.indexOf(maxScore);
    var out = { main: null, kind: null, subCode: null, secondary: [], maxScore: maxScore, maxIndex: maxIndex };
    var subLabel = {};
    SUB_DIAGNOSES.forEach(function (d) { subLabel[d.key] = d.label; });

    if (maxScore < 30) {
      out.main = "Inconclusive - reassessment needed"; out.kind = "inconclusive";
    } else if (maxIndex === 7) {
      var maxSub = Math.max.apply(null, SUB_DIAGNOSES.map(function (d) { return sub[d.key]; }));
      if (maxSub > 30) {
        var code = null, best = -Infinity;
        SUB_DIAGNOSES.forEach(function (d) { if (sub[d.key] > best) { best = sub[d.key]; code = d.key; } });
        out.main = "Other diagnosis (" + subLabel[code] + ")"; out.kind = "non_inflammatory"; out.subCode = code;
      } else {
        out.main = "Other diagnosis (non-inflammatory) - specify"; out.kind = "non_inflammatory"; out.subCode = "autre";
      }
    } else {
      out.main = DISEASES[maxIndex].label; out.kind = "inflammatory";
    }

    var threshold = Math.max(30, Math.trunc(maxScore * 0.50));
    for (var i = 0; i < 7; i++) {
      if (i === maxIndex) continue;
      if (scores[i] >= threshold) out.secondary.push({ label: DISEASES[i].label, score: scores[i] });
    }
    SUB_DIAGNOSES.forEach(function (d) {
      if (d.key === out.subCode) return;
      var val = sub[d.key];
      if (val >= threshold && val > 35) out.secondary.push({ label: subLabel[d.key], score: val });
    });
    return out;
  }

  /** Counts clinical elements actually filled in (checked boxes and chosen options; age and defaults do not count). */
  function countFilled(state, form) {
    var n = 0;
    form.forEach(function (sec) {
      sec.fields.forEach(function (f) {
        var val = state[f.var];
        if (f.kind === "checkbutton" && val) n++;
        if (f.kind === "combobox" && val) n++;
      });
    });
    return n;
  }

  // ------------------------------------------------------------------ CDAI
  var CDAI_THRESHOLDS = [
    { min: 0, max: 149, text: "Remission", tone: "ok" },
    { min: 150, max: 219, text: "Mild", tone: "info" },
    { min: 220, max: 450, text: "Moderate", tone: "warn" },
    { min: 451, max: 999, text: "Severe", tone: "bad" }
  ];

  /**
   * @param {{stools:number,pain:number,wellbeing:number,mass:number,antidiarrheal:number,
   *          hematocrit:number|null,weight:number,height:number,sex:string,complications:number}} i
   */
  function cdai(i) {
    var stools = Number(i.stools) || 0;
    // Desktop: float(entry or 40) -> an empty field means 40, a typed 0 stays 0.
    var hematocrit = (i.hematocrit === null || i.hematocrit === undefined || i.hematocrit === "") ? 40 : Number(i.hematocrit);
    var weight = Number(i.weight) || 0;
    var height = Number(i.height) || 0;
    if (!(weight > 0) || !(height > 0)) return { error: "Enter current weight and height to compute the CDAI." };
    var h = height / 100;
    var ideal = 22 * (h * h);
    var normalHct = i.sex === "M" ? 47 : 42;
    var terms = {
      stools: stools * 2,
      pain: i.pain * 5,
      wellbeing: i.wellbeing * 7,
      complications: i.complications * 20,
      antidiarrheal: i.antidiarrheal * 30,
      mass: i.mass * 10,
      hematocrit: Math.max(0, (normalHct - hematocrit) * 6),
      weight: Math.max(0, 100 * (1 - weight / ideal))
    };
    var raw = 0;
    Object.keys(terms).forEach(function (k) { raw += terms[k]; });
    var total = Math.trunc(raw);
    var sev = CDAI_THRESHOLDS.filter(function (t) { return total >= t.min && total <= t.max; })[0] || { text: "Above scale", tone: "bad" };
    return { total: total, severity: sev.text, tone: sev.tone, terms: terms, idealWeight: ideal, normalHct: normalHct, hematocrit: hematocrit };
  }

  // ----------------------------------------------------------------- Marsh
  var IEL_THRESHOLD = 25;
  var MARSH_TYPES = {
    "0": { name: "Marsh 0", desc: "Normal mucosa", findings: "Normal villous architecture, V/C ratio > 3, IEL < 25/100", management: "No celiac disease, investigate other diagnosis", tone: "ok", interp: "Normal/Benign" },
    "1": { name: "Marsh 1", desc: "Isolated lymphocytic infiltration", findings: "IEL > 25/100 enterocytes, normal villous architecture", management: "Possible celiac disease (serology+) or lymphocytic enteropathy", tone: "info", interp: "Normal/Benign" },
    "2": { name: "Marsh 2", desc: "Crypt hyperplasia", findings: "IEL > 25, crypt hyperplasia (decreased V/C ratio), preserved villi", management: "Probable celiac disease, consider gluten-free diet", tone: "warn", interp: "Active inflammation" },
    "3a": { name: "Marsh 3a", desc: "Partial villous atrophy", findings: "IEL > 25, crypt hyperplasia, shortened villi (>⅓ of normal height)", management: "Confirmed celiac disease, strict gluten-free diet", tone: "bad", interp: "Severe lesions" },
    "3b": { name: "Marsh 3b", desc: "Subtotal villous atrophy", findings: "IEL > 25, crypt hyperplasia, very short villi (<⅓ of normal height)", management: "Active celiac disease, strict gluten-free diet", tone: "bad", interp: "Severe lesions" },
    "3c": { name: "Marsh 3c", desc: "Total villous atrophy", findings: "IEL > 25, crypt hyperplasia, absent villi (flat mucosa)", management: "Severe celiac disease, strict gluten-free diet + supplementation", tone: "bad", interp: "Severe lesions" },
    "4": { name: "Marsh 4", desc: "Hypoplasia", findings: "Complete villous atrophy with atrophic crypts (rare)", management: "Refractory celiac disease? Reassessment needed", tone: "dark", interp: "Severe lesions" }
  };
  var ATROPHY = ["None", "Partial (>1/3)", "Subtotal (<1/3)", "Total (flat)", "Hypoplasia"];
  var MARSH_PRESETS = {
    "0": { iel: 10, vc: 3.5, crypt: false, atrophy: 0 },
    "1": { iel: 30, vc: 3.0, crypt: false, atrophy: 0 },
    "2": { iel: 40, vc: 2.0, crypt: true, atrophy: 0 },
    "3a": { iel: 50, vc: 1.5, crypt: true, atrophy: 1 },
    "3b": { iel: 60, vc: 0.8, crypt: true, atrophy: 2 },
    "3c": { iel: 70, vc: 0.3, crypt: true, atrophy: 3 },
    "4": { iel: 80, vc: 0.1, crypt: false, atrophy: 4 }
  };

  /** @returns {{type:string, defaulted:boolean}} defaulted = the desktop rules fall back to Marsh 0 for this combination */
  function marshClassify(iel, crypt, atrophy) {
    var T = IEL_THRESHOLD;
    if (iel <= T && !crypt && atrophy === 0) return { type: "0", defaulted: false };
    if (iel > T && !crypt && atrophy === 0) return { type: "1", defaulted: false };
    if (iel > T && crypt && atrophy === 0) return { type: "2", defaulted: false };
    if (iel > T && crypt && atrophy === 1) return { type: "3a", defaulted: false };
    if (iel > T && crypt && atrophy === 2) return { type: "3b", defaulted: false };
    if (iel > T && crypt && atrophy === 3) return { type: "3c", defaulted: false };
    if (iel > T && atrophy === 4) return { type: "4", defaulted: false };
    return { type: "0", defaulted: true };
  }

  var api = {
    DEVIATIONS: DEVIATIONS, ALIASES: ALIASES, DISEASES: DISEASES, SUB_DIAGNOSES: SUB_DIAGNOSES,
    computeAll: computeAll, decide: decide, countFilled: countFilled,
    cdai: cdai, CDAI_THRESHOLDS: CDAI_THRESHOLDS,
    marshClassify: marshClassify, MARSH_TYPES: MARSH_TYPES, MARSH_PRESETS: MARSH_PRESETS, ATROPHY: ATROPHY, IEL_THRESHOLD: IEL_THRESHOLD
  };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.IBDEngine = api;
})(typeof window !== "undefined" ? window : globalThis);
