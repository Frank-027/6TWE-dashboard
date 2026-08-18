// ==========================================================
// BATTERIJ
// ==========================================================

let batterijGrafiek = null;

// ==========================================================
// ACTUELE BATTERIJ
// ==========================================================

async function laadActueleBatterij() {

    const melding =
        document.getElementById("meldingActueelBatterij");

    melding.textContent = "";

    try {

        const data = await apiAanroepen(
                `${API_SERVER}/api/batterij/actueel`
        );

        document.getElementById("soc").textContent =
            data.battery_percentage.toFixed(1);

        document.getElementById("capaciteit").textContent =
            data.full_pack_energy_available_kwh.toFixed(2);

        document.getElementById("batterijVermogen").textContent =
            Math.abs(data.power_w).toFixed(0);

        let status = "INACTIEF";

        if (data.batterij_laden_w > 0) {
            status = "LADEN";
        }
        else if (data.batterij_ontladen_w > 0) {
            status = "ONTLADEN";
        }

        document.getElementById("batterijStatus").textContent =
            status;

        const tijdstip = new Date(data.timestamp);

        const tijdstipTekst = tijdstip.toLocaleString(
            "nl-BE",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

        document.getElementById("tijdstipBatterij").textContent =
            `Laatste batterijmeting: ${tijdstipTekst}`;
    }
    catch ( fout ) {
        // Technische informatie voor de ontwikkelaar
        console.error(
            "Fout bij ophalen actuele batterij gegevens:",
            fout
        );

        // Begrijpelijke melding voor de gebruiker
        melding.textContent =
            "De actuele batterijegevens konden niet worden opgehaald.";

        console.log( "Melding op pagina:", melding.textContent );
    }
}


// ==========================================================
// BATTERIJ PER DAG BINNEN PERIODE
// ==========================================================

async function haalBatterijPeriodeGegevensOp(
    startDatum,
    eindDatum
) {
    const melding =
        document.getElementById("meldingPeriodeBatterij");

    melding.textContent = "";

    try {

        const data = await apiAanroepen(
                `${API_SERVER}/api/batterij/perdag/${startDatum}/${eindDatum}`
        );

        return data;
    }
    catch ( fout ) {
        // Technische informatie voor de ontwikkelaar
        console.error(
            `Fout bij ophalen batterij gegevens voor: ${startDatum}/${eindDatum}`,
            fout
        );

        // Begrijpelijke melding voor de gebruiker
        melding.textContent =
            `De batterij gegevens voor ${startDatum}/${eindDatum} konden niet worden opgehaald.`;
        
        return null;
    }
}


// ==========================================================
// BATTERIJGRAFIEK
// ==========================================================

function toonBatterijGrafiek(data) {

    const datums = [];
    const geladen = [];
    const ontladen = [];

    data.forEach(dag => {

        datums.push(dag.datum);
        geladen.push(dag.charged_kwh);
        ontladen.push(dag.discharged_kwh);

    });

    if (batterijGrafiek !== null) {
        batterijGrafiek.destroy();
    }

    const ctx =
        document.getElementById("batterijGrafiek");

    batterijGrafiek = new Chart(
        ctx,
        {
            type: "bar",
            data: {
                labels: datums,
                datasets: [
                    {
                        label: "Geladen (kWh)",
                        data: geladen
                    },
                    {
                        label: "Ontladen (kWh)",
                        data: ontladen
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,

                        title: {
                            display: true,
                            text: "Energie (kWh)"
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: "Datum"
                        }
                    }
                }
            }
        }
    );
}

function wisBatterijGrafiek() {

    if (batterijGrafiek !== null) {
        batterijGrafiek.destroy();
        batterijGrafiek = null;
    }
}