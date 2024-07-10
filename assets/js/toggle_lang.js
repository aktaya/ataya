---
---
{% assign prof = site.data.profile %}

const changeLangList = [];
(() => {
    window.changeLang = (lang) => {
        changeLangList.forEach((f)=>{
            f[lang]();
            window.lang = lang;
        })
    };
})();

// set button event to toggle language
(() => {
    const btn = document.getElementById('btn_lang');
    btn.addEventListener("click", () => {
        window.lang = (window.lang === "jp" ? "en" : "jp");
        window.changeLang(window.lang);
    });
})();

// language button
(() => {
    const btn = document.getElementById('btn_lang');
    const ToJp = () => {
        btn.innerHTML = "en"; // jp時はボタン表示は"en"
    };
    const ToEn = () => {
        btn.innerHTML = "jp"; // en時はボタン表示は"jp"
    };
    changeLangList.push({ jp: ToJp, en: ToEn });
})();

// profile
(() => {
    const prof = document.getElementById('prof');
    const ToJp = () => {
        prof.innerHTML = "{{ prof.jp.affiliation }}";
    };
    const ToEn = () => {
        prof.innerHTML = "{{ prof.en.affiliation }}";
    }
    changeLangList.push({ jp: ToJp, en: ToEn });
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
    const ToJp = () => { bioToTable(bio.jp); };
    const ToEn = () => { bioToTable(bio.en); };
    changeLangList.push({ jp: ToJp, en: ToEn });
})();

// committee
(() => {
    const div_committee = document.getElementById('committee');
    const committeeToList = (data) => {
        const ul = document.createElement('ul');
        ul.className = 'committee';
        data.forEach(obj => {
            const role = document.createElement('li');
            const details = document.createElement('ul');
            details.className = 'committee_detail';
            obj.details.forEach(detail => {
                const li = document.createElement('li');
                li.innerHTML = detail;
                details.appendChild(li);
            });
            role.innerHTML = obj.role;
            role.appendChild(details);
            ul.appendChild(role);
        });
        while (div_committee.firstChild) {
            div_committee.removeChild(div_committee.firstChild);
        }
        div_committee.appendChild(ul);
    }
    const committee = {{ prof.committee | jsonify }};
    const ToJp = () => { committeeToList(committee.jp); };
    const ToEn = () => { committeeToList(committee.en); };
    changeLangList.push({ jp: ToJp, en: ToEn });
})();

// toggle publish list
(() => {
    const ToJp = () => {
        window.list_publish.jp();
    };
    const ToEn = () => {
        window.list_publish.en();
    }
    changeLangList.push({ jp: ToJp, en: ToEn });
})();
