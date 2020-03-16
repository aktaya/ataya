---
---
{% assign prof = site.data.profile %}

// toggle lang wrapper
const toggleLang = (EnToJp, JpToEn) => {
    const btn = document.getElementById('btn_lang');
    let lang_jp = false;
    btn.addEventListener("click", () => {
        (lang_jp ?
            () => { JpToEn(); lang_jp = false; window.lang="en"; } :
            () => { EnToJp(); lang_jp = true; window.lang="jp"; }
        )();
    });
    window.lang = "en";
    JpToEn();
};

// toggle lang button
(() => {
    const btn = document.getElementById('btn_lang');
    const EnToJp = () => {
        btn.innerHTML = "en"; // jp時はボタン表示は"en"
    };
    const JpToEn = () => {
        btn.innerHTML = "jp"; // en時はボタン表示は"jp"
    };
    toggleLang(EnToJp, JpToEn);
})();

// toggle profile
(() => {
    const prof = document.getElementById('prof');
    const EnToJp = () => {
        prof.innerHTML = "{{ prof.jp.affiliation }}";
    };
    const JpToEn = () => {
        prof.innerHTML = "{{ prof.en.affiliation }}";
    }
    toggleLang(EnToJp, JpToEn);
})();

// toggle biography
(() => {
    const div_bio = document.getElementById('biography');
    const bioToTable = (bio_data) => {
        const ul_bio = document.createElement('ul');
        ul_bio.className = "biography";
        bio_data.forEach(line => {
            const date = document.createElement("li");
            date.className = "date";
            date.innerHTML = line.date;

            const affl = document.createElement("li");
            affl.className = "affiliation";
            affl.innerHTML = line.affiliation;

            const ul = document.createElement("ul");
            ul.appendChild(date);
            ul.appendChild(affl);

            const li = document.createElement("li");
            li.appendChild(ul);
            ul_bio.appendChild(li);
        });
        while (div_bio.firstChild) {
            div_bio.removeChild(div_bio.firstChild);
        }
        div_bio.appendChild(ul_bio);
    }
    const bio = {{ prof.biography | jsonify }};
    const EnToJp = () => { bioToTable(bio.jp); };
    const JpToEn = () => { bioToTable(bio.en); };
    toggleLang(EnToJp, JpToEn);
})();

// toggle publish list
(() => {
    const EnToJp = () => {
        window.list_publish.jp();
    };
    const JpToEn = () => {
        window.list_publish.en();
    }
    toggleLang(EnToJp, JpToEn);
})();