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
        html += `<p>${item.name} x ${item.qty} = ${item.price * item.qty} RON</p>`;
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
function openOrderFromCart() {
    if(cart.length === 0){
        alert("A kosarad üres!");
        return;
    }
    openOrderModal("", null);
}

// =====================
// OLDALSÓ MENÜ – NYÍL MINDIG LÁTSZIK, TOGGLE
// =====================
window.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.createElement('div');
    sidebar.id = 'sidebar';
    sidebar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 220px;
        background: #020617;
        color: #e5e7eb;
        padding: 2rem;
        display: block;
        z-index: 999;
        overflow-y: auto;
        transition: all 0.3s ease;
    `;

    sidebar.innerHTML = `
        <h3>Menü</h3>
        <ul style="list-style:none; padding:0;">
            <li><a href="#szolgaltatasok" style="color:#38bdf8; text-decoration:none;">Szolgáltatások</a></li>
            <li><a href="#cart-panel" style="color:#38bdf8; text-decoration:none;">Kosár</a></li>
        </ul>
    `;
    document.body.appendChild(sidebar);

    // Nyíl gomb
    const toggleArrow = document.createElement('div');
    toggleArrow.id = 'toggleArrow';
    toggleArrow.innerHTML = '→';
    toggleArrow.style.cssText = `
        position: fixed;
        top: 20px;
        left: 230px;
        background:#3b82f6;
        color:white;
        border-radius:50%;
        width:30px;
        height:30px;
        display:flex;
        justify-content:center;
        align-items:center;
        cursor:pointer;
        z-index:1000;
        font-weight:bold;
        font-size:1.2rem;
        transition: left 0.3s ease;
    `;

    let sidebarOpen = true;

    toggleArrow.addEventListener('click', () => {
        sidebarOpen = !sidebarOpen;

        if (sidebarOpen) {
            sidebar.style.left = '220px';
            toggleArrow.style.left = '230px';
            toggleArrow.innerHTML = '→';
        } else {
            sidebar.style.left = '-220px';
            toggleArrow.style.left = '0px';
            toggleArrow.innerHTML = '←';
        }
    });
});

// =====================
// MENU FIX (NINCS STÍLUS)
// =====================
let sidebarOpen = true;

const menuFix = setInterval(() => {
    const sidebar = document.getElementById("sidebar");
    const toggleArrow = document.getElementById("toggleArrow");

    if (sidebar && toggleArrow) {
        clearInterval(menuFix);

        toggleArrow.onclick = () => {
            sidebarOpen = !sidebarOpen;
            sidebar.style.width = sidebarOpen ? "220px" : "0px";
            toggleArrow.style.left = sidebarOpen ? "220px" : "0px";
        };
    }
}, 50);

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
