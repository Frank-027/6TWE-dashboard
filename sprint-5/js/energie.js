// ==========================================================
// ENERGIE
// ==========================================================

let energieGrafiek = null;

// ==========================================================
// ACTUELE ENERGIE
// ==========================================================

async function laadActueleEnergie() {

    const response = await fetch(
        `${API_SERVER}/api/energie/actueel`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    const data = await response.json();

    document.getElementById("productieActueel").textContent =
        Math.round(data.production_w);

    document.getElementById("verbruikActueel").textContent =
        Math.round(data.consumption_w);

    document.getElementById("naarNetActueel").textContent =
        Math.round(data.naar_net_w);

    document.getElementById("afnameActueel").textContent =
        Math.round(data.purchased_w);

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

    document.getElementById("tijdstipEnergie").textContent =
        `Laatste energiemeting: ${tijdstipTekst}`;
}


// ==========================================================
// ENERGIE VAN ÉÉN DAG
// ==========================================================

async function laadDagGegevens() {

    const datum =
        document.getElementById("datum").value;

    const melding =
        document.getElementById("meldingDag");

    melding.textContent = "";

    if (datum === "") {
        melding.textContent =
            "Kies eerst een datum.";

        return;
    }

    const response = await fetch(
        `${API_SERVER}/api/energie/dag/${datum}`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    const data = await response.json();

    if (data.datapunten === 0) {

        melding.textContent =
            "Geen energiegegevens gevonden voor deze datum.";

        wisDagGegevens();

        return;
    }

    document.getElementById("productieDag").textContent =
        data.production_kwh.toFixed(2);

    document.getElementById("verbruikDag").textContent =
        data.consumption_kwh.toFixed(2);

    document.getElementById("zelfconsumptieDag").textContent =
        data.self_consumption_kwh.toFixed(2);

    document.getElementById("injectieDag").textContent =
        data.feed_in_kwh.toFixed(2);

    document.getElementById("afnameDag").textContent =
        data.purchased_kwh.toFixed(2);
}


function wisDagGegevens() {
    document.getElementById("productieDag").textContent = "--";
    document.getElementById("verbruikDag").textContent = "--";
    document.getElementById("zelfconsumptieDag").textContent = "--";
    document.getElementById("injectieDag").textContent = "--";
    document.getElementById("afnameDag").textContent = "--";
}


// ==========================================================
// ENERGIE PER DAG BINNEN PERIODE
// ==========================================================

async function haalEnergiePeriodeGegevensOp(
    startDatum,
    eindDatum
) {

    const response = await fetch(
        `${API_SERVER}/api/energie/perdag/${startDatum}/${eindDatum}`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    return await response.json();
}


// ==========================================================
// ENERGIEGRAFIEK
// ==========================================================

function toonEnergieGrafiek(data) {

    const datums = [];
    const productie = [];
    const verbruik = [];

    data.forEach(dag => {

        datums.push(dag.datum);
        productie.push(dag.production_kwh);
        verbruik.push(dag.consumption_kwh);

    });

    if (energieGrafiek !== null) {
        energieGrafiek.destroy();
    }

    const ctx =
        document.getElementById("energieGrafiek");

    energieGrafiek = new Chart(
        ctx,
        {
            type: "bar",
            data: {
                labels: datums,
                datasets: [
                    {
                        label: "Productie (kWh)",
                        data: productie
                    },
                    {
                        label: "Verbruik (kWh)",
                        data: verbruik
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