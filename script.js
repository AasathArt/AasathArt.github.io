let cart = [];

const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
});

function toggleMobileNav() {
    document.getElementById('mobileNav').classList.toggle('open');
}

function showToast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2800);
}

function openCart() {
    document.getElementById('cartSidebar').classList.add('open');
    document.getElementById('cartOverlay').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('cartOverlay').classList.remove('show');
    document.body.style.overflow = '';
}

function addToCart(name, price) {
    cart.push({ name, price });
    updateCart();
    showToast('Added — ' + name);
}

function updateCart() {
    document.getElementById('cartCount').textContent = cart.length;
    const el = document.getElementById('cartItems');
    let total = 0;

    if (cart.length === 0) {
        el.innerHTML = `
            <div class="cart-empty">
                <span class="cart-empty-icon">🖼</span>
                <p>Your cart is empty</p>
            </div>`;
    } else {
        el.innerHTML = '';
        cart.forEach((item, i) => {
            total += item.price;
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">Rs ${item.price.toLocaleString()}</div>
                </div>
                <button class="cart-item-del" onclick="removeItem(${i})">✕</button>`;
            el.appendChild(div);
        });
    }

    document.getElementById('cartTotal').textContent = 'Rs ' + total.toLocaleString();
}

function removeItem(i) {
    const name = cart[i].name;
    cart.splice(i, 1);
    updateCart();
    showToast('Removed — ' + name);
}

function sendWhatsAppOrder() {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }
    let msg = '🎨 *Aasath Art Order*%0A%0A';
    let total = 0;
    cart.forEach((item, i) => {
        msg += `${i + 1}. ${item.name} — Rs ${item.price.toLocaleString()}%0A`;
        total += item.price;
    });
    msg += `%0A*Total: Rs ${total.toLocaleString()}*%0A%0APlease confirm my order. Thank you!`;
    window.open('https://wa.me/94773503720?text=' + msg, '_blank');
}

function filterProducts(category, btn) {
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    document.getElementById('searchInput').value = '';
    let count = 0;
    document.querySelectorAll('.product-card').forEach(card => {
        const show = category === 'all' || card.classList.contains(category);
        card.style.display = show ? '' : 'none';
        if (show) count++;
    });
    document.getElementById('noResults').style.display = count === 0 ? 'block' : 'none';
}

document.getElementById('searchInput').addEventListener('input', function () {
    const val = this.value.toLowerCase().trim();
    document.querySelectorAll('.tab').forEach(b => b.classList.remove('active'));
    let count = 0;
    document.querySelectorAll('.product-card').forEach(card => {
        const name = card.querySelector('h3').textContent.toLowerCase();
        const show = name.includes(val);
        card.style.display = show ? '' : 'none';
        if (show) count++;
    });
    document.getElementById('noResults').style.display = count === 0 ? 'block' : 'none';
});

function openProduct(title, price, desc, images) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalPrice').textContent = 'Rs ' + price.toLocaleString();
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalMainImg').src = images[0];

    const thumbs = document.getElementById('modalThumbs');
    thumbs.innerHTML = '';
    images.forEach((src, i) => {
        const img = document.createElement('img');
        img.src = src;
        if (i === 0) img.classList.add('active');
        img.onclick = () => {
            document.getElementById('modalMainImg').src = src;
            thumbs.querySelectorAll('img').forEach(t => t.classList.remove('active'));
            img.classList.add('active');
        };
        thumbs.appendChild(img);
    });

    document.getElementById('modalAddBtn').onclick = () => {
        addToCart(title, price);
        closeProduct();
    };

    document.getElementById('productModal').classList.add('show');
    document.getElementById('modalBackdrop').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeProduct() {
    document.getElementById('productModal').classList.remove('show');
    document.getElementById('modalBackdrop').classList.remove('show');
    document.body.style.overflow = '';
}

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeProduct(); closeCart(); }
});

updateCart();