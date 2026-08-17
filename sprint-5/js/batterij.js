// ==========================================================
// BATTERIJ
// ==========================================================

let batterijGrafiek = null;

// ==========================================================
// ACTUELE BATTERIJ
// ==========================================================

async function laadActueleBatterij() {

    const response = await fetch(
        `${API_SERVER}/api/batterij/actueel`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    const data = await response.json();

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


// ==========================================================
// BATTERIJ PER DAG BINNEN PERIODE
// ==========================================================

async function haalBatterijPeriodeGegevensOp(
    startDatum,
    eindDatum
) {

    const response = await fetch(
        `${API_SERVER}/api/batterij/perdag/${startDatum}/${eindDatum}`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    return await response.json();
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