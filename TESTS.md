# Tests

Two kinds of checks: the engine against the original Python code, and the real page in a browser engine.

## 1. Engine versus the original Python code

`tests/make_reference.py` runs the **original `DiagnosticEngine` class** of the desktop application on 1,500 random cases and stores the results in `tests/reference.json`. `tests/run_tests.js` runs the JavaScript engine on the same cases and compares.

Random cases cover every diagnostic category (Crohn’s disease, ulcerative colitis, tuberculosis, infectious, radiation, celiac, indeterminate, and each of the eight non-inflammatory diagnoses, plus inconclusive results). Each case sets findings with a random density, random options in every list, and a random age.

| Check | Cases | Result |
|---|---|---|
| 8 main scores and 8 sub-scores identical to the Python engine | 1,500 | identical |
| Main and secondary diagnoses identical | 1,500 | identical |
| CDAI total and severity identical | 2,000 | identical |
| Marsh classification identical (full grid of lymphocyte count × crypt hyperplasia × atrophy) | 210 | identical |
| CDAI refuses to compute without weight or height | 2 | pass |
| The 3-finding minimum counts only real findings | 2 | pass |
| Marsh fallback combination is flagged | 1 | pass |

**What is run as-is and what is transcribed.** The six rule-based scores and the eight sub-scores come from the original Python class, executed unchanged. The final decision (`determine_diagnosis`), the CDAI formula and the Marsh conditions belong to graphical-interface classes that cannot run headless, so their reference is a hand transcription in `make_reference.py`. A transcription error would therefore appear in both sides of those three checks.

**Sanity check of the tests.** Changing one rule value by one point makes the score and decision checks fail on 236 and 176 of the 1,500 cases, so the comparison is sensitive.

**Documented differences.** The reference computes indeterminate colitis from the scores of the same case (difference 1 of the README). With the desktop behaviour on a first run, the indeterminate score would differ in 1,055 of the 1,500 random cases.

Run it:

```
node tests/run_tests.js
```

To regenerate the reference you need the original `collection_ttkb.py`:

```
python3 tests/make_reference.py path/to/collection_ttkb.py 1500
```

## 2. Page smoke test

`tests/ui_test.js` loads `index.html` in jsdom from a local server and drives it: form construction (9 sections, 80 fields), the 3-finding gate, ranking compared with the engine, explanation lines, print summary (no name or identifier), reset, CDAI and Marsh pages against the engine, routing, and the agenda (fictional data, conflict check at 15 and 30 minutes, WhatsApp number formatting, required name, cancel, `.ics` export, delete all). **41 checks, all pass, no script error.**

```
npm install
npm run test:ui
```

## 3. Checks in a real browser engine

The page was loaded in headless Chromium at desktop (1280 px) and phone (390 px) widths. No script error and **no external network request** occurred during a session covering all pages. The print layout was rendered to PDF.

## What these tests do not show

They show that the web edition reproduces the desktop rules. They do **not** show that the rules are clinically accurate, and no prospective clinical validation has been performed.
