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

const concat = {
    "en": (first, family) => first + " " + family,
    "en_reverse": (first, family) => family + ", " + first,
    "jp": (first, family) => family + first,
};

const name_fmt = {
    "initial_en": {
        "first_initial": true,
        "family_initial": false,
        "concat": concat.en,
    },
    "full_en": {
        "first_initial": false,
        "family_initial": false,
        "concat": concat.en,
    },
    "jp": {
        "first_initial": false,
        "family_initial": false,
        "concat": concat.jp,
    }
}

const format_name = (name, fmt) => {
    const first = fmt.first_initial ? name.first[0] + "." : name.first;
    const family = fmt.family_initial ? name.family[0] + "." : name.family;
    return fmt.concat(first, family);
};

const sep = {
    "en": {
        "comma": ", ",
        "and2": " and ",
        "and": "and ",
        "etal": "et al., ",
    },
    "jp": {
        "comma": "，",
        "and2": "，",
        "and": "",
        "etal": "et al.，",
    }
};

const format_name_list = (name_list, sep, fmt, max_name) => {
    const fmt_name = name_list.map((a) => format_name(a, fmt));
    if (fmt_name.length === 1) {
        return fmt_name[0] + sep.comma;
    }
    else if (fmt_name.length === 2) {
        return `${fmt_name[0]}${sep.and2}${fmt_name[1]}${sep.comma}`;
    }
    else if (fmt_name.length >= max_name) {
        return `${fmt_name[0]} ${sep.etal}`;
    }
    else {
        const last = fmt_name.length - 1;
        fmt_name[last] = sep.and + fmt_name[last];
        return fmt_name.join(sep.comma) + sep.comma;
    }
};

const format_title = {
    "asis": (t) => t.replace(/[\{\}]/g, ""),
    "upper": (t) => t.replace(/[\{\}]/g, "").toUpperCase(),
    "lower": (t) => (
        t.replace(/^[^\{]*/, (m) => m.toLowerCase())
         .replace(/[^\}]*$/, (m) => m.toLowerCase())
         .replace(/\}[^\{\}]*\{/g, (m) => m.toLowerCase())
         .replace(/[\{\}]/g, "")
         .replace(/^./, (m) => m.toUpperCase())
    ),
    "bibtex": (t) => t,
};

// IPSJ https://www.ipsj.or.jp/journal/submit/ronbun_j_prms.html
// IEICE https://www.ieice.org/jpn/shiori/iss_2.html#2.6
// IEEE https://pitt.libguides.com/citationhelp/ieee

const formats = {
    "journal_full": {
        "en": [
            { "param": "authors", "func": (a) => format_name_list(a, sep.en, name_fmt.full_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t)}," ` },
            { "param": "journal", "func": (j) => `<i>${j.full}</i>, ` },
            { "param": "vol", "func": (v) => `vol.${v}, ` },
            { "param": "num", "func": (n) => `no.${n}, ` },
            { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp": [
            { "param": "authors", "func": (a) => format_name_list(a.jp, sep.jp, name_fmt.jp) },
            { "param": "title", "func": (t) => `"${t.jp}," ` },
            { "param": "journal", "func": (j) => `${j.jp.full}，` },
            { "param": "vol", "func": (v) => `vol.${v}，` },
            { "param": "num", "func": (n) => `no.${n}，` },
            { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}，` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp2en": [
            { "param": "", "func": (_) => "[<strong>In Japanese</strong>] " },
            { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_fmt.full_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t.en)}," ` },
            { "param": "journal", "func": (j) => `<i>${j.en.full}</i>, ` },
            { "param": "vol", "func": (v) => `vol.${v}, ` },
            { "param": "num", "func": (n) => `no.${n}, ` },
            { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
    },
    "journal_short": {
        "en": [
            { "param": "authors", "func": (a) => format_name_list(a, sep.en, name_fmt.initial_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t)}," ` },
            { "param": "journal", "func": (j) => `<i>${j.abbrv}</i>, ` },
            { "param": "vol", "func": (v) => `vol.${v}, ` },
            { "param": "num", "func": (n) => `no.${n}, ` },
            { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp": [
            { "param": "authors", "func": (a) => format_name_list(a.jp, sep.jp, name_fmt.jp) },
            { "param": "title", "func": (t) => `"${t.jp}," ` },
            { "param": "journal", "func": (j) => `${j.jp.abbrv}，` },
            { "param": "vol", "func": (v) => `vol.${v}，` },
            { "param": "num", "func": (n) => `no.${n}，` },
            { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}，` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp2en": [
            { "param": "", "func": (_) => "[<strong>In Japanese</strong>] " },
            { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_fmt.initial_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t.en)}," ` },
            { "param": "journal", "func": (j) => `<i>${j.en.abbrv}</i>, ` },
            { "param": "vol", "func": (v) => `vol.${v}, ` },
            { "param": "num", "func": (n) => `no.${n}, ` },
            { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
    },
    "int_conf_full": [
        { "param": "authors", "func": (a) => format_name_list(a, sep.en, name_fmt.full_en) },
        { "param": "title", "func": (t) => `"${format_title.lower(t)}," ` },
        { "param": "conference", "func": (j) => `in <i>Proc. ${j.full} (${j.abbrv})</i>, ` },
        { "param": "city", "func": (c) => `${c}, ` },
        { "param": "country", "func": (c) => `${c}, ` },
        { "param": "month", "func": (m) => month.abbrv3[m] + " " },
        { "param": "year", "func": (y) => String(y) },
    ],
    "int_conf_short": [
        { "param": "authors", "func": (a) => format_name_list(a, sep.en, name_fmt.initial_en) },
        { "param": "title", "func": (t) => `"${format_title.lower(t)}," ` },
        { "param": "conference", "func": (j) => `<i>${j.abbrv}</i>, ` },
        { "param": "city", "func": (c) => `${c}, ` },
        { "param": "country", "func": (c) => `${c}, ` },
        { "param": "month", "func": (m) => month.abbrv3[m] + " " },
        { "param": "year", "func": (y) => String(y) },
    ],
    "dom_reports_full": {
        "en": [
            { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_fmt.full_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t.en)}," ` },
            { "param": "workgroup", "func": (g) => `<i>${g.en.full}</i>, ` },
            { "param": "index", "func": (i) => `${i}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp": [
            { "param": "authors", "func": (a) => format_name_list(a.jp, sep.jp, name_fmt.jp) },
            { "param": "title", "func": (t) => `"${t.jp}," ` },
            { "param": "workgroup", "func": (g) => `${g.jp.full}，` },
            { "param": "index", "func": (i) => `${i}，` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp2en": [
            { "param": "", "func": (_) => "[<strong>In Japanese</strong>] " },
            { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_fmt.full_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t.en)}," ` },
            { "param": "workgroup", "func": (g) => `<i>${g.en.full}</i>, ` },
            { "param": "index", "func": (i) => `${i}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
    },
    "dom_reports_short": {
        "en": [
            { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_fmt.initial_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t.en)}," ` },
            { "param": "workgroup", "func": (j) => `<i>${j.en.abbrv}</i>, ` },
            { "param": "index", "func": (n) => `${n}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp": [
            { "param": "authors", "func": (a) => format_name_list(a.jp, sep.jp, name_fmt.jp) },
            { "param": "title", "func": (t) => `"${t.jp}," ` },
            { "param": "workgroup", "func": (j) => `${j.jp.abbrv}，` },
            { "param": "index", "func": (n) => `${n}，` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
        "jp2en": [
            { "param": "", "func": (_) => "[<strong>In Japanese</strong>] " },
            { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_fmt.initial_en) },
            { "param": "title", "func": (t) => `"${format_title.lower(t.en)}," ` },
            { "param": "workgroup", "func": (j) => `<i>${j.en.abbrv}</i>, ` },
            { "param": "index", "func": (n) => `${n}, ` },
            { "param": "month", "func": (m) => month.abbrv3[m] + " " },
            { "param": "year", "func": (y) => String(y) },
        ],
    },
    "awards": {
        "en": [
            { "param": "en", "func": (d) => d },
        ],
        "jp": [
            { "param": "jp", "func": (d) => d },
        ]
    },
    "grants": {
        "en": [
            { "param": "en", "func": (d) => d },
        ],
        "jp": [
            { "param": "jp", "func": (d) => d },
        ]
    },
};

const format = (doc, fmt) => {
    return fmt.map((f) => f.func(doc[f.param])).join("");
};

const create_list = (div_id, docs, fmt) => {
    const div = document.getElementById(div_id);
    if (div === null) {
        return;
    }
    const ol = document.createElement('ol');
    docs.forEach((doc) => {
        const text = format(doc, fmt(doc));
        const li = document.createElement('li');
        li.innerHTML = text;
        ol.appendChild(li);
    });
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    div.appendChild(ol);
};

const categories = ["journals", "int_conf", "dom_reports", "awards", "grants"];

const div_ids = {
    "journals": "div_journals",
    "int_conf": "div_int_conferences",
    "dom_reports": "div_dom_tech_reports",
    "awards": "div_awards",
    "grants": "div_grants",
};

const publish_data = {
    "journals": {{ pub.journals | jsonify }},
    "int_conf": {{ pub.int-conferences | jsonify }},
    "dom_reports": {{ pub.dom-tech-reports | jsonify }},
    "awards": {{ pub.awards | jsonify }},
    "grants": {{ pub.grants | jsonify }},
};

const create_list_all = (fmt) => {
    categories.forEach(
        (cat) => { create_list(div_ids[cat], publish_data[cat], fmt[cat]); }
    );
};

const list_publish = {
    "full": {
        "en": (() => {
            create_list_all({
                "journals": (doc) => formats.journal_full[doc.lang === "en" ? "en" : "jp2en"],
                "int_conf": (doc) => formats.int_conf_full,
                "dom_reports": (doc) => formats.dom_reports_full[doc.lang === "en" ? "en" : "jp2en"],
                "awards": (doc) => formats.awards.en,
                "grants": (doc) => formats.grants.en,
            });
        }),
        "jp": (() => {
            create_list_all({
                "journals": (doc) => formats.journal_full[doc.lang],
                "int_conf": (doc) => formats.int_conf_full,
                "dom_reports": (doc) => formats.dom_reports_full[doc.lang],
                "awards": (doc) => formats.awards[doc.lang],
                "grants": (doc) => formats.grants[doc.lang],
            });
        }),
    },

    "short": {
        "en": (() => {
            create_list_all({
                "journals": (doc) => formats.journal_short[doc.lang === "en" ? "en" : "jp2en"],
                "int_conf": (doc) => formats.int_conf_short,
                "dom_reports": (doc) => formats.dom_reports_short[doc.lang === "en" ? "en" : "jp2en"],
                "awards": (doc) => formats.awards.en,
                "grants": (doc) => formats.grants.en,
            });
        }),
        "jp": (() => {
            create_list_all({
                "journals": (doc) => formats.journal_short[doc.lang],
                "int_conf": (doc) => formats.int_conf_short,
                "dom_reports": (doc) => formats.dom_reports_short[doc.lang],
                "awards": (doc) => formats.awards[doc.lang],
                "grants": (doc) => formats.grants[doc.lang],
            });
        }),
    },

    "bibtex": {
        "en": (() => {
            create_list_all({
                "journals": (doc) => formats.journal_bibtex[doc.lang === "en" ? "en" : "jp2en"],
                "int_conf": (doc) => formats.int_conf_bibtex,
                "dom_reports": (doc) => formats.dom_reports_bibtex[doc.lang === "en" ? "en" : "jp2en"],
                "awards": (doc) => formats.awards.en,
                "grants": (doc) => formats.grants.en,
            });
        }),
        "jp": (() => {
            create_list_all({
                "journals": (doc) => formats.journal_bibtex[doc.lang],
                "int_conf": (doc) => formats.int_conf_bibtex,
                "dom_reports": (doc) => formats.dom_reports_bibtex[doc.lang],
                "awards": (doc) => formats.awards[doc.lang],
                "grants": (doc) => formats.grants[doc.lang],
            });
        }),
    },
};

const select_format = {
    "full": () => {
        window.list_publish = {
            "en": list_publish.full.en,
            "jp": list_publish.full.jp,
        };
    },
    "short": () => {
        window.list_publish = {
            "en": list_publish.short.en,
            "jp": list_publish.short.jp,
        };
    },
    "bibtex": () => {
        window.list_publish = {
            "en": list_publish.bibtex.en,
            "jp": list_publish.bibtex.jp,
        };
    },
};

// select format
const btn_fmt = document.getElementsByClassName("format_btn");
Array.from(btn_fmt).forEach((btn) => {
    btn.addEventListener("click", () => {
        select_format[btn.value]();
        window.list_publish[window.lang]();
    });
});

// default
select_format.full();
