---
---

// set default language
(() => {
    let default_lang = "en";
    if(page_name === "all.html"){
        default_lang = "jp";
    }
    window.changeLang(default_lang);
})();