


export const fetchCartItems = async () => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/cart/${username}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    console.log(username)
    return response.json();
};

export const updateCartQuantity = async (id: number, quantity: number) => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/cart/${username}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
        body: JSON.stringify(quantity),
    });
    if (!response.ok) throw new Error('Failed to update cart quantity');
};

export const removeCartItem = async (id: number) => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/cart/${username}/${id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },    });
    if (!response.ok) throw new Error('Failed to remove item from cart');
};

export const clearCart = async () => {
    const username = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    const response = await fetch(`http://localhost:8080/api/cart/${username}/all`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
    });
    if (!response.ok) throw new Error('Failed to clear cart');
};