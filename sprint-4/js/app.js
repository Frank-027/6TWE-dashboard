// variabelen die bijhouden of we al dan niet al een grafiek hebben
let batterijGrafiek1 = null; 
let batterijGrafiek2 = null; 

async function laadBatterijActueel() {

    const response = await fetch(
        `${API_SERVER}/api/batterij/actueel`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    const data = await response.json();

    if (data.length === 0) {
        melding.textContent =
        "Geen batterijgegevens gevonden voor deze periode.";
        return;
    }

    console.log(data);

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
}

laadBatterijActueel();


let knop=document.getElementById("knop");
knop.addEventListener("click",          
    laadPeriodeBatterijGegevens );

async function laadPeriodeBatterijGegevens() {

    // start- en einddatum ophalen + validatie
    const startDatum = document.getElementById("startDatum").value;
    const eindDatum = document.getElementById("eindDatum").value;
    
    const melding = document.getElementById("melding");

    // Oude melding verwijderen
    melding.textContent = "";

    // Geen datum gekozen
    if (startDatum === "" || eindDatum === "" ) {
        melding.textContent = "Kies eerst een start- en einddatum.";
        return;
    }
    
    // Foute datum keuze
    if (startDatum > eindDatum) {
        melding.textContent =
            "De startdatum moet vóór de einddatum liggen.";
        return;
    }

    // Data Array ophalen
    const antwoord = await fetch(
        `${API_SERVER}/api/batterij/perdag/${startDatum}/${eindDatum}`,
        {
            headers: { "X-API-Key": API_KEY }
        }
    );

    const data = await antwoord.json();

    // Krijgen we data terug ??
    if (data.length === 0) {
        melding.textContent =
            "Geen batterij gegevens gevonden voor deze periode.";
    return;
    }

    console.log(data);

    toonBatterijGrafiek( data );
    toonBatterijSOC( data );

}

function toonBatterijGrafiek(data) {

    // Grafiek arrays vullen met opgehaalde data
    const datums = [];
    const geladenEnergie = [];
    const ontladenEnergie = [];

    data.forEach(dag => {
        datums.push(dag.datum);
        geladenEnergie.push(dag.charged_kwh);
        ontladenEnergie.push(dag.discharged_kwh);
    });

    // Grafiek maken
    // Eerst vorige grafiek leegmaken, vooraleer een nieuwe grafiek te maken
    if (batterijGrafiek1 !== null) {
        batterijGrafiek1.destroy();
    }
    const ctx = document.getElementById("batterijEnergieGrafiek");

    batterijGrafiek1 = new Chart(ctx, {
        type: "bar",

        data: {
            labels: datums,
            datasets: [
                {
                    label: "Geladen energie (kWh)",
                    data: geladenEnergie
                },
                {
                    label: "Ontladen energie (kWh)",
                    data: ontladenEnergie
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
                        text: "Batterij energie ( kWh)"
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
    });
}

function toonBatterijSOC(data) {

    // Grafiek arrays vullen met opgehaalde data
    const datums = [];
    const soc_begin = [];
    const soc_einde = [];

    data.forEach(dag => {
        datums.push(dag.datum);
        soc_begin.push(dag.soc_begin);
        soc_einde.push(dag.soc_einde);
    });

    // Grafiek maken
    // Eerst vorige grafiek leegmaken, vooraleer een nieuwe grafiek te maken
    if (batterijGrafiek2 !== null) {
        batterijGrafiek2.destroy();
    }
    const ctx = document.getElementById("batterijSOCGrafiek");

    batterijGrafiek2 = new Chart(ctx, {
        type: "line",

        data: {
            labels: datums,
            datasets: [
                {
                    label: "SOC begin (%)",
                    data: soc_begin
                },
                {
                    label: "SOC einde (%)",
                    data: soc_einde
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
                        text: "Batterij SOC (%)"
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
    });
}