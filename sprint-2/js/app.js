let knop=document.getElementById("knop");

knop.addEventListener("click", laadDagGegevens );

async function laadDagGegevens() {

    const datum = document.getElementById("datum").value;
    const melding = document.getElementById("melding");

    // Oude melding verwijderen
    melding.textContent = "";

    // Geen datum gekozen
    if (datum === "") {
        melding.textContent = "Kies eerst een datum.";
        return;
    }

    const antwoord = await fetch(
            `${API_SERVER}/api/energie/dag/${datum}`,
            {
                headers: {
                    "X-API-Key": API_KEY
                }
            }
        );

    const data = await antwoord.json();

    console.log(data);

    // Geen gegevens gevonden
    if (data.datapunten === 0) {
        melding.textContent =
            "Geen energiegegevens gevonden voor deze datum.";
        
        // Velden weer leeg maken 
        document.getElementById("productie").textContent = "--";
        document.getElementById("verbruik").textContent = "--";
        document.getElementById("zelfverbruik").textContent = "--";
        document.getElementById("injectie").textContent = "--";
        document.getElementById("afname").textContent = "--";
        
        return;
    }

    document.getElementById("productie").textContent =
        data.production_kwh.toFixed(2);

    document.getElementById("verbruik").textContent =
        data.consumption_kwh.toFixed(2);

    document.getElementById("zelfverbruik").textContent =
        data.self_consumption_kwh.toFixed(2);

    document.getElementById("injectie").textContent =
        data.feed_in_kwh.toFixed(2);

    document.getElementById("afname").textContent =
        data.purchased_kwh.toFixed(2);
}