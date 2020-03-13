---
---
{% assign prof = site.data.profile %}

// toggle lang wrapper
const ToggleLang = (EnToJp, JpToEn) => {
    const btn = document.getElementById('btn_lang');
    let jp_on = false;
    btn.addEventListener("click", () => {
        (jp_on ?
            () => { JpToEn(); jp_on = false; } :
            () => { EnToJp(); jp_on = true; }
        )();
    });
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
    ToggleLang(EnToJp, JpToEn);
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
    ToggleLang(EnToJp, JpToEn);
})();

// toggle biography
(() => {
    const div_bio = document.getElementById('biography');
    const bio = JSON.parse('{{ prof.biography | jsonify }}');
    const BioToTable = (bio_data) => {
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
    const EnToJp = () => { BioToTable(bio.jp); };
    const JpToEn = () => { BioToTable(bio.en); };
    ToggleLang(EnToJp, JpToEn);
})();