let cart = [];

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 60);
});

const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileNav = document.getElementById('mobileNav');
mobileMenuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
});

function closeMobileNav() {
    mobileNav.classList.remove('open');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
}

const cartBtn = document.getElementById('cartBtn');
const cartModal = document.getElementById('cart-modal');

cartBtn.addEventListener('click', () => {
    cartModal.classList.toggle('show-cart');
});

document.addEventListener('click', (e) => {
    if (cartModal.classList.contains('show-cart') &&
        !cartModal.contains(e.target) &&
        !cartBtn.contains(e.target)) {
        closeCart();
    }
});

function addToCart(productName, price) {
    cart.push({ name: productName, price: price });
    updateCart();
    showToast('✦ "' + productName + '" added to your collection');
}

function updateCart() {
    document.getElementById('cart-count').textContent = cart.length;
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div style="text-align:center;padding:60px 20px;color:rgba(245,240,232,0.35)">
                <div style="font-size:36px;margin-bottom:12px">🖼</div>
                <p style="font-size:13px;font-weight:300">Your collection is empty</p>
                <p style="font-size:12px;margin-top:6px;font-weight:300">Discover artworks in our gallery</p>
            </div>`;
    } else {
        cart.forEach((item, index) => {
            total += item.price;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div class="cart-item-info">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">Rs ${item.price.toLocaleString()}</div>
                    </div>
                    <button class="cart-item-remove" onclick="removeItem(${index})">✕</button>
                </div>`;
        });
    }

    document.getElementById('cart-total').textContent = 'Rs ' + total.toLocaleString();
}

function removeItem(index) {
    const name = cart[index].name;
    cart.splice(index, 1);
    updateCart();
    showToast('Removed "' + name + '"');
}

function closeCart() {
    cartModal.classList.remove('show-cart');
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty. Add artworks first!');
        return;
    }
    let message = '🎨 *Aasath Art — New Order*%0A%0A';
    let total = 0;
    cart.forEach((item, index) => {
        message += (index + 1) + '. ' + item.name + ' — Rs ' + item.price.toLocaleString() + '%0A';
        total += item.price;
    });
    message += '%0A*Total: Rs ' + total.toLocaleString() + '*';
    message += '%0A%0AKindly confirm my order. Thank you! ✨';
    window.open('https://wa.me/94773503720?text=' + message, '_blank');
}

function filterProducts(category, btnEl) {
    document.querySelectorAll('.category-card').forEach(btn => btn.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');

    let visibleCount = 0;
    document.querySelectorAll('.product-card').forEach(product => {
        const show = category === 'all' || product.classList.contains(category);
        product.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });

    document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
    document.getElementById('searchInput').value = '';
}

const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('input', () => {
    const val = searchInput.value.toLowerCase().trim();
    if (val) document.querySelectorAll('.category-card').forEach(btn => btn.classList.remove('active'));

    let visibleCount = 0;
    document.querySelectorAll('.product-card').forEach(product => {
        const name = product.querySelector('h3').textContent.toLowerCase();
        const show = name.includes(val);
        product.style.display = show ? 'block' : 'none';
        if (show) visibleCount++;
    });

    document.getElementById('noResults').style.display = visibleCount === 0 ? 'block' : 'none';
});

function openProduct(title, price, description, images) {
    document.getElementById('productModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
    document.getElementById('productTitle').textContent = title;
    document.getElementById('productPrice').textContent = 'Rs ' + price.toLocaleString();
    document.getElementById('productDescription').textContent = description;
    document.getElementById('mainProductImage').src = images[0];

    const thumbnailRow = document.getElementById('thumbnailRow');
    thumbnailRow.innerHTML = '';
    images.forEach((img, i) => {
        const thumb = document.createElement('img');
        thumb.src = img;
        if (i === 0) thumb.classList.add('active');
        thumb.addEventListener('click', () => changeMainImage(img, thumb));
        thumbnailRow.appendChild(thumb);
    });

    document.getElementById('addCartBtn').onclick = function () {
        addToCart(title, price);
        closeProduct();
    };
}

function closeProduct() {
    document.getElementById('productModal').style.display = 'none';
    document.body.style.overflow = '';
}

function changeMainImage(imgSrc, thumbEl) {
    document.getElementById('mainProductImage').src = imgSrc;
    document.querySelectorAll('.thumbnail-row img').forEach(t => t.classList.remove('active'));
    if (thumbEl) thumbEl.classList.add('active');
}

document.getElementById('productModal').addEventListener('click', function (e) {
    if (e.target === this) closeProduct();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeProduct(); closeCart(); }
});

updateCart();