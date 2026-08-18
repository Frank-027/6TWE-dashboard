// ==========================================================
// app.js
// ==========================================================



// ==========================================================
// PERIODEGEGEVENS LADEN
// ==========================================================

async function laadPeriodeGegevens() {

    const startDatum =
        document.getElementById("startDatum").value;

    const eindDatum =
        document.getElementById("eindDatum").value;

    const meldingPeriodeDatum =
        document.getElementById("meldingPeriodeDatum");

    meldingPeriodeDatum.textContent = "";

    const meldingEnergie =
        document.getElementById("meldingPeriodeEnergie");

    meldingEnergie.textContent = "";

    const meldingBatterij =
        document.getElementById("meldingPeriodeBatterij");

    meldingBatterij.textContent = "";


    // ------------------------------------------------------
    // INPUT CONTROLEREN
    // ------------------------------------------------------

    if (startDatum === "" || eindDatum === "") {
        meldingPeriodeDatum.textContent =
            "Kies een start- en einddatum.";

        wisEnergieGrafiek();
        wisBatterijGrafiek();

        return;
    }


    if (startDatum > eindDatum) {
        meldingPeriodeDatum.textContent =
            "De startdatum moet vóór de einddatum liggen.";

        wisEnergieGrafiek();
        wisBatterijGrafiek();

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

    if (energieData === null ) {
        wisEnergieGrafiek();
        wisBatterijGrafiek();

        return;
    }

    if (energieData.length === 0) {
        meldingEnergie.textContent =
            "Geen energiegegevens gevonden voor deze periode.";

        wisEnergieGrafiek();
        wisBatterijGrafiek();

        return;
    }

    // ------------------------------------------------------
    // ENERGIE GRAFIEK TONEN
    // ------------------------------------------------------

    toonEnergieGrafiek(
        energieData
    );
    
    // ------------------------------------------------------
    // BATTERIJGEGEVENS
    // ------------------------------------------------------

    const batterijData =
        await haalBatterijPeriodeGegevensOp(
            startDatum,
            eindDatum
        );

    if (batterijData === null ) {
        wisBatterijGrafiek();

        return;
    }

    if (batterijData.length === 0) {
        meldingBatterij.textContent =
            "Geen batterijgegevens gevonden voor deze periode.";

        wisBatterijGrafiek();

        return;
    }

    // ------------------------------------------------------
    // Batterij GRAFIEK TONEN
    // ------------------------------------------------------

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