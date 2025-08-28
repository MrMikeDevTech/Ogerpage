const $ = (s: string) => document.querySelector(s);
const $$ = (s: string) => document.querySelectorAll(s);

const SCROLL_POSITIONS = {
    startPage: 0,
    firstTitle: 675,
    startKitakamiOst: 1600,
    startWildCardOst: 6800
};

const AUDIO_PATHS = {
    ogerponCry: "/audios/ogerpon-cry.mp3",
    kitakami: "/audios/Ow.mp3",
    wild: "/audios/Wild.mp3"
};

const maxVolume = 0.6;

const $go_to_start = $("#go-to-start");
const $explore_btn = $("#explore-btn");
const $ogerpons = $$(".ogerpon");

window.addEventListener("scroll", () => {
    if (window.scrollY > 100) $go_to_start!.classList.add("show");
    else $go_to_start!.classList.remove("show");
});

$go_to_start!.addEventListener("click", () => {
    window.scrollTo({ top: SCROLL_POSITIONS.startPage, behavior: "smooth" });
});

$explore_btn!.addEventListener("click", () => {
    window.scrollTo({ top: SCROLL_POSITIONS.firstTitle, behavior: "smooth" });
});

const kitakami = new Audio(AUDIO_PATHS.kitakami);
const wildCard = new Audio(AUDIO_PATHS.wild);

kitakami.loop = true;
wildCard.loop = true;
kitakami.volume = 0;
wildCard.volume = 0;

let userInteracted = false;

$ogerpons!.forEach(($ogerpon) => {
    const sound = new Audio(AUDIO_PATHS.ogerponCry);
    $ogerpon.addEventListener("mouseenter", () => {
        if (userInteracted) {
            sound.currentTime = 0;
            sound.play();
        }
    });
});

const enableSound = () => {
    if (!userInteracted) {
        userInteracted = true;
        kitakami.play();
        wildCard.play();
        window.removeEventListener("click", enableSound);
        window.removeEventListener("keydown", enableSound);
    }
};

window.addEventListener("click", enableSound);
window.addEventListener("keydown", enableSound);

window.addEventListener("scroll", () => {
    if (!userInteracted) return;

    const scrollY = window.scrollY;

    if (
        scrollY >= SCROLL_POSITIONS.startKitakamiOst &&
        scrollY < SCROLL_POSITIONS.startKitakamiOst + 1000
    ) {
        const fadeProgress = (scrollY - SCROLL_POSITIONS.startKitakamiOst) / 1000;
        kitakami.volume = Math.min(maxVolume, fadeProgress * maxVolume);
        wildCard.volume = 0;
    } else if (
        scrollY >= SCROLL_POSITIONS.startKitakamiOst &&
        scrollY < SCROLL_POSITIONS.startWildCardOst
    ) {
        kitakami.volume = maxVolume;
        wildCard.volume = 0;
    } else if (scrollY >= SCROLL_POSITIONS.startWildCardOst) {
        const fadeRange = 200;
        const progress = Math.min(
            1,
            (scrollY - SCROLL_POSITIONS.startWildCardOst) / fadeRange
        );

        kitakami.volume = Math.max(0, (1 - progress) * maxVolume);
        wildCard.volume = progress * maxVolume;
    } else {
        kitakami.volume = 0;
        wildCard.volume = 0;
    }
});
