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
}