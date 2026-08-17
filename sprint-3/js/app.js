let energieGrafiek = null; // variabele die bijhoud of we al dan niet al een grafiek hebben

let knop=document.getElementById("knop");

knop.addEventListener("click", laadPeriodeGegevens );

async function laadPeriodeGegevens() {

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
        `${API_SERVER}/api/energie/perdag/${startDatum}/${eindDatum}`,
        {
            headers: { "X-API-Key": API_KEY }
        }
    );

    const data = await antwoord.json();

    // Krijgen we data terug ??
    if (data.length === 0) {
        melding.textContent =
            "Geen energiegegevens gevonden voor deze periode.";
    return;
    }

    console.log(data);

    // Grafiek arrays vullen met opgehaalde data
    const datums = [];
    const productie = [];
    const verbruik = [];

    data.forEach(dag => {
        datums.push(dag.datum);
        productie.push(dag.production_kwh);
        verbruik.push(dag.consumption_kwh);

    });

    // Grafiek maken
    // Eerst vorige grafiek leegmaken, vooraleer een nieuwe grafiek te maken
    if (energieGrafiek !== null) {
        energieGrafiek.destroy();
    }
    const ctx = document.getElementById("energieGrafiek");

    energieGrafiek = new Chart(ctx, {
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
    });
}