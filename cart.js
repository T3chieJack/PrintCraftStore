// Load cart from localStorage
function loadCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Your cart is empty!</p>';
        return;
    }

    cart.forEach((item, index) => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            <p>${item.name} - $${item.price}</p>
            <input type="number" value="${item.quantity}" min="1" class="item-quantity" data-index="${index}">
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove-item" data-index="${index}">Remove</button>
        `;
        cartItemsContainer.appendChild(itemElement);
    });

    document.querySelectorAll('.item-quantity').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', removeItem);
    });
}

// Update cart quantity
function updateQuantity(event) {
    const index = event.target.dataset.index;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity = parseInt(event.target.value) || 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Remove an item from the cart
function removeItem(event) {
    const index = event.target.dataset.index;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

// Generate QR code on checkout
document.getElementById('checkout').addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const customerName = prompt('Enter your name:');
    const customerEmail = prompt('Enter your email:');

    if (!customerName || !customerEmail) {
        alert('Name and email are required!');
        return;
    }

    // Generate the order details
    const orderDetails = {
        name: customerName,
        email: customerEmail,
        cart,
    };

    // Encode order details into a query string
    const queryParams = new URLSearchParams({
        name: orderDetails.name,
        email: orderDetails.email,
        cart: JSON.stringify(orderDetails.cart),
    }).toString();

    const orderUrl = `https://T3chiejack.github.io/PrintCraftStore/order.html?${queryParams}`;

    // Generate QR code
    QRCode.toDataURL(orderUrl, { width: 256 }, (err, url) => {
        if (err) return console.error(err);

        // Create a downloadable QR code image
        const link = document.createElement('a');
        link.href = url;
        link.download = 'order-qr-code.png';
        link.innerHTML = `<img src="${url}" alt="Order QR Code">`;

        // Append the QR code to the cart page
        const cartDiv = document.querySelector('.cart');
        cartDiv.innerHTML = `
            <h2>QR Code Generated</h2>
            <p>Scan this QR code to view the order:</p>
        `;
        cartDiv.appendChild(link);

        // Clear the cart after generating the QR code
        localStorage.removeItem('cart');
    });
});

// Load the cart on page load
loadCart();
