---
---

// set default language
(() => {
    let default_lang = "en";
    if(page_name === "all.html"){
        default_lang = "jp";
    }
    if (page_name === "all.html") {
        window.changeLang("jp");
        window.set_default_style("full", "descending");
    }
    else {
        window.changeLang("en");
        window.set_default_style("short", "descending");
    }
})();