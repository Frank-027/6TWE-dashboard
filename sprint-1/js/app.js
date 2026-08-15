let knop=document.getElementById("knop");

knop.addEventListener("click", haalActueleEnergieDataOp );

async function haalActueleEnergieDataOp() {

  const antwoord = await fetch(
        `${API_SERVER}/api/energie/actueel`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    const data = await antwoord.json();

    console.log(data);

    document.getElementById("productie").textContent =
        Math.round(data.production_w);

    document.getElementById("verbruik").textContent =
        Math.round(data.consumption_w);

    document.getElementById("naarHuis").textContent =
        Math.round(data.naar_huis_w);

    document.getElementById("naarBatterij").textContent =
        Math.round(data.naar_batterij_w);

    document.getElementById("naarNet").textContent =
        Math.round(data.naar_net_w);

    const tijdstip = new Date(data.timestamp);

    const tijdstipTekst = tijdstip.toLocaleString("nl-BE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });

    document.getElementById("tijdstip").textContent =
    `Laatste meting: ${tijdstipTekst}`;
}