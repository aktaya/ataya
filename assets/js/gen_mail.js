---
---

// const str_ma = [0x45, 0x2d, 0x6d, 0x61, 0x69, 0x6c, 0x3a, 0x20];
// const ma = document.getElementById('ma');
// ma.innerHTML = String.fromCharCode(...str_ma);
{% assign prof = site.data.profile %}

const m_array = JSON.parse("{{ prof.email | jsonify }}");
const micon = document.getElementById('micon');
const rotate_kerframe = "img_rotate"

const CopyTextToClipboard = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.opacity = "0%";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    textArea.parentElement.removeChild(textArea);
};

const RotateIcon = (animationTime) => {
    micon.style.animation = rotate_kerframe + " " + animationTime / 1000 + "s linear";
    setTimeout(() => {
        micon.style.animation = "none";
    }, animationTime);
};

micon.addEventListener("click", () => {
    const ma = String.fromCharCode(...m_array);
    CopyTextToClipboard(ma);
    RotateIcon(300);
});