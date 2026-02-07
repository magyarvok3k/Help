// =====================
// INFO MODAL
// =====================
function openModal(type) {
    const modal = document.getElementById("modal");
    const body = document.getElementById("modal-body");

    if (type === "terulet") {
        body.innerHTML = `<h2>🚗 Kiszállási terület</h2>
        <p>A DU3L2 jelenleg <strong>csak Maros megye</strong> területén vállal kiszállást.</p>
        <p>Elsősorban Marosvásárhely, Szeklerudvarhely és közeli települések.</p>`;
    }

    if (type === "karbantartas") {
        body.innerHTML = `<h2>🛠 Karbantartási árak</h2>
        <div class="price-list">
            <p><span>Fal javítás</span><strong>150–300 RON</strong></p>
            <p><span>TV / polc szerelés</span><strong>180–350 RON</strong></p>
            <p><span>Lámpa csere</span><strong>100–250 RON</strong></p>
        </div>`;
    }

    if (type === "szereles") {
        body.innerHTML = `<h2>🔧 Szerelési árak</h2>
        <div class="price-list">
            <p><span>Polc felszerelés</span><strong>60–150 RON</strong></p>
            <p><span>TV tartó falra</span><strong>180–350 RON</strong></p>
        </div>`;
    }

    if (type === "kert") {
        body.innerHTML = `<h2>🌿 Kerti munkák árak</h2>
        <div class="price-list">
            <p><span>Fűnyírás</span><strong>100–200 RON</strong></p>
            <p><span>Sövénynyírás</span><strong>150–300 RON</strong></p>
        </div>`;
    }

    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// =====================
// ORDER MODAL
// =====================
function openOrderModal(serviceName, event) {
    if(event) event.stopPropagation();
    document.getElementById("order-modal").style.display = "flex";
    document.getElementById("service").value = serviceName;
}

function closeOrderModal() {
    document.getElementById("order-modal").style.display = "none";
}

function submitOrder(event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const phone = document.getElementById("phone").value;
    const city = document.getElementById("city").value;
    const service = document.getElementById("service").value;
    const details = document.getElementById("details").value;

    if(!name || !phone || !city) {
        alert("Kérlek töltsd ki a kötelező mezőket!");
        return;
    }

    let cartText = cart.map(item => `${item.name} x ${item.qty}`).join("\n");

    const mailtoLink = `mailto:berivenciyes@gmail.com?subject=Új rendelés&body=Név: ${name}\nEmail: ${email}\nTelefonszám: ${phone}\nTelepülés: ${city}\nSzolgáltatás: ${service}\nMegjegyzés: ${details}\nKosár tartalma:\n${cartText}`;

    window.location.href = mailtoLink;
    closeOrderModal();
}

// =====================
// KOSÁR LOGIKA
// =====================
let cart = [];

function addToCart(name, price) {
    const found = cart.find(item => item.name === name);
    if(found) found.qty++;
    else cart.push({name, price, qty: 1});
    updateCartDisplay();
    updateCartIcon();
}

function updateCartDisplay() {
    const panel = document.getElementById("cart-items");
    const totalEl = document.getElementById("cart-total");

    if(cart.length === 0){
        panel.innerHTML = "<p>A kosarad üres.</p>";
        totalEl.textContent = "";
        return;
    }

    let html = '';
    let total = 0;
    cart.forEach(item => {
        html += `
            <div class="cart-item">
                ${item.name} x ${item.qty} = ${item.price * item.qty} RON
                <span class="remove-item" onclick="removeItemFromCart('${item.name}')">×</span>
            </div>
        `;
        total += item.price * item.qty;
    });
    panel.innerHTML = html;
    totalEl.innerHTML = `<strong>Összesen: ${total} RON</strong>`;
}

function toggleCart() {
    const panel = document.getElementById("cart-panel");
    if(panel.style.display === "block") panel.style.display = "none";
    else panel.style.display = "block";
}

function updateCartIcon() {
    const count = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cart-count").textContent = count;
}

function removeOneFromCart(name) {
    const item = cart.find(i => i.name === name);
    if(!item) return;

    item.qty--;
    if(item.qty <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    updateCartDisplay();
    updateCartIcon();
}

function removeItemFromCart(name) {
    cart = cart.filter(i => i.name !== name);
    updateCartDisplay();
    updateCartIcon();
}

// =====================
// ORDER GOMB A KOSÁRBAN
// =====================
window.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.innerHTML = `
        <h3>Menü</h3>
        <ul style="list-style:none; padding:0;">
            <li><a href="#szolgaltatasok" class="scroll-link">Szolgáltatások</a></li>
            <li><a href="#cart-panel">Kosár</a></li>
        </ul>
    `;
    document.body.appendChild(sidebar);

    const toggleArrow = document.createElement('div');
    toggleArrow.id = 'toggleArrow';
    toggleArrow.innerHTML = '←';
    document.body.appendChild(toggleArrow);

    let sidebarOpen = true;

    toggleArrow.addEventListener('click', () => {
        sidebarOpen = !sidebarOpen;

        if (sidebarOpen) {
            sidebar.style.left = '0px';
            toggleArrow.style.left = '220px';
            toggleArrow.innerHTML = '←';
            toggleArrow.style.transform = 'rotate(0deg)';
        } else {
            sidebar.style.left = '-220px';
            toggleArrow.style.left = '0px';
            toggleArrow.innerHTML = '→';
            toggleArrow.style.transform = 'rotate(180deg)';
        }
    });

    // 👇 SZÉP LEFELÉ GÖRGÉS
    document.querySelectorAll('.scroll-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const target = document.querySelector(link.getAttribute('href'));
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // opcionális: menü becsukása kattintás után
            sidebarOpen = false;
            sidebar.style.left = '-220px';
            toggleArrow.style.left = '0px';
            toggleArrow.innerHTML = '→';
            toggleArrow.style.transform = 'rotate(180deg)';
        });
    });
});

// =====================
// PROFILE STORAGE
// =====================
function saveProfile(profile) {
    localStorage.setItem("profile", JSON.stringify(profile));
}

function loadProfile() {
    const data = localStorage.getItem("profile");
    return data ? JSON.parse(data) : null;
}

function deleteProfile() {
    localStorage.removeItem("profile");
    cart = [];
    updateCartDisplay();
    updateCartIcon();
    updateUI();
}

// =====================
// LOGIN
// =====================
function openLogin() {
    document.getElementById("login-modal").style.display = "flex";
}

function closeLogin() {
    document.getElementById("login-modal").style.display = "none";
}

function doLogin() {
    const profile = {
        name: document.getElementById("login-name").value,
        email: document.getElementById("login-email").value,
        phone: document.getElementById("login-phone").value,
        city: document.getElementById("login-city").value,
        orders: []
    };

    saveProfile(profile);
    closeLogin();
    updateUI();
}

// =====================
// ORDER → PROFILE
// =====================
function addOrderToProfile(order) {
    const profile = loadProfile();
    if (!profile) return;

    profile.orders.push(order);
    saveProfile(profile);
}

// =====================
// UI UPDATE (NO STYLE)
// =====================
function updateUI() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar) return;

    let header = document.getElementById("profile-header");
    if (!header) {
        header = document.createElement("div");
        header.id = "profile-header";
        sidebar.prepend(header);
    }

    const profile = loadProfile();

    if (profile) {
        header.innerHTML = `
            <p>Szia, ${profile.name}</p>
            <button class="btn-order" onclick="deleteProfile()">Kijelentkezés</button>
        `;
    } else {
        header.innerHTML = `
            <p>Vendég</p>
            <button class="btn-order" onclick="openLogin()">Bejelentkezés</button>
        `;
    }
}

document.addEventListener("DOMContentLoaded", updateUI);

// =====================
// SUBMIT ORDER HOOK
// =====================
const _submitOrder = submitOrder;
submitOrder = function(event) {
    event.preventDefault();

    const city = document.getElementById("city").value;
    const details = document.getElementById("details").value;

    let profile = loadProfile();
    if (!profile) {
        openLogin();
        return;
    }

    addOrderToProfile({
        date: new Date().toLocaleString(),
        items: [...cart],
        city,
        note: details
    });

    cart = [];
    updateCartDisplay();
    updateCartIcon();

    _submitOrder(event);
};
