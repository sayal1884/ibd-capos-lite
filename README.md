# IBD CAPO’S Lite

Web prototype for **differential diagnosis support in inflammatory bowel diseases (IBD)**. It is the browser edition of IBD CAPO’S, a desktop expert system developed for research at the University of Yaoundé I, Cameroon, for settings with limited specialist resources.

**Live demo:** https://sayal1884.github.io/ibd-capos-lite/

> Research prototype. It supports a clinician’s reasoning and does not replace specialist assessment. It is not a certified medical device and has not been validated in a prospective clinical study.

## What it does

| Page | Content |
|---|---|
| Diagnosis | 80 clinical, biological, microbiological and endoscopic findings. Live ranking of 8 diagnoses (Crohn’s disease, ulcerative colitis, intestinal tuberculosis, infectious colitis, radiation colitis, celiac disease, indeterminate colitis, other diagnosis), with the findings that added or removed points. Secondary diagnoses, inconclusive result below 30 points, printable summary. |
| Scores | **CDAI** and **Marsh-Oberhuber** calculators. CDEIS, SES-CD, UCEIS and Rutgeerts are listed for reference and are available in the desktop application only. |
| Agenda | Demo appointment manager: calendar, 30-minute conflict check, reschedule, cancel, reminder links (WhatsApp, email), `.ics` export. |
| Guide | How to read the results and the limits of the tool. |

Not included in this web edition: the endoscopic image analysis module (EndoVision CAPO’S), patient database, PDF report generator and the four other scores. They remain in the desktop application.

## How the results are produced

The six rule-based scores read `js/rules.js`, which is **generated from the rule table of the desktop code** (`DEFAULT_SCORES_CONFIG`), not retyped. Eight further non-inflammatory sub-scores (hemorrhoids, diverticulosis, dolichocolon/IBS, tumor/polyp, microscopic colitis, Hirschsprung disease, Behçet disease, residual) are ported from the desktop `DiagnosticEngine` in `js/engine.js`.

Scores are **rule-based points from 0 to 100, not probabilities**. The highest score leads. Below 30 points the result is inconclusive. Other diagnoses at or above half of the top score (and at least 30) are listed as secondary.

## Differences from the desktop application

The web edition reproduces the desktop rules, with these deliberate changes:

1. **Indeterminate colitis** is computed from the scores of the current case. The desktop code reads the scores displayed from the previous run.
2. **Minimum input**: a ranking needs at least 3 clinical findings. The desktop check counts default values and never triggers.
3. **CDAI** refuses to compute without weight and height (the desktop code adds 100 points when weight is empty) and classifies severity on the displayed integer score.
4. **Marsh**: combinations that match no category are reported as Marsh 0 by the rules, as in the desktop. The page now shows a warning in that case.
5. **No patient name, ID or contact** is collected on the diagnosis page.
6. **Language**: English only.

## Behaviours inherited from the desktop rules

These come from the rule table and are kept so that both editions agree. They are worth knowing when reading a result:

- A list left on *Not specified* counts as “not present” in rules written as “not equal to”. As a result, leaving **Rectal bleeding** and **Alternating bowel habit** unspecified gives Radiation colitis a baseline of 14 points (10 + 4) and removes 5 points from Infectious colitis.
- Two entries of the rule table (`vih_micro`, `cmv`) reference variables that do not exist in the form. They never fire, in both editions. Equivalent entries that do read the real checkboxes (`vih_sero_tb`, `vih_sero_inf`, `cmv_sero_inf`) are active.

## Tests

```
node tests/run_tests.js        # engine versus the original Python code
npm install && npm run test:ui # page smoke test in jsdom
```

Details and results: [TESTS.md](TESTS.md).

## Privacy

No server, no analytics, no cookies, no external request. Diagnosis and score inputs live in memory and disappear on reload. Agenda entries are kept in the browser’s local storage until deleted. Details: [LEGAL.md](LEGAL.md).

## Repository layout

```
index.html          page and styles
js/rules.js         rule table generated from the desktop code
js/engine.js        diagnostic engine, CDAI, Marsh
js/app.js           interface
js/agenda.js        demo agenda
img/  fonts/        images (project) and self-hosted fonts (SIL OFL)
tests/              Python reference generator, reference data, Node tests
```

## Author

NGOHOBA Vigny Sayal, PhD candidate in biochemistry, University of Yaoundé I, Cameroon.

## Licence

No open-source licence is granted yet: all rights are reserved by the author. The source is public for evaluation. Fonts keep their own SIL Open Font License (see `fonts/`).
