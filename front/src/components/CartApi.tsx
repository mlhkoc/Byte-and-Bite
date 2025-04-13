
const username = localStorage.getItem("user");

export const fetchCartItems = async () => {
    const response = await fetch(`http://localhost:8080/api/cart/${username}`, {
        method: 'GET',
        credentials: 'include', // if using session-based authentication
    });
    if (!response.ok) throw new Error('Failed to fetch cart');
    console.log(response);
    return response.json();
};


export const updateCartQuantity = async (id: number, quantity: number) => {
    const response = await fetch(`http://localhost:8080/api/cart/${username}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(quantity),
    });
    if (!response.ok) throw new Error('Failed to update cart quantity');
};

export const removeCartItem = async (id: number) => {
    const response = await fetch(`http://localhost:8080/api/cart/${username}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to remove item from cart');
};

export const clearCart = async () => {
    const response = await fetch(`http://localhost:8080/api/cart/${username}/all`, {
        method: 'DELETE',
        credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to clear cart');
};