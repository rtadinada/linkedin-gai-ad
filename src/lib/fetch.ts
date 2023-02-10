const STARTING_BACKOFF = 300;

export async function fetchWithRetry(
    input: RequestInfo,
    init?: RequestInit,
    retries = 3
): Promise<Response> {
    let numRetries = retries;
    let backoff = STARTING_BACKOFF;
    let response: Response | undefined;

    while (numRetries > 0) {
        try {
            response = await fetch(input, init);
            if (response.ok) {
                return response;
            } else {
                throw new Error(`Fetch failed with status code ${response.status}`);
            }
        } catch (error) {
            numRetries--;
            if (numRetries === 0) {
                break;
            } else {
                await new Promise((resolve) => setTimeout(resolve, backoff));
                backoff *= 2;
            }
        }
    }

    if (!response) {
        throw new Error("Error executing fetch");
    }
    return response;
}
