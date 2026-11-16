/* Generated from DEFAULT_SCORES_CONFIG in collection_ttkb.py (IBD CAPO'S desktop). Do not edit by hand. */
var __root = (typeof window !== "undefined") ? window : globalThis;
__root.IBD_RULES = {
 "crohn": {
  "tabac": {
   "type": "bool",
   "points": 10,
   "var": "tabac"
  },
  "famille_mici": {
   "type": "bool",
   "points": 5,
   "var": "famille_mici"
  },
  "chirurgie_abdo": {
   "type": "bool",
   "points": 8,
   "var": "chirurgie_abdominale"
  },
  "ains": {
   "type": "bool",
   "points": 5,
   "var": "ains"
  },
  "fistules": {
   "type": "bool",
   "points": 15,
   "var": "fistules"
  },
  "fissures": {
   "type": "bool",
   "points": 10,
   "var": "fissures"
  },
  "diarrhee_chronique": {
   "type": "match",
   "points": 8,
   "var": "diarrhee_type",
   "values_fr": [
    "Chronique (>4 sem)"
   ],
   "values_en": [
    "Chronic (>4 weeks)"
   ]
  },
  "recto_diarrhee": {
   "type": "match",
   "points": 5,
   "var": "rectorragies_type",
   "values_fr": [
    "Associée à des diarrhées"
   ],
   "values_en": [
    "Associated with diarrhea"
   ]
  },
  "glaires": {
   "type": "bool",
   "points": 3,
   "var": "glaires"
  },
  "nocturnes": {
   "type": "bool",
   "points": 5,
   "var": "nocturnes"
  },
  "douleur_fid": {
   "type": "match",
   "points": 8,
   "var": "localisation_douleur",
   "values_fr": [
    "Fosse iliaque droite"
   ],
   "values_en": [
    "Right lower quadrant"
   ]
  },
  "arthralgies": {
   "type": "bool",
   "points": 5,
   "var": "arthralgies"
  },
  "aphtes": {
   "type": "bool",
   "points": 5,
   "var": "aphtes"
  },
  "cutanees": {
   "type": "bool",
   "points": 5,
   "var": "cutanees"
  },
  "oculaires": {
   "type": "bool",
   "points": 5,
   "var": "oculaires"
  },
  "amaigrissement": {
   "type": "bool",
   "points": 3,
   "var": "amaigrissement"
  },
  "retard_croissance": {
   "type": "bool",
   "points": 8,
   "var": "retard_croissance"
  },
  "oedemes": {
   "type": "bool",
   "points": 4,
   "var": "oedemes"
  },
  "asca": {
   "type": "bool",
   "points": 5,
   "var": "asca"
  },
  "calpro_haut": {
   "type": "match",
   "points": 5,
   "var": "calprotectine",
   "values_fr": [
    "> 250 µg/g"
   ],
   "values_en": [
    "> 250 µg/g"
   ]
  },
  "calpro_moyen": {
   "type": "match",
   "points": 2,
   "var": "calprotectine",
   "values_fr": [
    "50-250 µg/g"
   ],
   "values_en": [
    "50-250 µg/g"
   ]
  },
  "lactoferritine_elev": {
   "type": "match",
   "points": 4,
   "var": "lactoferritine",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "albumine_basse": {
   "type": "match",
   "points": 5,
   "var": "albumine",
   "values_fr": [
    "Basse"
   ],
   "values_en": [
    "Low"
   ]
  },
  "vs_tres_elev": {
   "type": "match",
   "points": 3,
   "var": "vs_sed",
   "values_fr": [
    "Modérément élevée (20-50)",
    "Très élevée (>50)"
   ],
   "values_en": [
    "Moderately elevated (20-50)",
    "Very elevated (>50)"
   ]
  },
  "gb_hyper": {
   "type": "match",
   "points": 4,
   "var": "gb_leucocytes",
   "values_fr": [
    "Hyperleucocytose (>12 G/L)"
   ],
   "values_en": [
    "Leukocytosis (>12 G/L)"
   ]
  },
  "fistules_endosco": {
   "type": "bool",
   "points": 15,
   "var": "fistules_endoscopiques"
  },
  "paves": {
   "type": "bool",
   "points": 10,
   "var": "paves"
  },
  "distrib_disco": {
   "type": "match",
   "points": 10,
   "var": "distribution",
   "values_fr": [
    "Discontinue"
   ],
   "values_en": [
    "Discontinuous"
   ]
  },
  "stenoses": {
   "type": "bool",
   "points": 8,
   "var": "stenoses"
  },
  "ileon_atteint": {
   "type": "bool",
   "points": 8,
   "var": "ileon_atteint"
  },
  "ileon_loc": {
   "type": "bool",
   "points": 5,
   "var": "ileon_loc"
  },
  "ulcera_prof": {
   "type": "match",
   "points": 8,
   "var": "ulcerations",
   "values_fr": [
    "Profondes",
    "Aphtoïdes"
   ],
   "values_en": [
    "Deep",
    "Aphthous"
   ]
  },
  "anorexie": {
   "type": "bool",
   "points": 3,
   "var": "anorexie"
  },
  "contraceptif": {
   "type": "bool",
   "points": 5,
   "var": "contraceptif"
  },
  "colon_loc": {
   "type": "bool",
   "points": 5,
   "var": "colon_loc"
  }
 },
 "rch": {
  "famille_mici": {
   "type": "bool",
   "points": 5,
   "var": "famille_mici"
  },
  "tabac_neg": {
   "type": "bool",
   "points": -5,
   "var": "tabac"
  },
  "recto_diarrhee": {
   "type": "match",
   "points": 15,
   "var": "rectorragies_type",
   "values_fr": [
    "Associée à des diarrhées"
   ],
   "values_en": [
    "Associated with diarrhea"
   ]
  },
  "glaires": {
   "type": "bool",
   "points": 10,
   "var": "glaires"
  },
  "syndrome_rectal": {
   "type": "bool",
   "points": 10,
   "var": "syndrome_rectal"
  },
  "diarrhee_chronique": {
   "type": "match",
   "points": 8,
   "var": "diarrhee_type",
   "values_fr": [
    "Chronique (>4 sem)"
   ],
   "values_en": [
    "Chronic (>4 weeks)"
   ]
  },
  "nocturnes": {
   "type": "bool",
   "points": 5,
   "var": "nocturnes"
  },
  "douleur_gauche": {
   "type": "match",
   "points": 5,
   "var": "localisation_douleur",
   "values_fr": [
    "Hypogastre",
    "Fosse iliaque gauche"
   ],
   "values_en": [
    "Hypogastrium",
    "Left lower quadrant"
   ]
  },
  "arthralgies": {
   "type": "bool",
   "points": 5,
   "var": "arthralgies"
  },
  "cutanees": {
   "type": "bool",
   "points": 5,
   "var": "cutanees"
  },
  "oculaires": {
   "type": "bool",
   "points": 3,
   "var": "oculaires"
  },
  "anca": {
   "type": "bool",
   "points": 5,
   "var": "anca"
  },
  "calpro_haut": {
   "type": "match",
   "points": 5,
   "var": "calprotectine",
   "values_fr": [
    "> 250 µg/g"
   ],
   "values_en": [
    "> 250 µg/g"
   ]
  },
  "lactoferritine_elev": {
   "type": "match",
   "points": 4,
   "var": "lactoferritine",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "crp_elev": {
   "type": "match",
   "points": 4,
   "var": "crp",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "albumine_basse": {
   "type": "match",
   "points": 4,
   "var": "albumine",
   "values_fr": [
    "Basse"
   ],
   "values_en": [
    "Low"
   ]
  },
  "vs_elev": {
   "type": "match",
   "points": 3,
   "var": "vs_sed",
   "values_fr": [
    "Modérément élevée (20-50)",
    "Très élevée (>50)"
   ],
   "values_en": [
    "Moderately elevated (20-50)",
    "Very elevated (>50)"
   ]
  },
  "gb_hyper": {
   "type": "match",
   "points": 3,
   "var": "gb_leucocytes",
   "values_fr": [
    "Hyperleucocytose (>12 G/L)"
   ],
   "values_en": [
    "Leukocytosis (>12 G/L)"
   ]
  },
  "oedemes": {
   "type": "bool",
   "points": 3,
   "var": "oedemes"
  },
  "rectum_atteint": {
   "type": "bool",
   "points": 15,
   "var": "rectum_atteint"
  },
  "distrib_continue": {
   "type": "match",
   "points": 15,
   "var": "distribution",
   "values_fr": [
    "Continue"
   ],
   "values_en": [
    "Continuous"
   ]
  },
  "pseudopolypes": {
   "type": "bool",
   "points": 10,
   "var": "pseudopolypes"
  },
  "rectum_loc": {
   "type": "bool",
   "points": 5,
   "var": "rectum_loc"
  },
  "ulcera_superf": {
   "type": "match",
   "points": 5,
   "var": "ulcerations",
   "values_fr": [
    "Superficielles"
   ],
   "values_en": [
    "Superficial"
   ]
  },
  "contraceptif": {
   "type": "bool",
   "points": 3,
   "var": "contraceptif"
  },
  "colon_loc": {
   "type": "bool",
   "points": 8,
   "var": "colon_loc"
  }
 },
 "tuberculose": {
  "tuberculose_ant": {
   "type": "bool",
   "points": 20,
   "var": "tuberculose_ant"
  },
  "voyage": {
   "type": "bool",
   "points": 15,
   "var": "voyage"
  },
  "quantiferon": {
   "type": "bool",
   "points": 15,
   "var": "quantiferon"
  },
  "immunosuppresseur": {
   "type": "bool",
   "points": 12,
   "var": "immunosuppresseur"
  },
  "vih_micro": {
   "type": "bool",
   "points": 10,
   "var": "vih"
  },
  "fievre": {
   "type": "bool",
   "points": 10,
   "var": "fievre"
  },
  "sueurs_nocturnes": {
   "type": "bool",
   "points": 12,
   "var": "sueurs_nocturnes"
  },
  "adenopathies": {
   "type": "bool",
   "points": 15,
   "var": "adenopathies"
  },
  "amaigrissement": {
   "type": "bool",
   "points": 8,
   "var": "amaigrissement"
  },
  "douleur_fid": {
   "type": "match",
   "points": 10,
   "var": "localisation_douleur",
   "values_fr": [
    "Fosse iliaque droite"
   ],
   "values_en": [
    "Right lower quadrant"
   ]
  },
  "vs_tres_elev": {
   "type": "match",
   "points": 12,
   "var": "vs_sed",
   "values_fr": [
    "Très élevée (>50)"
   ],
   "values_en": [
    "Very elevated (>50)"
   ]
  },
  "gb_hyper": {
   "type": "match",
   "points": 5,
   "var": "gb_leucocytes",
   "values_fr": [
    "Hyperleucocytose (>12 G/L)"
   ],
   "values_en": [
    "Leukocytosis (>12 G/L)"
   ]
  },
  "albumine_basse": {
   "type": "match",
   "points": 5,
   "var": "albumine",
   "values_fr": [
    "Basse"
   ],
   "values_en": [
    "Low"
   ]
  },
  "crp_elev": {
   "type": "match",
   "points": 4,
   "var": "crp",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "ileocaecal": {
   "type": "bool",
   "points": 20,
   "var": "ileocaecal"
  },
  "ileocaecal_loc": {
   "type": "bool",
   "points": 15,
   "var": "ileocaecal_loc"
  },
  "stenoses": {
   "type": "bool",
   "points": 10,
   "var": "stenoses"
  },
  "bk": {
   "type": "bool",
   "points": 25,
   "var": "bk"
  },
  "crohn_neg": {
   "type": "bool",
   "points": -8,
   "var": "fistules"
  },
  "rch_neg": {
   "type": "bool",
   "points": -5,
   "var": "rectum_atteint"
  },
  "melena": {
   "type": "bool",
   "points": 8,
   "var": "melena"
  },
  "anorexie": {
   "type": "bool",
   "points": 5,
   "var": "anorexie"
  },
  "vih_sero_tb": {
   "type": "bool",
   "points": 10,
   "var": "vih_sero"
  }
 },
 "infectieuse": {
  "antibiotique": {
   "type": "bool",
   "points": 15,
   "var": "antibiotique"
  },
  "voyage": {
   "type": "bool",
   "points": 10,
   "var": "voyage"
  },
  "diarrhee_aigue": {
   "type": "match",
   "points": 20,
   "var": "diarrhee_type",
   "values_fr": [
    "Aiguë (<4 sem)"
   ],
   "values_en": [
    "Acute (<4 weeks)"
   ]
  },
  "fievre": {
   "type": "bool",
   "points": 10,
   "var": "fievre"
  },
  "sueurs_nocturnes": {
   "type": "bool",
   "points": 5,
   "var": "sueurs_nocturnes"
  },
  "recto_diarrhee": {
   "type": "match",
   "points": 8,
   "var": "rectorragies_type",
   "values_fr": [
    "Associée à des diarrhées"
   ],
   "values_en": [
    "Associated with diarrhea"
   ]
  },
  "glaires": {
   "type": "bool",
   "points": 5,
   "var": "glaires"
  },
  "gb_hyper": {
   "type": "match",
   "points": 12,
   "var": "gb_leucocytes",
   "values_fr": [
    "Hyperleucocytose (>12 G/L)"
   ],
   "values_en": [
    "Leukocytosis (>12 G/L)"
   ]
  },
  "crp_elev": {
   "type": "match",
   "points": 6,
   "var": "crp",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "vs_elev": {
   "type": "match",
   "points": 5,
   "var": "vs_sed",
   "values_fr": [
    "Modérément élevée (20-50)",
    "Très élevée (>50)"
   ],
   "values_en": [
    "Moderately elevated (20-50)",
    "Very elevated (>50)"
   ]
  },
  "lactoferritine_elev": {
   "type": "match",
   "points": 6,
   "var": "lactoferritine",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "cdiff": {
   "type": "bool",
   "points": 20,
   "var": "cdiff"
  },
  "salmonella": {
   "type": "bool",
   "points": 15,
   "var": "salmonella"
  },
  "campylobacter": {
   "type": "bool",
   "points": 15,
   "var": "campylobacter"
  },
  "ecoli": {
   "type": "bool",
   "points": 15,
   "var": "ecoli"
  },
  "parasites": {
   "type": "bool",
   "points": 10,
   "var": "parasites"
  },
  "cmv": {
   "type": "bool",
   "points": 10,
   "var": "cmv"
  },
  "immunosuppresseur": {
   "type": "bool",
   "points": 8,
   "var": "immunosuppresseur"
  },
  "diarrhee_neg_chronique": {
   "type": "match",
   "points": -8,
   "var": "diarrhee_type",
   "values_fr": [
    "Chronique (>4 sem)"
   ],
   "values_en": [
    "Chronic (>4 weeks)"
   ]
  },
  "famille_neg": {
   "type": "bool",
   "points": -5,
   "var": "famille_mici"
  },
  "melena": {
   "type": "bool",
   "points": 5,
   "var": "melena"
  },
  "vhc": {
   "type": "bool",
   "points": 5,
   "var": "vhc"
  },
  "vih_sero_inf": {
   "type": "bool",
   "points": 8,
   "var": "vih_sero"
  },
  "cmv_sero_inf": {
   "type": "bool",
   "points": 6,
   "var": "cmv_sero"
  },
  "alternance_neg": {
   "type": "not_match",
   "points": -5,
   "var": "alternance",
   "values_fr": [
    "Absente"
   ],
   "values_en": [
    "None"
   ]
  },
  "colon_loc": {
   "type": "bool",
   "points": 4,
   "var": "colon_loc"
  }
 },
 "radique": {
  "radio": {
   "type": "bool",
   "points": 30,
   "var": "radio"
  },
  "recto_present": {
   "type": "not_match",
   "points": 10,
   "var": "rectorragies_type",
   "values_fr": [
    "Absente"
   ],
   "values_en": [
    "None"
   ]
  },
  "diarrhee_chronique": {
   "type": "match",
   "points": 8,
   "var": "diarrhee_type",
   "values_fr": [
    "Chronique (>4 sem)"
   ],
   "values_en": [
    "Chronic (>4 weeks)"
   ]
  },
  "constipation": {
   "type": "match",
   "points": 5,
   "var": "constipation_type",
   "values_fr": [
    "Occasionnelle",
    "Chronique"
   ],
   "values_en": [
    "Occasional",
    "Chronic"
   ]
  },
  "douleur_pelvienne": {
   "type": "match",
   "points": 15,
   "var": "localisation_douleur",
   "values_fr": [
    "Pelvienne"
   ],
   "values_en": [
    "Pelvic"
   ]
  },
  "pelvien_loc": {
   "type": "bool",
   "points": 10,
   "var": "pelvien_loc"
  },
  "telangiectasies": {
   "type": "bool",
   "points": 25,
   "var": "telangiectasies"
  },
  "stenoses": {
   "type": "bool",
   "points": 10,
   "var": "stenoses"
  },
  "anemie": {
   "type": "bool",
   "points": 6,
   "var": "anemie"
  },
  "albumine_basse": {
   "type": "match",
   "points": 6,
   "var": "albumine",
   "values_fr": [
    "Basse"
   ],
   "values_en": [
    "Low"
   ]
  },
  "crp_elev": {
   "type": "match",
   "points": 4,
   "var": "crp",
   "values_fr": [
    "Élevée"
   ],
   "values_en": [
    "Elevated"
   ]
  },
  "vs_elev": {
   "type": "match",
   "points": 5,
   "var": "vs_sed",
   "values_fr": [
    "Modérément élevée (20-50)",
    "Très élevée (>50)"
   ],
   "values_en": [
    "Moderately elevated (20-50)",
    "Very elevated (>50)"
   ]
  },
  "fistules_endo": {
   "type": "bool",
   "points": 5,
   "var": "fistules_endoscopiques"
  },
  "nocturnes": {
   "type": "bool",
   "points": 4,
   "var": "nocturnes"
  },
  "masse_abdominale": {
   "type": "bool",
   "points": 5,
   "var": "masse_abdominale"
  },
  "chirurgie_abdo": {
   "type": "bool",
   "points": 6,
   "var": "chirurgie_abdominale"
  },
  "oedemes": {
   "type": "bool",
   "points": 4,
   "var": "oedemes"
  },
  "tb_neg": {
   "type": "bool",
   "points": -10,
   "var": "tuberculose_ant"
  },
  "famille_neg": {
   "type": "bool",
   "points": -5,
   "var": "famille_mici"
  },
  "sueurs_nocturnes_neg": {
   "type": "bool",
   "points": -5,
   "var": "sueurs_nocturnes"
  },
  "alternance": {
   "type": "not_match",
   "points": 4,
   "var": "alternance",
   "values_fr": [
    "Absente"
   ],
   "values_en": [
    "None"
   ]
  }
 },
 "coeliaque": {
  "ttg_tres_eleve": {
   "type": "match",
   "points": 40,
   "var": "transglutaminase",
   "values_fr": [
    "Élevée (>5x N)"
   ],
   "values_en": [
    "Elevated (>5x ULN)"
   ]
  },
  "ttg_eleve": {
   "type": "match",
   "points": 25,
   "var": "transglutaminase",
   "values_fr": [
    "Élevée (>2x N)"
   ],
   "values_en": [
    "Elevated (>2x ULN)"
   ]
  },
  "endomysium": {
   "type": "bool",
   "points": 20,
   "var": "endomysium"
  },
  "atrophie_villositaire": {
   "type": "bool",
   "points": 35,
   "var": "atrophie_villositaire"
  },
  "diarrhee_chronique": {
   "type": "match",
   "points": 10,
   "var": "diarrhee_type",
   "values_fr": [
    "Chronique (>4 sem)"
   ],
   "values_en": [
    "Chronic (>4 weeks)"
   ]
  },
  "steatorrhee": {
   "type": "bool",
   "points": 8,
   "var": "steatorrhee"
  },
  "amaigrissement": {
   "type": "bool",
   "points": 8,
   "var": "amaigrissement"
  },
  "ballonnements": {
   "type": "bool",
   "points": 5,
   "var": "ballonnements"
  },
  "douleur_epigastre": {
   "type": "match",
   "points": 5,
   "var": "localisation_douleur",
   "values_fr": [
    "Épigastre"
   ],
   "values_en": [
    "Epigastric"
   ]
  },
  "arthralgies": {
   "type": "bool",
   "points": 5,
   "var": "arthralgies"
  },
  "cutanees": {
   "type": "bool",
   "points": 5,
   "var": "cutanees"
  },
  "famille_mici": {
   "type": "bool",
   "points": 5,
   "var": "famille_mici"
  },
  "antecedent_coeliaque": {
   "type": "bool",
   "points": 15,
   "var": "antecedent_coeliaque"
  },
  "retard_croissance": {
   "type": "bool",
   "points": 10,
   "var": "retard_croissance"
  },
  "oedemes": {
   "type": "bool",
   "points": 8,
   "var": "oedemes"
  },
  "albumine_basse": {
   "type": "match",
   "points": 8,
   "var": "albumine",
   "values_fr": [
    "Basse"
   ],
   "values_en": [
    "Low"
   ]
  },
  "anemie": {
   "type": "bool",
   "points": 6,
   "var": "anemie"
  },
  "gb_leuco": {
   "type": "match",
   "points": 5,
   "var": "gb_leucocytes",
   "values_fr": [
    "Leucopénie (<4 G/L)"
   ],
   "values_en": [
    "Leukopenia (<4 G/L)"
   ]
  },
  "duodenum_loc": {
   "type": "bool",
   "points": 10,
   "var": "duodenum_loc"
  },
  "recto_neg": {
   "type": "match",
   "points": -10,
   "var": "rectorragies_type",
   "values_fr": [
    "Associée à des diarrhées"
   ],
   "values_en": [
    "Associated with diarrhea"
   ]
  },
  "fistules_neg": {
   "type": "bool",
   "points": -15,
   "var": "fistules"
  },
  "ileon_neg": {
   "type": "bool",
   "points": -10,
   "var": "ileon_atteint"
  },
  "rectum_neg": {
   "type": "bool",
   "points": -10,
   "var": "rectum_atteint"
  },
  "radio_neg": {
   "type": "bool",
   "points": -15,
   "var": "radio"
  },
  "quantiferon_neg": {
   "type": "bool",
   "points": -15,
   "var": "quantiferon"
  },
  "bk_neg": {
   "type": "bool",
   "points": -20,
   "var": "bk"
  },
  "anorexie": {
   "type": "bool",
   "points": 3,
   "var": "anorexie"
  },
  "iga_carentielle": {
   "type": "match",
   "points": 5,
   "var": "iga_total",
   "values_fr": [
    "Carentielles"
   ],
   "values_en": [
    "Deficient"
   ]
  }
 }
};
__root.IBD_FORM = [
 {
  "id": "main_information",
  "title": "Patient",
  "fields": [
   {
    "var": "patient_age",
    "kind": "spinbox",
    "label": "Age (years)",
    "min": 0,
    "max": 120,
    "tip": "Patient's age in years (0 to 120)"
   }
  ]
 },
 {
  "id": "medical_history",
  "title": "Medical history",
  "fields": [
   {
    "var": "radio",
    "kind": "checkbutton",
    "label": "Pelvic/abdominal radiotherapy",
    "tip": "MAJOR CRITERION for radiation colitis"
   },
   {
    "var": "tuberculose_ant",
    "kind": "checkbutton",
    "label": "Tuberculosis history/exposure",
    "tip": "MAJOR CRITERION for intestinal tuberculosis"
   },
   {
    "var": "voyage",
    "kind": "checkbutton",
    "label": "Recent travel endemic area",
    "tip": "Travel to an area with infectious risk"
   },
   {
    "var": "tabac",
    "kind": "checkbutton",
    "label": "Active smoking",
    "tip": "RISK FACTOR for Crohn's\nPROTECTIVE FACTOR for UC"
   },
   {
    "var": "ains",
    "kind": "checkbutton",
    "label": "NSAID use",
    "tip": "Non-steroidal anti-inflammatory drugs"
   },
   {
    "var": "antibiotique",
    "kind": "checkbutton",
    "label": "Frequent antibiotics (≥3 courses/year)",
    "tip": "≥3 courses per year"
   },
   {
    "var": "contraceptif",
    "kind": "checkbutton",
    "label": "Oral contraceptives (if female)",
    "tip": "Moderate IBD risk, especially Crohn's in young women"
   },
   {
    "var": "famille_mici",
    "kind": "checkbutton",
    "label": "Family history of IBD",
    "tip": "First-degree family history"
   },
   {
    "var": "chirurgie_abdominale",
    "kind": "checkbutton",
    "label": "Previous abdominal surgery",
    "tip": "Bowel resection, stoma, appendicectomy → Crohn risk/adhesions"
   },
   {
    "var": "immunosuppresseur",
    "kind": "checkbutton",
    "label": "Immunosuppression (steroid/HIV/chemo)",
    "tip": "Major risk of intestinal TB and opportunistic infections"
   },
   {
    "var": "antecedent_coeliaque",
    "kind": "checkbutton",
    "label": "Family history celiac disease",
    "tip": "HLA-DQ2/DQ8 — ×10 risk of celiac disease"
   }
  ]
 },
 {
  "id": "digestive_symptoms",
  "title": "Digestive symptoms",
  "fields": [
   {
    "var": "diarrhee_type",
    "kind": "combobox",
    "label": "Diarrhea type",
    "options": [
     "Acute (<4 weeks)",
     "Chronic (>4 weeks)",
     "Intermittent"
    ],
    "tip": "Acute (<4 weeks) → infectious\nChronic (>4 weeks) → IBD, celiac, tuberculosis"
   },
   {
    "var": "nocturnes",
    "kind": "checkbutton",
    "label": "Nocturnal emissions",
    "tip": "Nocturnal diarrhea = severity sign"
   },
   {
    "var": "rectorragies_type",
    "kind": "combobox",
    "label": "Rectal bleeding",
    "options": [
     "None",
     "Isolated (no diarrhea)",
     "Associated with diarrhea"
    ],
    "tip": "Type of rectal bleeding"
   },
   {
    "var": "glaires",
    "kind": "checkbutton",
    "label": "Mucus in stool",
    "tip": "Common in UC and infectious colitis"
   },
   {
    "var": "syndrome_rectal",
    "kind": "checkbutton",
    "label": "Rectal syndrome",
    "tip": "Tenesmus - suggests UC"
   },
   {
    "var": "localisation_douleur",
    "kind": "combobox",
    "label": "Pain location",
    "options": [
     "Right lower quadrant",
     "Left lower quadrant",
     "Hypogastrium",
     "Diffuse",
     "Pelvic",
     "Epigastric"
    ],
    "tip": "RLQ → Crohn's/TB\nHypogastrium → UC\nPelvic → radiation colitis\nEpigastric → possible celiac"
   },
   {
    "var": "constipation_type",
    "kind": "combobox",
    "label": "Constipation",
    "options": [
     "None",
     "Occasional",
     "Chronic"
    ],
    "tip": "Type of constipation"
   },
   {
    "var": "ballonnements",
    "kind": "checkbutton",
    "label": "Bloating",
    "tip": "Common in celiac disease and indeterminate colitis"
   },
   {
    "var": "alternance",
    "kind": "combobox",
    "label": "Diarrhea/constipation alternation",
    "options": [
     "None",
     "Constipation → Diarrhea",
     "Diarrhea → Constipation"
    ],
    "tip": "Transit alternation → suggests IBS, dolichocolon, indeterminate colitis"
   },
   {
    "var": "fistules",
    "kind": "checkbutton",
    "label": "Anal fistulas",
    "tip": "PATHOGNOMONIC for Crohn's"
   },
   {
    "var": "fissures",
    "kind": "checkbutton",
    "label": "Anal fissures/lesions",
    "tip": "Suggests Crohn's"
   },
   {
    "var": "melena",
    "kind": "checkbutton",
    "label": "Melena (black tarry stool)",
    "tip": "Upper GI or right colon bleeding → tumor, intestinal tuberculosis"
   },
   {
    "var": "steatorrhee",
    "kind": "checkbutton",
    "label": "Steatorrhea (fatty stool)",
    "tip": "Malabsorption → celiac disease, pancreatic insufficiency"
   }
  ]
 },
 {
  "id": "extra_digestive_symptoms",
  "title": "Extra-digestive symptoms",
  "fields": [
   {
    "var": "fievre",
    "kind": "checkbutton",
    "label": "Fever (>38°C)",
    "tip": "Common in tuberculosis and infectious colitis"
   },
   {
    "var": "amaigrissement",
    "kind": "checkbutton",
    "label": "Weight loss (>5%)",
    "tip": "Very common in Crohn's, TB, and celiac disease"
   },
   {
    "var": "anorexie",
    "kind": "checkbutton",
    "label": "Anorexia/loss of appetite",
    "tip": "Tuberculosis, Crohn's, celiac disease — systemic alarm sign"
   },
   {
    "var": "arthralgies",
    "kind": "checkbutton",
    "label": "Arthralgia/arthritis",
    "tip": "IBD, celiac, tuberculosis"
   },
   {
    "var": "cutanees",
    "kind": "checkbutton",
    "label": "Skin manifestations",
    "tip": "Erythema nodosum (Crohn's), pyoderma (UC), dermatitis herpetiformis (celiac)"
   },
   {
    "var": "oculaires",
    "kind": "checkbutton",
    "label": "Ocular manifestations",
    "tip": "Uveitis, episcleritis"
   },
   {
    "var": "aphtes",
    "kind": "checkbutton",
    "label": "Recurrent mouth ulcers",
    "tip": "Suggests Crohn's disease"
   },
   {
    "var": "anemie",
    "kind": "checkbutton",
    "label": "Iron deficiency anemia",
    "tip": "Alarm sign for tumor"
   },
   {
    "var": "masse_abdominale",
    "kind": "checkbutton",
    "label": "Palpable abdominal mass",
    "tip": "Mass felt on examination → tumor"
   },
   {
    "var": "oedemes",
    "kind": "checkbutton",
    "label": "Lower limb edema",
    "tip": "Hypoalbuminemia → severe malabsorption (celiac, advanced Crohn's)"
   },
   {
    "var": "sueurs_nocturnes",
    "kind": "checkbutton",
    "label": "Profuse night sweats",
    "tip": "TB criterion B — major systemic sign"
   },
   {
    "var": "adenopathies",
    "kind": "checkbutton",
    "label": "Lymphadenopathy (palpable/imaging)",
    "tip": "Mesenteric or peripheral → intestinal tuberculosis"
   },
   {
    "var": "retard_croissance",
    "kind": "checkbutton",
    "label": "Growth retardation",
    "tip": "Chronic malabsorption → celiac disease or pediatric Crohn's"
   }
  ]
 },
 {
  "id": "biological_markers",
  "title": "Biological markers",
  "fields": [
   {
    "var": "crp",
    "kind": "combobox",
    "label": "CRP",
    "options": [
     "Normal",
     "Elevated"
    ],
    "tip": "C-reactive protein: normal (<5 mg/L) or elevated"
   },
   {
    "var": "calprotectine",
    "kind": "combobox",
    "label": "Fecal calprotectin",
    "options": [
     "< 50 µg/g",
     "50-250 µg/g",
     "> 250 µg/g"
    ],
    "tip": "<50: normal\n>250: significant inflammation"
   },
   {
    "var": "lactoferritine",
    "kind": "combobox",
    "label": "Fecal lactoferrin",
    "options": [
     "Normal",
     "Elevated"
    ],
    "tip": "Intestinal inflammation marker (neutrophils).\nElevated = active inflammation → IBD, infectious colitis"
   },
   {
    "var": "asca",
    "kind": "checkbutton",
    "label": "ASCA positive",
    "tip": "Anti-Saccharomyces cerevisiae - associated with Crohn's disease"
   },
   {
    "var": "anca",
    "kind": "checkbutton",
    "label": "p-ANCA positive",
    "tip": "Associated with ulcerative colitis"
   },
   {
    "var": "quantiferon",
    "kind": "checkbutton",
    "label": "Quantiferon/TST positive",
    "tip": "Tuberculosis screening test"
   },
   {
    "var": "transglutaminase",
    "kind": "combobox",
    "label": "Anti-tTG IgA",
    "options": [
     "Normal",
     "Elevated (>2x ULN)",
     "Elevated (>5x ULN)"
    ],
    "tip": "Main serological marker for celiac disease. >5x ULN = highly specific."
   },
   {
    "var": "endomysium",
    "kind": "checkbutton",
    "label": "Anti-EMA IgA positive",
    "tip": "Highly specific serological marker (>95%) for celiac disease."
   },
   {
    "var": "albumine",
    "kind": "combobox",
    "label": "Albumin",
    "options": [
     "Normal",
     "Low"
    ],
    "tip": "Low albumin = malnutrition/chronic inflammation"
   },
   {
    "var": "iga_total",
    "kind": "combobox",
    "label": "Total IgA",
    "options": [
     "Normal",
     "Deficient"
    ],
    "tip": "IgA deficiency → false negatives for anti-tTG and anti-EMA"
   },
   {
    "var": "vs_sed",
    "kind": "combobox",
    "label": "ESR — Erythrocyte sedimentation rate",
    "options": [
     "Normal (<20 mm/h)",
     "Moderately elevated (20-50)",
     "Very elevated (>50)"
    ],
    "tip": "Very elevated (>50) → TB, lymphoma\nModerate → active IBD"
   },
   {
    "var": "gb_leucocytes",
    "kind": "combobox",
    "label": "White blood cells (CBC)",
    "options": [
     "Normal",
     "Leukocytosis (>12 G/L)",
     "Leukopenia (<4 G/L)"
    ],
    "tip": "Leukocytosis → infection, Crohn abscess\nLeukopenia → HIV, severe celiac"
   }
  ]
 },
 {
  "id": "microbiology",
  "title": "Microbiology",
  "fields": [
   {
    "var": "cdiff",
    "kind": "checkbutton",
    "label": "C. difficile",
    "tip": "Positive C. difficile toxins"
   },
   {
    "var": "salmonella",
    "kind": "checkbutton",
    "label": "Salmonella/Shigella",
    "tip": "Bacteria causing infectious colitis"
   },
   {
    "var": "campylobacter",
    "kind": "checkbutton",
    "label": "Campylobacter",
    "tip": "Common cause of infectious colitis"
   },
   {
    "var": "ecoli",
    "kind": "checkbutton",
    "label": "Pathogenic E. coli",
    "tip": "Enteropathogenic Escherichia coli"
   },
   {
    "var": "parasites",
    "kind": "checkbutton",
    "label": "Parasites",
    "tip": "Giardia, amoeba, etc."
   },
   {
    "var": "bk",
    "kind": "checkbutton",
    "label": "AFB (stool/biopsy)",
    "tip": "Positive acid-fast bacilli = tuberculosis"
   }
  ]
 },
 {
  "id": "endoscopy",
  "title": "Endoscopic findings",
  "fields": [
   {
    "var": "distribution",
    "kind": "combobox",
    "label": "Distribution",
    "options": [
     "Continuous",
     "Discontinuous"
    ],
    "tip": "Continuous → UC\nDiscontinuous → Crohn's"
   },
   {
    "var": "rectum_atteint",
    "kind": "checkbutton",
    "label": "Rectal involvement",
    "tip": "Almost constant in UC"
   },
   {
    "var": "ileon_atteint",
    "kind": "checkbutton",
    "label": "Ileal involvement",
    "tip": "Suggests Crohn's"
   },
   {
    "var": "ileocaecal",
    "kind": "checkbutton",
    "label": "Ileocecal involvement",
    "tip": "Suggests tuberculosis"
   },
   {
    "var": "ulcerations",
    "kind": "combobox",
    "label": "Ulceration type",
    "options": [
     "Superficial",
     "Deep",
     "Aphthous"
    ],
    "tip": "Superficial → UC\nDeep/aphthous → Crohn's"
   },
   {
    "var": "fistules_endoscopiques",
    "kind": "checkbutton",
    "label": "Fistulas",
    "tip": "PATHOGNOMONIC for Crohn's"
   },
   {
    "var": "stenoses",
    "kind": "checkbutton",
    "label": "Stenosis",
    "tip": "Crohn's, TB, radiation colitis"
   },
   {
    "var": "pseudopolypes",
    "kind": "checkbutton",
    "label": "Pseudopolyps",
    "tip": "Suggests chronic UC"
   },
   {
    "var": "telangiectasies",
    "kind": "checkbutton",
    "label": "Telangiectasias",
    "tip": "PATHOGNOMONIC for radiation colitis"
   },
   {
    "var": "paves",
    "kind": "checkbutton",
    "label": "Cobblestone",
    "tip": "Suggests Crohn's"
   },
   {
    "var": "atrophie_villositaire",
    "kind": "checkbutton",
    "label": "Villous atrophy (duodenal biopsy)",
    "tip": "MAJOR HISTOLOGICAL CRITERION - Villous atrophy with crypt hyperplasia (celiac disease)."
   },
   {
    "var": "diverticules",
    "kind": "checkbutton",
    "label": "Diverticula",
    "tip": "Presence of diverticula on colonoscopy"
   },
   {
    "var": "hemorroides_endoscopiques",
    "kind": "checkbutton",
    "label": "Hemorrhoids",
    "tip": "Presence of hemorrhoids on endoscopy"
   },
   {
    "var": "tumeur_polype",
    "kind": "checkbutton",
    "label": "Tumor/Polyp",
    "tip": "Presence of tumor or polyp"
   },
   {
    "var": "dolichocolon",
    "kind": "checkbutton",
    "label": "Dolichocolon (colon elongation)",
    "tip": "Radiological or endoscopic diagnosis"
   }
  ]
 },
 {
  "id": "endoscopy_location",
  "title": "Lesion location",
  "fields": [
   {
    "var": "rectum_loc",
    "kind": "checkbutton",
    "label": "Rectum",
    "tip": "Rectal involvement → UC"
   },
   {
    "var": "colon_loc",
    "kind": "checkbutton",
    "label": "Colon",
    "tip": "Colonic involvement → UC, colonic Crohn's, infectious"
   },
   {
    "var": "ileon_loc",
    "kind": "checkbutton",
    "label": "Ileum",
    "tip": "Ileal involvement → Crohn's"
   },
   {
    "var": "ileocaecal_loc",
    "kind": "checkbutton",
    "label": "Ileocecal region",
    "tip": "Predominant ileocecal involvement → TB"
   },
   {
    "var": "pelvien_loc",
    "kind": "checkbutton",
    "label": "Pelvic area",
    "tip": "Irradiated area → radiation colitis"
   },
   {
    "var": "duodenum_loc",
    "kind": "checkbutton",
    "label": "Duodenum",
    "tip": "Duodenal involvement → suggests celiac disease"
   }
  ]
 },
 {
  "id": "serology",
  "title": "Serology",
  "fields": [
   {
    "var": "vhc",
    "kind": "checkbutton",
    "label": "HCV (Hepatitis C)",
    "tip": "Hepatitis C — may mimic colitis or worsen IBD"
   },
   {
    "var": "vih_sero",
    "kind": "checkbutton",
    "label": "HIV (serology)",
    "tip": "Immunosuppression → risk of TB and opportunistic infections"
   },
   {
    "var": "cmv_sero",
    "kind": "checkbutton",
    "label": "CMV (serology IgM/IgG)",
    "tip": "Active CMV infection → CMV colitis, IBD flare"
   }
  ]
 }
];
if (typeof module !== "undefined") module.exports = { IBD_RULES: __root.IBD_RULES, IBD_FORM: __root.IBD_FORM };
