const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchData = async (endpoint, method = 'GET', body = null) => {
    try {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: body ? JSON.stringify(body) : null,
        });

        if (!res.ok) {
            throw new Error(`Error: ${res.status}`);
        }

        return await res.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};
