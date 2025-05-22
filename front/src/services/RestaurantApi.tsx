const BASE_URL = "http://localhost:8080/api";

export const fetchRestaurantById = async (id: number | string) => {
    const response = await fetch(`${BASE_URL}/restaurants/id/${id}`, {
        method: "GET",
        credentials: "include", // ensure session cookies are sent
    });
    if (!response.ok) throw new Error("Failed to fetch restaurant");
    return response.json();
};