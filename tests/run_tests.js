// Compares the JavaScript engine with results produced by the original Python code.
// Run:  node tests/run_tests.js
"use strict";
const path = require("path");
const fs = require("fs");
const { IBD_RULES, IBD_FORM } = require(path.join(__dirname, "..", "js", "rules.js"));
const E = require(path.join(__dirname, "..", "js", "engine.js"));
const ref = JSON.parse(fs.readFileSync(path.join(__dirname, "reference.json"), "utf8"));

let failures = 0;
const report = [];
function check(name, total, bad, firstBad) {
  const ok = bad === 0;
  if (!ok) failures++;
  report.push({ name, total, bad, ok, firstBad: firstBad || null });
  console.log((ok ? "PASS " : "FAIL ") + name + "  (" + (total - bad) + "/" + total + ")");
  if (!ok && firstBad) console.log("   first mismatch:", JSON.stringify(firstBad).slice(0, 600));
}

// 1. Scores (8 main scores + 8 sub-scores)
{
  let bad = 0, first = null;
  ref.cases.forEach((c, i) => {
    const r = E.computeAll(c.state, IBD_RULES, {});
    const same = JSON.stringify(r.scores) === JSON.stringify(c.scores) && JSON.stringify(r.sub) === JSON.stringify(c.sub);
    if (!same) { bad++; if (!first) first = { i, js: r.scores, py: c.scores }; }
  });
  check("Scores: 8 main and 8 sub-scores identical to the Python engine", ref.cases.length, bad, first);
}

// 2. Final decision (main, secondary diagnoses)
{
  let bad = 0, first = null;
  ref.cases.forEach((c, i) => {
    const r = E.computeAll(c.state, IBD_RULES, {});
    const d = E.decide(r.scores, r.sub);
    const js = { main: d.main, kind: d.kind, subCode: d.subCode, secondary: d.secondary.map(s => [s.label, s.score]) };
    if (JSON.stringify(js) !== JSON.stringify(c.decision)) { bad++; if (!first) first = { i, js, py: c.decision }; }
  });
  check("Decision: main and secondary diagnoses identical", ref.cases.length, bad, first);
}

// 3. CDAI
{
  let bad = 0, first = null;
  ref.cdai.forEach((c, i) => {
    const r = E.cdai({ stools: c.in.stools, pain: c.in.pain, wellbeing: c.in.wellbeing, mass: c.in.mass, antidiarrheal: c.in.anti,
      hematocrit: c.in.hct, weight: c.in.weight, height: c.in.height, sex: c.in.sex, complications: c.in.comp });
    if (r.total !== c.out.total || r.severity !== c.out.severity) { bad++; if (!first) first = { i, js: [r.total, r.severity], py: c.out }; }
  });
  check("CDAI: total and severity identical", ref.cdai.length, bad, first);
}

// 4. Marsh
{
  let bad = 0, first = null;
  ref.marsh.forEach((c, i) => {
    const r = E.marshClassify(c.iel, c.crypt, c.atrophy);
    if (r.type !== c.type) { bad++; if (!first) first = { i, js: r.type, py: c.type, in: c }; }
  });
  check("Marsh: classification identical on the full grid", ref.marsh.length, bad, first);
}

// 5. Safety checks on documented deviations
{
  let bad = 0;
  const r1 = E.cdai({ stools: 0, pain: 0, wellbeing: 0, mass: 0, antidiarrheal: 0, hematocrit: null, weight: 0, height: 170, sex: "F", complications: 0 });
  if (!r1.error) bad++;
  const r2 = E.cdai({ stools: 0, pain: 0, wellbeing: 0, mass: 0, antidiarrheal: 0, hematocrit: null, weight: 70, height: 0, sex: "F", complications: 0 });
  if (!r2.error) bad++;
  check("CDAI refuses to compute without weight and height", 2, bad);
}
{
  const empty = {};
  const n = E.countFilled(empty, IBD_FORM);
  const withThree = { fievre: 1, amaigrissement: 1, crp: "Elevated" };
  check("Minimum-input check counts only real findings", 2, (n === 0 ? 0 : 1) + (E.countFilled(withThree, IBD_FORM) === 3 ? 0 : 1));
}
{
  // Marsh: combinations that the desktop rules send to Marsh 0 by default must be flagged
  const r = E.marshClassify(40, false, 2);
  check("Marsh: fallback combination flagged as 'defaulted'", 1, (r.type === "0" && r.defaulted) ? 0 : 1);
}

console.log(failures === 0 ? "\nALL TESTS PASSED" : "\n" + failures + " TEST GROUP(S) FAILED");
fs.writeFileSync(path.join(__dirname, "last-run.json"), JSON.stringify({ n_cases: ref.cases.length, report, generated: "see TESTS.md" }, null, 1));
process.exit(failures === 0 ? 0 : 1);
