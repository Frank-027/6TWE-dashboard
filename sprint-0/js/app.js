let knop=document.getElementById("knop");

knop.addEventListener("click", haalDataOp );

async function haalDataOp() {

  const antwoord = await fetch(
        `${API_SERVER}/api/energie/dag/2026-08-07`,
        {
            headers: {
                "X-API-Key": API_KEY
            }
        }
    );

    const data = await antwoord.json();

    console.log(data);
}