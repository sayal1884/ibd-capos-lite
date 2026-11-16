/*
 * IBD CAPO'S Lite - demo agenda.
 * Port of the appointment manager (appointment_ttkb.py): calendar, 30-minute conflict check,
 * reschedule, cancel/restore, delete, reminder links, .ics export.
 * Differences: no SMTP and no database server. Appointments live in this browser (localStorage)
 * and nothing is ever transmitted. Reminders open WhatsApp or the mail application, the user sends them.
 */
(function () {
  "use strict";
  var KEY = "ibdcapos.lite.agenda.v1";
  var CONFLICT_MIN = 30;          // same rule as check_conflict() in the desktop code
  var DEFAULT_COUNTRY_CODE = "+237"; // same default as open_whatsapp() in the desktop code

  var REASONS = [
    ["Functional symptoms", ["Abdominal pain", "Bloating / meteorism", "Nausea / vomiting", "Chronic diarrhea", "Acute diarrhea", "Constipation", "Bowel habit changes", "Epigastric burning / heartburn", "Regurgitation", "Dyspepsia", "Rectal bleeding / blood in stool"]],
    ["Inflammatory bowel disease", ["Crohn’s disease (follow-up)", "Ulcerative colitis (follow-up)", "Suspected inflammatory bowel disease", "Celiac disease (follow-up)", "Intestinal tuberculosis (follow-up)", "Irritable bowel syndrome (IBS)"]],
    ["Upper digestive tract", ["Hiatal hernia", "GERD (gastroesophageal reflux disease)"]],
    ["Liver, gallbladder, pancreas", ["Viral hepatitis (A/B/C/E)", "Chronic hepatitis", "Hepatic cirrhosis", "Abnormal liver function / cytolysis", "Gallstone / cholecystitis", "Pancreatic pathology", "Jaundice / icterus", "Ascites", "Portal hypertension", "Hepatic steatosis (NAFLD/NASH)"]],
    ["Colorectal and anorectal", ["Colonic polyps", "Colorectal cancer (follow-up)", "Hemorrhoids", "Anal fissure", "Anal fistula", "Fecal incontinence", "Rectal prolapse"]],
    ["Procedures and follow-up", ["Scheduled colonoscopy", "Scheduled upper GI endoscopy", "Post-operative digestive follow-up", "Chronic disease follow-up", "Examination results / biopsy", "First consultation", "Second opinion", "Other (specify in details)"]]
  ];

  var items = [], nextId = 1, storageOk = true;
  var sel = isoDate(new Date()), viewY, viewM, reschedId = null;

  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) {
      if (k === "class") n.className = attrs[k]; else if (k === "text") n.textContent = attrs[k];
      else if (k.slice(0, 2) === "on") n.addEventListener(k.slice(2), attrs[k]);
      else if (attrs[k] !== false && attrs[k] != null) n.setAttribute(k, attrs[k] === true ? "" : attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === "string" ? document.createTextNode(c) : c); });
    return n;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function isoDate(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  function parseISO(s) { var p = s.split("-"); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function nice(s) { return parseISO(s).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" }); }

  // ---- storage
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (raw) { var o = JSON.parse(raw); items = o.items || []; nextId = o.nextId || 1; }
    } catch (e) { storageOk = false; }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify({ items: items, nextId: nextId })); storageOk = true; } catch (e) { storageOk = false; }
    $("ag-storage").textContent = storageOk ? "" : "Browser storage is unavailable: appointments are kept only until you close this tab.";
  }

  // ---- conflict check (30 minutes, active appointments of the same day)
  function toMin(t) { var p = t.split(":"); return +p[0] * 60 + +p[1]; }
  function conflicts(date, time, excludeId) {
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return [];
    return items.filter(function (a) {
      return a.date === date && a.status === "active" && a.time && /^\d{2}:\d{2}$/.test(a.time) && a.id !== excludeId &&
        Math.abs(toMin(time) - toMin(a.time)) < CONFLICT_MIN;
    });
  }

  // ---- reminder links
  function waNumber(phone) {
    var p = String(phone || "").replace(/[^0-9+]/g, "");
    if (!p) return "";
    if (p.charAt(0) === "0") p = DEFAULT_COUNTRY_CODE + p.slice(1);
    else if (p.charAt(0) !== "+") p = DEFAULT_COUNTRY_CODE + p;
    return p.replace("+", "");
  }
  function reminderText(a) {
    return "Hello " + a.name + ", this is a reminder of your appointment on " + nice(a.date) + (a.time ? " at " + a.time : "") +
      " (" + a.reason + "). Please reply to confirm or to reschedule.";
  }

  // ---- .ics
  function icsEscape(s) { return String(s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n"); }
  function icsEvent(a) {
    var d = a.date.replace(/-/g, ""), lines = ["BEGIN:VEVENT", "UID:ibdcapos-" + a.id + "-" + a.date + "@lite.local", "DTSTAMP:" + new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "")];
    if (a.time && /^\d{2}:\d{2}$/.test(a.time)) {
      var s = d + "T" + a.time.replace(":", "") + "00";
      var end = toMin(a.time) + 30, e = d + "T" + pad(Math.floor(end / 60) % 24) + pad(end % 60) + "00";
      lines.push("DTSTART:" + s, "DTEND:" + e);
    } else { lines.push("DTSTART;VALUE=DATE:" + d); }
    lines.push("SUMMARY:" + icsEscape("Appointment: " + a.name), "DESCRIPTION:" + icsEscape(a.reason + (a.notes ? " | " + a.notes : "")));
    if (a.status !== "active") lines.push("STATUS:CANCELLED");
    lines.push("END:VEVENT");
    return lines.join("\r\n");
  }
  function download(name, list) {
    var body = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//IBD CAPOS Lite//EN\r\n" + list.map(icsEvent).join("\r\n") + "\r\nEND:VCALENDAR\r\n";
    var url = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
    var a = el("a", { href: url, download: name }); document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
  }

  // ---- rendering
  function renderStats() {
    var today = isoDate(new Date()), limit = new Date(); limit.setDate(limit.getDate() + 7);
    var up = items.filter(function (a) { return a.status === "active" && a.date >= today && a.date <= isoDate(limit); }).length;
    var vals = [["Total", items.length], ["Active", items.filter(function (a) { return a.status === "active"; }).length], ["Cancelled", items.filter(function (a) { return a.status !== "active"; }).length], ["Next 7 days", up]];
    var box = $("ag-stats"); clear(box);
    vals.forEach(function (v) { box.appendChild(el("div", { class: "card stat" }, [el("b", { text: String(v[1]) }), el("span", { class: "muted small", text: v[0] })])); });
  }

  function renderCal() {
    var box = $("ag-cal"); clear(box);
    var first = new Date(viewY, viewM, 1);
    var title = first.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    box.appendChild(el("div", { class: "cal-head" }, [
      el("button", { class: "btn small", type: "button", "aria-label": "Previous month", text: "\u2039", onclick: function () { shift(-1); } }),
      el("b", { text: title }),
      el("button", { class: "btn small", type: "button", "aria-label": "Next month", text: "\u203A", onclick: function () { shift(1); } })
    ]));
    var g = el("div", { class: "cal-grid", role: "grid" });
    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach(function (d) { g.appendChild(el("div", { class: "cal-dow", text: d })); });
    var offset = (first.getDay() + 6) % 7, start = new Date(viewY, viewM, 1 - offset), today = isoDate(new Date());
    for (var i = 0; i < 42; i++) {
      var d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i), iso = isoDate(d);
      var n = items.filter(function (a) { return a.date === iso && a.status === "active"; }).length;
      var cls = "cal-day" + (d.getMonth() !== viewM ? " other" : "") + (iso === today ? " today" : "") + (iso === sel ? " sel" : "");
      (function (iso2) {
        g.appendChild(el("button", { class: cls, type: "button", "aria-label": nice(iso2) + (n ? ", " + n + " appointment" + (n > 1 ? "s" : "") : ""), "aria-pressed": iso2 === sel ? "true" : "false", onclick: function () { sel = iso2; renderAll(); } }, [
          el("span", { text: String(d.getDate()) }), n ? el("span", { class: "dot", text: String(n) }) : null
        ]));
      })(iso);
    }
    box.appendChild(g);
  }
  function shift(delta) { var d = new Date(viewY, viewM + delta, 1); viewY = d.getFullYear(); viewM = d.getMonth(); renderCal(); }

  function renderDay() {
    $("ag-day-title").textContent = nice(sel);
    $("ag-form-date").textContent = "For " + nice(sel) + ". Pick another day in the calendar to change it.";
    var box = $("ag-day"); clear(box);
    var list = items.filter(function (a) { return a.date === sel; }).sort(function (a, b) { return (a.time || "99:99").localeCompare(b.time || "99:99"); });
    if (!list.length) { box.appendChild(el("p", { class: "muted", text: "No appointment on this day. Fill the form to add one." })); return; }
    list.forEach(function (a) {
      var wa = waNumber(a.phone);
      var actions = el("div", { class: "row" }, [
        el("button", { class: "btn small", type: "button", text: "Reschedule", onclick: function () { openResched(a.id); } }),
        el("button", { class: "btn small", type: "button", text: a.status === "active" ? "Cancel" : "Restore", onclick: function () { a.status = a.status === "active" ? "cancelled" : "active"; save(); renderAll(); } }),
        wa ? el("a", { class: "btn small", href: "https://wa.me/" + wa + "?text=" + encodeURIComponent(reminderText(a)), target: "_blank", rel: "noopener", text: "WhatsApp reminder" }) : null,
        a.email ? el("a", { class: "btn small", href: "mailto:" + encodeURIComponent(a.email).replace(/%40/g, "@") + "?subject=" + encodeURIComponent("Appointment reminder") + "&body=" + encodeURIComponent(reminderText(a)), text: "Email reminder" }) : null,
        el("button", { class: "btn small", type: "button", text: ".ics", onclick: function () { download("appointment-" + a.date + ".ics", [a]); } }),
        el("button", { class: "btn small danger", type: "button", text: "Delete", onclick: function () { if (confirm("Delete this appointment?")) { items = items.filter(function (x) { return x.id !== a.id; }); save(); renderAll(); } } })
      ]);
      box.appendChild(el("div", { class: "appt" + (a.status === "active" ? "" : " cancelled") }, [
        el("div", { class: "row" }, [el("b", { text: a.time || "No time" }), el("span", { class: "appt-name", text: a.name }), a.status === "active" ? null : el("span", { class: "badge bad", text: "Cancelled" })]),
        el("div", { class: "muted small", text: a.reason + (a.age ? " · " + a.age + " y" : "") + " · " + a.sex + (a.phone ? " · " + a.phone : "") }),
        a.notes ? el("div", { class: "small", text: a.notes }) : null,
        actions
      ]));
    });
  }

  function renderAll() { renderStats(); renderCal(); renderDay(); }

  // ---- form
  function msg(t, bad) { var m = $("ag-msg"); m.textContent = t; m.style.color = bad ? "var(--bad)" : "var(--ok)"; }
  function clearForm() { ["ag-name", "ag-age", "ag-time", "ag-phone", "ag-email", "ag-precision", "ag-notes"].forEach(function (i) { $(i).value = ""; }); $("ag-reason").value = ""; }

  function saveAppt() {
    var name = $("ag-name").value.trim(), time = $("ag-time").value.trim(), reason = $("ag-reason").value, precision = $("ag-precision").value.trim();
    if (!name) return msg("Enter the patient name.", true);
    if (!reason) return msg("Choose a reason for the appointment.", true);
    var ageRaw = $("ag-age").value.trim(), age = ageRaw === "" ? null : parseInt(ageRaw, 10);
    if (ageRaw !== "" && (isNaN(age) || age < 0 || age > 120)) return msg("Age must be a whole number between 0 and 120.", true);
    var c = conflicts(sel, time, null);
    if (c.length && !confirm("Another appointment is within " + CONFLICT_MIN + " minutes: " + c.map(function (x) { return x.name + " at " + x.time; }).join(", ") + ".\nSave anyway?")) return;
    items.push({ id: nextId++, name: name, age: age, sex: $("ag-sex").value, phone: $("ag-phone").value.trim(), email: $("ag-email").value.trim(),
      reason: reason + (precision ? " \u2013 " + precision : ""), date: sel, time: time, status: "active", notes: $("ag-notes").value.trim(), recorded: new Date().toISOString() });
    save(); clearForm(); msg("Appointment saved."); renderAll();
  }

  function openResched(id) {
    reschedId = id; var a = items.filter(function (x) { return x.id === id; })[0];
    $("ag-rs-date").value = a.date; $("ag-rs-time").value = a.time || "";
    $("ag-resched").showModal();
  }
  function applyResched() {
    var a = items.filter(function (x) { return x.id === reschedId; })[0]; if (!a) return;
    var d = $("ag-rs-date").value, t = $("ag-rs-time").value; if (!d) return;
    var c = conflicts(d, t, a.id);
    if (c.length && !confirm("Another appointment is within " + CONFLICT_MIN + " minutes: " + c.map(function (x) { return x.name + " at " + x.time; }).join(", ") + ".\nSave anyway?")) return;
    a.date = d; a.time = t; sel = d; var p = parseISO(d); viewY = p.getFullYear(); viewM = p.getMonth();
    save(); renderAll();
  }

  function demo() {
    var base = new Date(), mk = function (off) { var d = new Date(base.getFullYear(), base.getMonth(), base.getDate() + off); return isoDate(d); };
    [
      { name: "Demo Patient A", age: 34, sex: "Female", phone: "", email: "", reason: "Suspected inflammatory bowel disease", date: mk(1), time: "09:00", notes: "Fictional example." },
      { name: "Demo Patient B", age: 52, sex: "Male", phone: "", email: "", reason: "Scheduled colonoscopy", date: mk(1), time: "09:15", notes: "Fictional example: this one conflicts with A on purpose." },
      { name: "Demo Patient C", age: 41, sex: "Female", phone: "", email: "", reason: "Celiac disease (follow-up)", date: mk(3), time: "14:30", notes: "Fictional example." }
    ].forEach(function (a) { a.id = nextId++; a.status = "active"; a.recorded = new Date().toISOString(); items.push(a); });
    save(); sel = mk(1); var p = parseISO(sel); viewY = p.getFullYear(); viewM = p.getMonth(); renderAll(); msg("Fictional examples added.");
  }

  function init() {
    load();
    var s = $("ag-reason");
    s.appendChild(el("option", { value: "", text: "Choose a reason" }));
    REASONS.forEach(function (g) { var og = el("optgroup", { label: g[0] }); g[1].forEach(function (r) { og.appendChild(el("option", { value: r, text: r })); }); s.appendChild(og); });
    var now = new Date(); viewY = now.getFullYear(); viewM = now.getMonth();
    $("ag-save").addEventListener("click", saveAppt);
    $("ag-clear-form").addEventListener("click", function () { clearForm(); msg(""); });
    $("ag-demo").addEventListener("click", demo);
    $("ag-ics-all").addEventListener("click", function () { if (!items.length) return msg("Nothing to export yet.", true); download("agenda.ics", items); });
    $("ag-clear").addEventListener("click", function () { if (items.length && confirm("Delete all appointments from this browser?")) { items = []; nextId = 1; save(); renderAll(); msg("All appointments deleted."); } });
    $("ag-resched-form").addEventListener("submit", function (e) { var v = e.submitter ? e.submitter.value : "cancel"; if (v === "ok") applyResched(); });
    if (!storageOk) $("ag-storage").textContent = "Browser storage is unavailable: appointments are kept only until you close this tab.";
    renderAll();
  }

  window.IBDAgenda = { init: init, _test: { conflicts: conflicts, waNumber: waNumber } };
})();
