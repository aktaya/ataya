---
---

// set default language
(() => {
    const browser_lang = window.navigator.language;
    let default_lang = browser_lang === 'ja' ? 'jp' : 'en';

    if (page_name === "all.html") {
        window.changeLang(default_lang);
        window.set_default_style("full", "descending");
    }
    else {
        window.changeLang(default_lang);
        window.set_default_style("short", "descending");
    }
})();