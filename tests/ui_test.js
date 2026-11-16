// Smoke test of the real page in jsdom. Setup:  npm install jsdom   then:  node tests/ui_test.js
"use strict";
const { JSDOM, VirtualConsole } = require("jsdom");
const path = require("path");
const fs = require("fs");
const root = path.join(__dirname, "..");

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", e => errors.push(String(e.message || e)));
vc.on("error", e => errors.push(String(e)));

const http = require("http");
const MIME = { ".html": "text/html", ".js": "text/javascript", ".png": "image/png", ".css": "text/css", ".woff2": "font/woff2" };
const server = http.createServer((req, res) => {
  const f = path.join(root, decodeURIComponent(req.url.split("?")[0]).replace(/^\/$/, "/index.html"));
  if (!f.startsWith(root) || !fs.existsSync(f)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "Content-Type": MIME[path.extname(f)] || "application/octet-stream" }); fs.createReadStream(f).pipe(res);
});
new Promise(r => server.listen(0, "127.0.0.1", r)).then(() => JSDOM.fromURL("http://127.0.0.1:" + server.address().port + "/index.html", {
  runScripts: "dangerously", resources: "usable", pretendToBeVisual: true, virtualConsole: vc,
  beforeParse(w) {
    w.print = () => { w.__printed = true; };
    w.confirm = () => { w.__confirmed = (w.__confirmed || 0) + 1; return true; };
    w.HTMLDialogElement.prototype.showModal = function () { this.setAttribute("open", ""); };
    w.URL.createObjectURL = () => "blob:test"; w.URL.revokeObjectURL = () => {};
    w.HTMLAnchorElement.prototype.click = function () { (w.__clicks = w.__clicks || []).push(this.getAttribute("download") || this.href); };
    w.scrollTo = () => {};
    w.HTMLElement.prototype.scrollIntoView = () => {};
  }
})).then(dom => new Promise(res => dom.window.addEventListener("load", () => setTimeout(() => res(dom), 50))))
.then(dom => {
  const w = dom.window, d = w.document;
  const $ = id => d.getElementById(id);
  let fails = 0;
  const ok = (name, cond, info) => { if (!cond) fails++; console.log((cond ? "PASS " : "FAIL ") + name + (cond || !info ? "" : "  -> " + info)); };
  const fire = (el, type) => el.dispatchEvent(new w.Event(type, { bubbles: true }));
  const tick = (v) => { const c = d.querySelector('#dxForm input[data-var="' + v + '"]'); c.checked = true; fire(c, "change"); };
  const pick = (v, val) => { const s = d.querySelector('#dxForm select[data-var="' + v + '"]'); s.value = val; fire(s, "change"); };

  ok("No script error at load", errors.length === 0, errors.join(" | "));
  ok("Form built with 9 sections", d.querySelectorAll("#dxForm details.sec").length === 9);
  ok("80 fields rendered", d.querySelectorAll("#dxForm [data-var]").length === 80, String(d.querySelectorAll("#dxForm [data-var]").length));
  ok("Empty state asks for 3 findings", /at least 3/.test($("dxResult").textContent));
  ok("Default page is diagnosis", $("page-diagnosis").classList.contains("active"));

  // --- diagnosis, compare with the engine
  tick("fistules"); tick("tabac");
  ok("Still waiting after 2 findings", /at least 3/.test($("dxResult").textContent));
  pick("diarrhee_type", "Chronic (>4 weeks)");
  ok("Ranking appears after 3 findings", d.querySelectorAll("#dxResult .rank > li").length === 8);
  const E = w.IBDEngine;
  const st = { fistules: 1, tabac: 1, diarrhee_type: "Chronic (>4 weeks)" };
  const ref = E.decide(E.computeAll(st, w.IBD_RULES, {}).scores, E.computeAll(st, w.IBD_RULES, {}).sub);
  ok("Leading diagnosis matches the engine", $("dxResult").querySelector(".lead-name").textContent.replace(/\u2019/g, "'") === ref.main, $("dxResult").querySelector(".lead-name").textContent + " vs " + ref.main);
  ok("Lead row highlighted", d.querySelectorAll("#dxResult .rank li.lead").length === 1);
  ok("Explanation lists findings with signed points", /\+\d+/.test($("dxResult").querySelector(".rank li.lead .why").textContent));
  ok("Section counters updated", $("cnt-medical_history").textContent !== "0" || $("cnt-digestive_symptoms").textContent !== "0");
  $("dxResult").querySelector(".foot button").click();
  ok("Print summary built and print dialog requested", w.__printed === true && /case summary/.test($("printCase").textContent) && !/undefined/.test($("printCase").textContent));
  ok("Printed summary has no name/ID fields", !/Patient name|Patient ID:/i.test($("printCase").textContent));
  $("resetCase").click();
  ok("Clear the case resets the form and the ranking", /at least 3/.test($("dxResult").textContent) && !d.querySelector("#dxForm input:checked"));

  // --- CDAI
  const set = (id, v) => { $(id).value = v; fire($(id), "input"); };
  ok("CDAI asks for weight and height first", /weight and height/.test($("cd-out").textContent));
  set("cd-sex", "M"); set("cd-height", "175"); set("cd-weight", "60"); set("cd-hct", "38"); set("cd-stools", "6");
  set("cd-pain", "2"); set("cd-well", "1"); set("cd-mass", "1"); set("cd-anti", "1");
  d.querySelectorAll("#cd-comps input")[0].checked = true; d.querySelectorAll("#cd-comps input")[3].checked = true; fire($("cd-comps"), "change");
  const c = E.cdai({ stools: 6, pain: 2, wellbeing: 1, mass: 1, antidiarrheal: 1, hematocrit: 38, weight: 60, height: 175, sex: "M", complications: 2 });
  ok("CDAI page shows the engine total", $("cd-out").querySelector(".big").textContent === String(c.total), $("cd-out").querySelector(".big").textContent + " vs " + c.total);
  ok("CDAI severity badge shown", $("cd-out").querySelector(".badge").textContent === c.severity);
  ok("CDAI BMI line shown", /BMI/.test($("cd-bmi").textContent));

  // --- Marsh
  ok("Marsh starts at Marsh 0", /Marsh 0/.test($("mh-out").textContent));
  set("mh-iel", "40"); $("mh-atrophy").selectedIndex = 2; fire($("mh-atrophy"), "change");
  ok("Marsh inconsistent combination warns", /matches no Marsh category/.test($("mh-out").textContent));
  d.querySelector('#mh-types input[value="3b"]').click();
  ok("Choosing 3b loads typical values", $("mh-iel").value === "60" && $("mh-crypt").checked && $("mh-atrophy").selectedIndex === 2 && /Marsh 3b/.test($("mh-out").textContent));
  ok("Radio follows histology edits", (() => { set("mh-iel", "10"); $("mh-crypt").checked = false; fire($("mh-crypt"), "change"); $("mh-atrophy").selectedIndex = 0; fire($("mh-atrophy"), "change"); return d.querySelector('#mh-types input[value="0"]').checked; })());

  // --- routing
  const go = (h) => { w.location.hash = h; w.dispatchEvent(new w.HashChangeEvent("hashchange")); };
  ["scores", "cdai", "marsh", "agenda", "guide", "diagnosis"].forEach(p => { go(p); ok("Route #" + p, $("page-" + p).classList.contains("active")); });
  go("cdai"); ok("CDAI highlights the Scores tab", d.querySelector('[data-nav="scores"]').getAttribute("aria-current") === "page");
  ok("Scores page: 2 open + 4 desktop-only cards", d.querySelectorAll("#scoreCards a.btn").length === 2 && d.querySelectorAll("#scoreCards .off").length === 4);

  // --- agenda
  go("agenda");
  $("ag-demo").click();
  const stored = JSON.parse(w.localStorage.getItem("ibdcapos.lite.agenda.v1"));
  ok("Demo adds 3 fictional appointments and persists them", stored.items.length === 3 && stored.items.every(a => /Demo Patient/.test(a.name)));
  const A = w.IBDAgenda._test;
  ok("Conflict check: 15 minutes apart conflicts", A.conflicts(stored.items[0].date, "09:10", null).length >= 1);
  ok("Conflict check: 30 minutes apart is free", A.conflicts(stored.items[0].date, "09:45", null).length === 0);
  ok("WhatsApp number: local number gets +237", A.waNumber("6 99 00 00 00") === "237699000000" && A.waNumber("0699000000") === "237699000000");
  set("ag-name", "Fictional Test"); $("ag-reason").value = "Constipation"; set("ag-time", "09:05");
  $("ag-save").click();
  ok("Save triggers the conflict confirmation", w.__confirmed >= 1);
  ok("Appointment saved", JSON.parse(w.localStorage.getItem("ibdcapos.lite.agenda.v1")).items.length === 4);
  set("ag-name", ""); $("ag-save").click();
  ok("Name is required", /Enter the patient name/.test($("ag-msg").textContent));
  d.querySelector("#ag-day .appt .btn.small:nth-child(2)").click();
  ok("Cancel marks an appointment as cancelled", JSON.parse(w.localStorage.getItem("ibdcapos.lite.agenda.v1")).items.some(a => a.status === "cancelled"));
  $("ag-ics-all").click();
  ok("ICS export triggered", (w.__clicks || []).indexOf("agenda.ics") !== -1);
  $("ag-clear").click();
  ok("Delete all empties the agenda", JSON.parse(w.localStorage.getItem("ibdcapos.lite.agenda.v1")).items.length === 0);

  ok("No script error during the whole session", errors.length === 0, errors.join(" | "));
  console.log(fails === 0 ? "\nUI SMOKE TEST PASSED" : "\n" + fails + " CHECK(S) FAILED");
  server.close(); process.exit(fails === 0 ? 0 : 1);
}).catch(e => { console.error(e); process.exit(2); });
