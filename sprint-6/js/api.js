async function apiAanroepen(url) {

    const controller = new AbortController();

    const timeout = setTimeout(
        () => controller.abort(),
        5000
    );

    try {

        const response = await fetch(
            url,
            {
                headers: {
                    "X-API-Key": API_KEY
                },
                signal: controller.signal
            }
        );

        if (!response.ok) {
            throw new Error(
                `HTTP fout ${response.status}`
            );
        }

        return await response.json();

    }
    finally {

        clearTimeout(timeout);
    }
}