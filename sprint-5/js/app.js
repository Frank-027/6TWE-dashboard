// ==========================================================
// APP
// ==========================================================


// ==========================================================
// PERIODEGEGEVENS LADEN
// ==========================================================

async function laadPeriodeGegevens() {

    const startDatum =
        document.getElementById("startDatum").value;

    const eindDatum =
        document.getElementById("eindDatum").value;

    const melding =
        document.getElementById("meldingPeriode");

    melding.textContent = "";


    // ------------------------------------------------------
    // INPUT CONTROLEREN
    // ------------------------------------------------------

    if (startDatum === "" || eindDatum === "") {
        melding.textContent =
            "Kies een start- en einddatum.";

        return;
    }


    if (startDatum > eindDatum) {
        melding.textContent =
            "De startdatum moet vóór de einddatum liggen.";

        return;
    }


    // ------------------------------------------------------
    // ENERGIEGEGEVENS
    // ------------------------------------------------------

    const energieData =
        await haalEnergiePeriodeGegevensOp(
            startDatum,
            eindDatum
        );

    if (energieData.length === 0) {
        melding.textContent =
            "Geen energiegegevens gevonden voor deze periode.";

        return;
    }


    // ------------------------------------------------------
    // BATTERIJGEGEVENS
    // ------------------------------------------------------

    const batterijData =
        await haalBatterijPeriodeGegevensOp(
            startDatum,
            eindDatum
        );


    // ------------------------------------------------------
    // GRAFIEKEN TONEN
    // ------------------------------------------------------

    toonEnergieGrafiek(
        energieData
    );

    toonBatterijGrafiek(
        batterijData
    );
}


// ==========================================================
// EVENT LISTENERS
// ==========================================================

document
    .getElementById("knopDag")
    .addEventListener(
        "click",
        laadDagGegevens
    );


document
    .getElementById("knopPeriode")
    .addEventListener(
        "click",
        laadPeriodeGegevens
    );


// ==========================================================
// PAGINA INITIALISEREN
// ==========================================================

laadActueleEnergie();
laadActueleBatterij();