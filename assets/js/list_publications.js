---
---
{% assign pub = site.data.publications %}

const month = {
    "full": {
        0: "",
        1: "January", 2: "February", 3: "March", 4: "April",
        5: "May", 6: "June", 7: "July", 8: "August",
        9: "September", 10: "October", 11: "November", 12: "December",
    },
    "abbrv3": {
        0: "",
        1: "Jan.", 2: "Feb.", 3: "Mar.", 4: "Apr.",
        5: "May", 6: "Jun.", 7: "Jul.", 8: "Aug.",
        9: "Sep.", 10: "Oct.", 11: "Nov.", 12: "Dec.",
    },
    "abbrv4": {
        0: "",
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

const name_style = {
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

const format_name = (name, style) => {
    const first = style.first_initial ? name.first[0] + "." : name.first;
    const family = style.family_initial ? name.family[0] + "." : name.family;
    return style.concat(first, family);
};

const sep = {
    "en": {
        "comma_wo_space": ",",
        "comma": ", ",
        "and2": " and ",
        "and": "and ",
        "etal": "et al., ",
        "period": ".",
        "lquo": "&ldquo;",
        "rquo": "&rdquo;",
    },
    "jp": {
        "comma": "，",
        "and2": "，",
        "and": "",
        "etal": "et al.，",
        "period": "．",
        "lquo": "&ldquo;",
        "rquo": "&rdquo;",
    }
};

const format_name_list = (name_list, sep, style, max_name) => {
    const style_name = name_list.map((a) => format_name(a, style));
    if (style_name.length === 1) {
        return style_name[0] + sep.comma;
    }
    else if (style_name.length === 2) {
        return `${style_name[0]}${sep.and2}${style_name[1]}${sep.comma}`;
    }
    else if (style_name.length >= max_name) {
        return `${style_name[0]} ${sep.etal}`;
    }
    else {
        const last = style_name.length - 1;
        style_name[last] = sep.and + style_name[last];
        return style_name.join(sep.comma) + sep.comma;
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
};

// IPSJ https://www.ipsj.or.jp/journal/submit/ronbun_j_prms.html
// IEICE https://www.ieice.org/jpn/shiori/iss_2.html#2.6
// IEEE https://pitt.libguides.com/citationhelp/ieee



const style_dicts = {
    "en": {
        "prefix_injp": { "param": "", "func": (_) => "[<strong>In Japanese</strong>] " },
        "authors": { "param": "authors", "func": (a) => format_name_list(a, sep.en, name_style.full_en) },
        "authors_jp2en": { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_style.full_en) },
        "authors_short": { "param": "authors", "func": (a) => format_name_list(a, sep.en, name_style.initial_en) },
        "authors_jp2en_short": { "param": "authors", "func": (a) => format_name_list(a.en, sep.en, name_style.initial_en) },
        "title": { "param": "title", "func": (t) => `${sep.en.lquo}${format_title.lower(t)}${sep.en.comma_wo_space}${sep.en.rquo} ` },
        "title_jp2en": { "param": "title", "func": (t) => `${sep.en.lquo}${format_title.lower(t.en)}${sep.en.comma_wo_space}${sep.en.rquo} ` },
        "journal": { "param": "journal", "func": (j) => `<i>${j.full}</i>${sep.en.comma}` },
        "journal_jp2en": { "param": "journal", "func": (j) => `<i>${j.en.full}</i>${sep.en.comma}` },
        "journal_short": { "param": "journal", "func": (j) => `<i>${j.abbrv}</i>${sep.en.comma}` },
        "journal_jp2en_short": { "param": "journal", "func": (j) => `<i>${j.en.abbrv}</i>${sep.en.comma}` },
        "vol": { "param": "vol", "func": (v) => `vol.${v}${sep.en.comma}` },
        "num": { "param": "num", "func": (n) => `no.${n}${sep.en.comma}` },
        "pages": { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}${sep.en.comma}` },
        "conference": { "param": "conference", "func": (j) => `in <i>Proc. ${j.full} (${j.abbrv})</i>${sep.en.comma}` },
        "conference_short": { "param": "conference", "func": (j) => `<i>${j.abbrv}</i>${sep.en.comma}` },
        "notes": { "param": "notes", "func": (n) => `<i>${n.en.full}</i>${sep.en.comma}` },
        "notes_short": { "param": "notes", "func": (n) => `<i>${n.en.abbrv}</i>${sep.en.comma}` },
        "city": { "param": "city", "func": (c) => `${c}${sep.en.comma}` },
        "city_en": { "param": "city", "func": (c) => `${c.en}${sep.en.comma}` },
        "country": { "param": "country", "func": (c) => `${c}${sep.en.comma}` },
        "month": { "param": "month", "func": (m) => month.abbrv3[m] + " " },
        "year": { "param": "year", "func": (y) => String(y) + sep.en.period },
        "other": { "param": "en", "func": (d) => d },
    },
    "jp": {
        "authors": { "param": "authors", "func": (a) => format_name_list(a.jp, sep.jp, name_style.jp) },
        "title": { "param": "title", "func": (t) => `${sep.jp.lquo}${t.jp}${sep.jp.comma}${sep.jp.rquo} ` },
        "journal": { "param": "journal", "func": (j) => `${j.jp.full}${sep.jp.comma}` },
        "journal_short": { "param": "journal", "func": (j) => `${j.jp.abbrv}${sep.jp.comma}` },
        "vol": { "param": "vol", "func": (v) => `vol.${v}${sep.jp.comma}` },
        "num": { "param": "num", "func": (n) => `no.${n}${sep.jp.comma}` },
        "pages": { "param": "pages", "func": (p) => `pp.${p.from}-${p.to}${sep.jp.comma}` },
        "notes": { "param": "notes", "func": (n) => `${n.jp.full}${sep.jp.comma}` },
        "notes_short": { "param": "notes", "func": (n) => `${n.jp.abbrv}${sep.jp.comma}` },
        "city": { "param": "city", "func": (c) => `${c}${sep.jp.comma}` },
        "city_jp": { "param": "city", "func": (c) => `${c.jp}${sep.jp.comma}` },
        "month": { "param": "month", "func": (m) => month.abbrv3[m] + " " },
        "year": { "param": "year", "func": (y) => String(y) + sep.jp.period },
        "other": { "param": "jp", "func": (d) => d },
    }
};

const styles = {
    "journal_full": {
        "en": [
            style_dicts.en.authors,
            style_dicts.en.title,
            style_dicts.en.journal,
            style_dicts.en.vol,
            style_dicts.en.num,
            style_dicts.en.pages,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
        "jp": [
            style_dicts.jp.authors,
            style_dicts.jp.title,
            style_dicts.jp.journal,
            style_dicts.jp.vol,
            style_dicts.jp.num,
            style_dicts.jp.pages,
            style_dicts.jp.month,
            style_dicts.jp.year,
        ],
        "jp2en": [
            style_dicts.en.prefix_injp,
            style_dicts.en.authors_jp2en,
            style_dicts.en.title_jp2en,
            style_dicts.en.journal_jp2en,
            style_dicts.en.vol,
            style_dicts.en.num,
            style_dicts.en.pages,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
    },
    "journal_short": {
        "en": [
            style_dicts.en.authors_short,
            style_dicts.en.title,
            style_dicts.en.journal_short,
            style_dicts.en.vol,
            style_dicts.en.num,
            style_dicts.en.pages,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
        "jp": [
            style_dicts.jp.authors,
            style_dicts.jp.title,
            style_dicts.jp.journal_short,
            style_dicts.jp.vol,
            style_dicts.jp.num,
            style_dicts.jp.pages,
            style_dicts.jp.month,
            style_dicts.jp.year,
        ],
        "jp2en": [
            style_dicts.en.prefix_injp,
            style_dicts.en.authors_jp2en_short,
            style_dicts.en.title_jp2en,
            style_dicts.en.journal_jp2en_short,
            style_dicts.en.vol,
            style_dicts.en.num,
            style_dicts.en.pages,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
    },
    "int_conf_full": [
        style_dicts.en.authors,
        style_dicts.en.title,
        style_dicts.en.conference,
        style_dicts.en.city,
        style_dicts.en.country,
        style_dicts.en.month,
        style_dicts.en.year,
    ],
    "int_conf_short": [
        style_dicts.en.authors_short,
        style_dicts.en.title,
        style_dicts.en.conference_short,
        style_dicts.en.city,
        style_dicts.en.country,
        style_dicts.en.month,
        style_dicts.en.year,
    ],
    "dom_reports_full": {
        "en": [
            style_dicts.en.authors_jp2en,
            style_dicts.en.title_jp2en,
            style_dicts.en.notes,
            style_dicts.en.city_en,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
        "jp": [
            style_dicts.jp.authors,
            style_dicts.jp.title,
            style_dicts.jp.notes,
            style_dicts.jp.city_jp,
            style_dicts.jp.month,
            style_dicts.jp.year,
        ],
        "jp2en": [
            style_dicts.en.prefix_injp,
            style_dicts.en.authors_jp2en,
            style_dicts.en.title_jp2en,
            style_dicts.en.notes,
            style_dicts.en.city_en,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
    },
    "dom_reports_short": {
        "en": [
            style_dicts.en.authors_jp2en_short,
            style_dicts.en.title_jp2en,
            style_dicts.en.notes_short,
            style_dicts.en.city_en,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
        "jp": [
            style_dicts.jp.authors,
            style_dicts.jp.title,
            style_dicts.jp.notes_short,
            style_dicts.jp.city_jp,
            style_dicts.jp.month,
            style_dicts.jp.year,
        ],
        "jp2en": [
            style_dicts.en.prefix_injp,
            style_dicts.en.authors_jp2en_short,
            style_dicts.en.title_jp2en,
            style_dicts.en.notes_short,
            style_dicts.en.city_en,
            style_dicts.en.month,
            style_dicts.en.year,
        ],
    },
    "awards": {
        "en": [
            style_dicts.en.other,
        ],
        "jp": [
            style_dicts.jp.other,
        ]
    },
    "grants": {
        "en": [
            style_dicts.en.other,
        ],
        "jp": [
            style_dicts.jp.other,
        ]
    },
};

const format = (doc, style) => {
    const text = style.map((f) => {
        if (f.param === "") {
            return f.func(null);
        }
        else if (doc[f.param] === undefined) {
            return "";
        }
        else {
            return f.func(doc[f.param]);
        }
    }).join("");
    const doi = doc["doi"] ? doc["doi"] : null;
    return {
        text: text,
        doi: doi,
    };
};

const create_list = (div_id, summary_text, docs, settings, visible, lang) => {
    const div = document.getElementById(div_id);
    if (div === null) {
        return;
    }

    // clear elements
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }

    const details = document.createElement('details');
    details.open = visible;
    const summary = document.createElement('summary');
    summary.className = 'doc-category';
    summary.innerHTML = summary_text;
    details.appendChild(summary);

    const ol = document.createElement('ol');
    const doc_slice = settings.descending ? docs.slice() : docs.slice().reverse();
    doc_slice.forEach((doc) => {
        if (doc.title === undefined || doc.title === "") return;
        if (doc.title !== undefined && doc.title[lang] === "") return;
        const item = format(doc, settings.style(doc));

        const li = document.createElement('li');
        li.innerHTML = item.text;

        if (item.doi !== null) {
            const link = document.createElement('a');
            link.setAttribute("href", item.doi);
            link.setAttribute("target", "_blank");
            const icon = document.createElement('img');
            icon.setAttribute("src", "assets/images/link.svg")
            icon.setAttribute("id", "linkicon");
            link.appendChild(icon);
            li.appendChild(link);
        }

        ol.appendChild(li);
    });
    details.appendChild(ol);
    div.appendChild(details);
};

const categories = ["journals", "int_conf", "dom_reports", "awards", "grants"];

const div_ids = {
    "journals": "div_journals",
    "int_conf": "div_int_conferences",
    "dom_reports": "div_dom_tech_reports",
    "awards": "div_awards",
    "grants": "div_grants",
};

const categories_text = {
    "journals": "Journal papers",
    "int_conf": "International conferences",
    // "dom_reports": "Technical reports &amp; Symposiums",
    "dom_reports": "Technical reports",
    "awards": "Awards",
    "grants": "Grants",
};


const publish_data = {
    "journals": {{ pub.journals | jsonify }},
    "int_conf": {{ pub.int-conferences | jsonify }},
    "dom_reports": {{ pub.dom-tech-reports | jsonify }},
    "awards": {{ pub.awards | jsonify }},
    "grants": {{ pub.grants | jsonify }},
};

const visible = {
    "en": {
        "journals": true,
        "int_conf": true,
        "dom_reports": false,
        "awards": true,
        "grants": true,
    },
    "jp": {
        "journals": true,
        "int_conf": true,
        "dom_reports": true,
        "awards": true,
        "grants": true,
    },
};

const create_list_all = (lang, style, order) => {
    categories.forEach(
        (cat) => {
            const settings = {
                "style": style[cat],
                "descending": order,
            }
            create_list(div_ids[cat], categories_text[cat], publish_data[cat], settings, visible[lang][cat], lang);
        }
    );
};

const list_publish = ((style, lang, order) => {
    return {
        "full": {
            "en": (() => {
                create_list_all("en",
                    {
                        "journals": (doc) => styles.journal_full[doc.lang === "en" ? "en" : "jp2en"],
                        "int_conf": (doc) => styles.int_conf_full,
                        "dom_reports": (doc) => styles.dom_reports_full[doc.lang === "en" ? "en" : "jp2en"],
                        "awards": (doc) => styles.awards.en,
                        "grants": (doc) => styles.grants.en,
                    },
                    order);
            }),
            "jp": (() => {
                create_list_all("jp",
                    {
                        "journals": (doc) => styles.journal_full[doc.lang],
                        "int_conf": (doc) => styles.int_conf_full,
                        "dom_reports": (doc) => styles.dom_reports_full[doc.lang],
                        "awards": (doc) => styles.awards[doc.lang],
                        "grants": (doc) => styles.grants[doc.lang],
                    },
                    order);
            }),
        },

        "short": {
            "en": (() => {
                create_list_all("en",
                    {
                        "journals": (doc) => styles.journal_short[doc.lang === "en" ? "en" : "jp2en"],
                        "int_conf": (doc) => styles.int_conf_short,
                        "dom_reports": (doc) => styles.dom_reports_short[doc.lang === "en" ? "en" : "jp2en"],
                        "awards": (doc) => styles.awards.en,
                        "grants": (doc) => styles.grants.en,
                    },
                    order);
            }),
            "jp": (() => {
                create_list_all("jp",
                    {
                        "journals": (doc) => styles.journal_short[doc.lang],
                        "int_conf": (doc) => styles.int_conf_short,
                        "dom_reports": (doc) => styles.dom_reports_short[doc.lang],
                        "awards": (doc) => styles.awards[doc.lang],
                        "grants": (doc) => styles.grants[doc.lang],
                    },
                    order);
            }),
        },
    }[style][lang];
});

const set_list_publish = ((style, order) => {
    const is_descending = {
        "descending": true,
        "ascending": false,
    }[order];
    window.list_publish = {
        "en": list_publish(style, "en", is_descending),
        "jp": list_publish(style, "jp", is_descending),
    };
});

const select_format = (() => {
    const style = document.getElementById("list_format").style.value;
    const order = document.getElementById("list_format").order.value;
    set_list_publish(style, order);
});

window.set_default_style = ((style, order) => {
    document.getElementById("list_format").style.value = style;
    document.getElementById("list_format").order.value = order;
    set_list_publish(style, order);
    window.list_publish[window.lang]();
});

(() => {
    // select format
    const btn_style = document.getElementsByClassName("format_btn");
    Array.from(btn_style).forEach((btn) => {
        btn.addEventListener("click", () => {
            // reset style
            select_format();
            window.list_publish[window.lang]();
        });
    });

    // set format functions
    select_format();
})();
