const BASE_URL = "http://localhost:8080/api";

export const fetchRestaurantById = async (id: number | string) => {
    const token = localStorage.getItem( "token" );
    const response = await fetch(`${BASE_URL}/restaurants/id/${id}`, {
        method: "GET",
        credentials: "include", // ensure session cookies are sent
        headers: { Authorization: `Bearer ${token}` }
    });
    if (!response.ok) throw new Error("Failed to fetch restaurant");
    return response.json();
};