function normalizePuertasValue(value) {
  if (!value) return "";

  const v = value
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

  const map = {
    "modelo 1": "modelo_1",
    "modelo 1 vr": "modelo_1_vr",
    "modelo 2": "modelo_2",
    "modelo 3": "modelo_3",
    "modelo 3 vr": "modelo_3_vr",
    "modelo 3vr": "modelo_3_vr",
    "modelo 4": "modelo_4",
    "modelo 4 vr": "modelo_4_vr",
    "modelo 5": "modelo_5",
    "modelo 6": "modelo_6",
    "modelo 7": "modelo_7",
    "modelo 8": "modelo_8",
    "modelo 9": "modelo_9",
    "modelo 10": "modelo_10",
    "modelo 10 vr": "modelo_10_vr",
    "modelo 11": "modelo_11",
    "modelo 12": "modelo_12",
    "modelo panel": "modelo_panel",
    "modelo c/panel": "modelo_panel",

    "v/entero": "v_entero",
    "v/repartido": "v_repartido",
    "3/4 v entero": "3_4_v_entero",
    "3/4 v repartido": "3_4_v_repartido",
    "1/2 v entero": "1_2_v_entero",
    "1/2 v repartido": "1_2_v_repartido",
    "4 travezanos": "4_travesanos",
    "4 travesanos": "4_travesanos",
    "4 travezaños": "4_travesanos",
    "1 travesaño": "1_travesano",

    "dvh 4+9+4": "dvh_4_9_4",
    "dvh 5+9+5": "dvh_5_9_5",
  };

  return map[v] || v.replaceAll(" ", "_");
}

module.exports = {
  normalizePuertasValue,
};
