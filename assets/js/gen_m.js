---
---
{% assign prof = site.data.profile %}

const m_array = {{ prof.email | jsonify }};
const micon = document.getElementById('micon');
const rotate_kerframe = "mimg_click";

const copyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.opacity = "0%";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.parentElement.removeChild(textArea);
};

const rotateIcon = (animationTime) => {
    micon.style.animation = rotate_kerframe + " " + animationTime / 1000 + "s linear";
    setTimeout(() => {
       micon.style.animation = "none";
    }, animationTime);
};

micon.addEventListener("click", () => {
    const ma = String.fromCharCode(...m_array);
    copyTextToClipboard(ma);
    rotateIcon(300);
});

(() => {
    const tx_array = [
        0x26, 0x6c, 0x74, 0x72, 0x69, 0x3b,
        0x20, 0x20, 0x63, 0x6c, 0x69, 0x63,
        0x6b, 0x20, 0x74, 0x6f, 0x20, 0x63,
        0x6f, 0x70, 0x79, 0x20, 0x65, 0x2d,
        0x6d, 0x61, 0x69, 0x6c, 0x20, 0x61,
        0x64, 0x64, 0x72, 0x65, 0x73, 0x73,
    ];
    const mlabel = document.getElementById('mlabel')
    mlabel.innerHTML = String.fromCharCode(...tx_array);
})();