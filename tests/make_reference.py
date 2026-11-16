#!/usr/bin/env python3
"""
Builds tests/reference.json by running the ORIGINAL IBD CAPO'S Python code on random cases.

Usage:  python3 make_reference.py /path/to/collection_ttkb.py [n_cases]

- The six rule-based scores and the eight non-inflammatory sub-scores come from the original
  DiagnosticEngine class, executed as-is (only load_scores_config is replaced to avoid touching files).
- decide(), cdai() and marsh() are hand transcriptions of determine_diagnosis(), calculate_cdai()
  and update_from_histology() (their GUI code cannot run headless).
The generated reference.json is committed, so the JavaScript tests run without the original code.
"""
import ast, json, random, sys, math

path = sys.argv[1]
N = int(sys.argv[2]) if len(sys.argv) > 2 else 3000
src = open(path, encoding="utf-8", errors="replace").read().replace("\r", "")
tree = ast.parse(src)

cfg = None
for node in ast.walk(tree):
    if isinstance(node, ast.Assign) and any(getattr(t, "id", None) == "DEFAULT_SCORES_CONFIG" for t in node.targets):
        cfg = ast.literal_eval(node.value)
cls = [n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "DiagnosticEngine"][0]
ns = {"load_scores_config": lambda: cfg}
exec(ast.get_source_segment(src, cls), ns)
DE = ns["DiagnosticEngine"]

# ---- form fields (same AST extraction as the website's rules.js)
form_cls = [n for n in tree.body if isinstance(n, ast.ClassDef) and n.name == "collector_data"][0]
def lit(n):
    try: return ast.literal_eval(n)
    except Exception: return None
fields = []
for fn in form_cls.body:
    if isinstance(fn, ast.FunctionDef) and fn.name.startswith("create_"):
        for node in ast.walk(fn):
            if isinstance(node, ast.Call) and isinstance(node.func, ast.Attribute):
                a = [lit(x) for x in node.args]
                kw = {k.arg: lit(k.value) for k in node.keywords}
                if node.func.attr == "create_checkbutton_row" and kw.get("var_name"):
                    fields.append(("check", kw["var_name"], None))
                elif node.func.attr == "create_combobox_row" and kw.get("var_name"):
                    fields.append(("select", kw["var_name"], a[3]))
rule_vars = {r["var"] for d in cfg.values() for r in d.values()}

class V:
    def __init__(self, x=0): self.x = x
    def get(self): return self.x

KEYS = ["crohn", "rch", "tuberculose", "infectieuse", "radique", "coeliaque", "indeterminee", "autre"]

def run(state, fresh=True):
    sv = {k: V(0) for k in KEYS}
    eng = DE(lambda name, default=0: state.get(name, default), sv, lang=False)
    if fresh:
        for k in KEYS[:6]:
            sv[k].x = getattr(eng, "calculate_%s_score" % k)()
    return eng.calculate_all()

NAMES = ["Crohn's disease", "Ulcerative colitis", "Intestinal tuberculosis", "Infectious colitis",
         "Radiation colitis", "Celiac disease", "Indeterminate colitis", "Other diagnosis"]
SUBLBL = {"hemorroides": "Hemorrhoids", "diverticulose": "Diverticulosis", "dolichocolon": "Dolichocolon/IBS",
          "tumeur": "Tumor/Polyp", "microscopique": "Microscopic colitis", "hirschsprung": "Hirschsprung disease",
          "behcet": "Behçet disease", "autre": "Other"}

def decide(scores, sous):  # transcription of determine_diagnosis()
    max_score = max(scores); max_index = scores.index(max_score)
    if max_score < 30:
        main, kind, sub_code = "Inconclusive - reassessment needed", "inconclusive", None
    elif max_index == 7:
        if max(sous.values()) > 30:
            sub_code = max(sous, key=sous.get)
            main, kind = "Other diagnosis (%s)" % SUBLBL[sub_code], "non_inflammatory"
        else:
            main, kind, sub_code = "Other diagnosis (non-inflammatory) - specify", "non_inflammatory", "autre"
    else:
        main, kind, sub_code = NAMES[max_index], "inflammatory", None
    thr = max(30, int(max_score * 0.50)); sec = []
    for i, (sc, nm) in enumerate(zip(scores[:7], NAMES[:7])):
        if i == max_index: continue
        if sc >= thr: sec.append([nm, sc])
    for k, val in sous.items():
        if k == sub_code: continue
        if val >= thr and val > 35: sec.append([SUBLBL[k], val])
    return {"main": main, "kind": kind, "subCode": sub_code, "secondary": sec}

def cdai(i):  # transcription of calculate_cdai() with the documented deviations (int-based severity)
    ideal = 22 * ((i["height"] / 100) ** 2)
    hct = i["hct"] if i["hct"] is not None else 40
    normal = 47 if i["sex"] == "M" else 42
    score = (i["stools"] * 2) + (i["pain"] * 5) + (i["wellbeing"] * 7) + (i["comp"] * 20) + \
            (i["anti"] * 30) + (i["mass"] * 10) + max(0, (normal - hct) * 6) + max(0, 100 * (1 - i["weight"] / ideal))
    total = int(score)
    sev = "Remission" if total <= 149 else "Mild" if total <= 219 else "Moderate" if total <= 450 else "Severe" if total <= 999 else "Above scale"
    return {"total": total, "severity": sev}

def marsh(iel, crypt, atrophy):  # transcription of update_from_histology()
    if iel <= 25 and not crypt and atrophy == 0: return "0"
    if iel > 25 and not crypt and atrophy == 0: return "1"
    if iel > 25 and crypt and atrophy == 0: return "2"
    if iel > 25 and crypt and atrophy == 1: return "3a"
    if iel > 25 and crypt and atrophy == 2: return "3b"
    if iel > 25 and crypt and atrophy == 3: return "3c"
    if iel > 25 and atrophy == 4: return "4"
    return "0"

rnd = random.Random(20261115)
cases = []; stale_diff = 0
for n in range(N):
    p = rnd.choice([0.05, 0.1, 0.2, 0.35, 0.5, 0.7])
    st = {}
    for kind, var, opts in fields:
        if kind == "check": st[var] = 1 if rnd.random() < p else 0
        else: st[var] = rnd.choice(opts) if rnd.random() < max(p, 0.3) else ""
    st["patient_age"] = rnd.choice(["", str(rnd.randint(0, 95)), str(rnd.randint(0, 95)), str(rnd.randint(0, 17))])
    scores, sous = run(st, fresh=True)
    scores_stale, _ = run(st, fresh=False)
    if scores_stale[6] != scores[6]: stale_diff += 1
    cases.append({"state": st, "scores": scores, "sub": sous, "decision": decide(scores, sous)})

cd = []
for n in range(2000):
    i = {"stools": rnd.randint(0, 20), "pain": rnd.randint(0, 3), "wellbeing": rnd.randint(0, 4), "mass": rnd.randint(0, 3),
         "anti": rnd.randint(0, 1), "hct": rnd.choice([None, 0, round(rnd.uniform(25, 60), 1), rnd.randint(30, 55)]),
         "weight": round(rnd.uniform(30, 130), 1), "height": round(rnd.uniform(110, 200), 1),
         "sex": rnd.choice(["M", "F", ""]), "comp": rnd.randint(0, 7)}
    cd.append({"in": i, "out": cdai(i)})

mh = []
for iel in range(0, 101, 5):
    for crypt in (False, True):
        for atr in range(5):
            mh.append({"iel": iel, "crypt": crypt, "atrophy": atr, "type": marsh(iel, crypt, atr)})

json.dump({"n": N, "staleIndeterminateDiffers": stale_diff, "cases": cases, "cdai": cd, "marsh": mh,
           "ruleVarsMissingFromForm": sorted(rule_vars - {f[1] for f in fields} - {"patient_age"})},
          open("reference.json", "w", encoding="utf-8"), ensure_ascii=False)
print("cases:", N, "| cdai:", len(cd), "| marsh:", len(mh), "| indeterminate differs with stale state:", stale_diff)
print("rule variables absent from the form:", sorted(rule_vars - {f[1] for f in fields} - {"patient_age"}))
