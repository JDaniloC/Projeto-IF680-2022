function closeTutorial() {
    document.querySelector("#infos").classList.add("hide");
}
function openTutorial() {
    document.querySelector("#infos").classList.remove("hide");
}
function playReplay() {
    if (replayCurves.length === 0) {
        return alert("Nenhuma linha selecionada!");
    }
    replayContainer.style.display = "block";
    replay.playReplay(replayInput.value);
}
function closeReplay() {
    replayContainer.style.display = "none";
}