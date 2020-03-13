---
---
{% assign pub = site.data.publications %}

const month = {
    "full": {
        1: "January", 2: "February", 3: "March", 4: "April",
        5: "May", 6: "June", 7: "July", 8: "August",
        9: "September", 10: "October", 11: "November", 12: "December",
    },
    "abbrv3": {
        1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.",
        5: "May", 6: "Jun.", 7: "Jul.", 8: "Aug.",
        9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec.",
    },
    "abbrv4": {
        1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.",
        5: "May", 6: "June", 7: "July", 8: "Aug.",
        9: "Sept.", 10: "Oct.", 11: "Nov.", 12: "Dec.",
    },
};

const format_name = (name, is_fisrt_initial, is_family_initial, concat) => {
    const first = is_fisrt_initial ? name.first[0] : name.first;
    const family = is_family_initial ? name.family[0] : name.family;
    return concat(first, family);
}

const format_name_list = (name_list, lang, max_name) => {
    const sep = {
        "en": {
            "comma": ", ",
            "and": "and ",
            "etal": "et al., ",
        },
        "jp": {
            "comma": "，",
            "and": "",
            "etal": "et al.，",
        }
    }[lang];
    const concat = {
        "en": (first, family) => first + " " + family,
        "jp": (first, family) => family + first,
    }[lang];
    const fmt_name = name_list.map((a) => format_name(a, false, false, concat));
    if (fmt_name.length === 1) {
        return fmt_name[0] + sep.comma;
    }
    else if (fmt_name.length === 2) {
        return `${fmt_name[0]} ${sep.and}${fmt_name[1]}${sep.comma}`;
    }
    else if (fmt_name.length >= max_name) {
        return `${fmt_name[0]} ${sep.etal}`;
    }
    else {
        const last = fmt_name.length - 1;
        fmt_name[last] = sep.and + fmt_name[last];
        return fmt_name.join(sep.comma) + sep.comma;
    }
}

const formats = {
    "journal_full_en": [
        { "param": "authors", "func": (a) => format_name_list(a, "en") },
        { "param": "title", "func": (t) => `"${t.lower}," ` },
        { "param": "journal", "func": (j) => `${j.full}, ` },
        { "param": "vol", "func": (v) => `vol.${v}, ` },
        { "param": "num", "func": (n) => `no.${n}, ` },
        { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}, `},
        { "param": "month", "func": (m) => month.abbrv3[m] + " " },
        { "param": "year", "func": (y) => String(y) },
    ],
    "journal_full_jp": [
        { "param": "authors", "func": (a) => format_name_list(a, "jp") },
        { "param": "title", "func": (t) => `"${t}," ` },
        { "param": "journal", "func": (j) => `${j.full}，` },
        { "param": "vol", "func": (v) => `vol.${v}，` },
        { "param": "num", "func": (n) => `no.${n}，` },
        { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}，`},
        { "param": "month", "func": (m) => month.abbrv3[m] + " " },
        { "param": "year", "func": (y) => String(y) },
    ],
}

const format = (doc, fmt) => {
    return fmt.map((f) => f.func(doc[f.param])).join("");
};

// journal
(() => {
    const jrnl = JSON.parse('{{ pub.journals | jsonify }}');
    const ol = document.createElement('ol');
    jrnl.forEach((doc) => {
        fmt = doc.lang === "en" ? formats.journal_full_en : formats.journal_full_jp;
        const text = format(doc, fmt);
        const li = document.createElement('li');
        li.innerHTML = text;
        ol.appendChild(li);
    });
    const div_jrnl = document.getElementById('div_journal');
    div_jrnl.appendChild(ol);
})();

