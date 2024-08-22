function _0xb17b(_0x275a9c, _0x1a8240) { const _0x1ba8b6 = _0x1ba8(); return _0xb17b = function (_0xb17b30, _0x206417) { _0xb17b30 = _0xb17b30 - 0x17c; let _0x2b8957 = _0x1ba8b6[_0xb17b30]; return _0x2b8957; }, _0xb17b(_0x275a9c, _0x1a8240); } const _0x113d48 = _0xb17b; function _0x1ba8() { const _0x22b6c0 = ['12FTsVNF', '5486723DJYjus', '14cHIRXV', 'm.sordo', '140498', '715977tMhjCg', 'p.lopez', '3725QQoiyt', '5225106rEAofq', 's.lloret', '8yMNYzg', 'a.garcia', 'PCLVJ2024_', 'p.marquez', 'pedropclavila', 'v.moya', '1860rhzoLt', 'proteccioncivil1990', 'n.martinez', 'y.navarro', 'j.ruiz', '1012470KRoRcl', 'PCvillajoyosa22', 'luiset1000', 'prote123', 'j.molina', 'Almarcha34', '5062561TYeKjB', 'y.real', 'j.climent', 'l.molto', '391977vTKFIU', 'atletismo123', '36hfCbld', 'VoluN24']; _0x1ba8 = function () { return _0x22b6c0; }; return _0x1ba8(); } (function (_0x5c5e3c, _0x591dd3) { const _0x2b3fc7 = _0xb17b, _0x42e4d4 = _0x5c5e3c(); while (!![]) { try { const _0x3a7ff2 = parseInt(_0x2b3fc7(0x192)) / 0x1 + -parseInt(_0x2b3fc7(0x18f)) / 0x2 * (-parseInt(_0x2b3fc7(0x189)) / 0x3) + parseInt(_0x2b3fc7(0x19d)) / 0x4 * (-parseInt(_0x2b3fc7(0x194)) / 0x5) + -parseInt(_0x2b3fc7(0x195)) / 0x6 + -parseInt(_0x2b3fc7(0x185)) / 0x7 * (parseInt(_0x2b3fc7(0x197)) / 0x8) + -parseInt(_0x2b3fc7(0x18b)) / 0x9 * (-parseInt(_0x2b3fc7(0x17f)) / 0xa) + -parseInt(_0x2b3fc7(0x18e)) / 0xb * (-parseInt(_0x2b3fc7(0x18d)) / 0xc); if (_0x3a7ff2 === _0x591dd3) break; else _0x42e4d4['push'](_0x42e4d4['shift']()); } catch (_0x4bcd46) { _0x42e4d4['push'](_0x42e4d4['shift']()); } } }(_0x1ba8, 0x90fd0)); const USERS = [{ 'username': _0x113d48(0x17d), 'password': _0x113d48(0x182) }, { 'username': _0x113d48(0x19a), 'password': 'J100' }, { 'username': _0x113d48(0x196), 'password': _0x113d48(0x180) }, { 'username': _0x113d48(0x183), 'password': 'prote123' }, { 'username': _0x113d48(0x193), 'password': _0x113d48(0x19b) }, { 'username': _0x113d48(0x17c), 'password': _0x113d48(0x19e) }, { 'username': _0x113d48(0x19c), 'password': _0x113d48(0x199) }, { 'username': _0x113d48(0x187), 'password': _0x113d48(0x18a) }, { 'username': 'p.peinado', 'password': _0x113d48(0x184) }, { 'username': _0x113d48(0x186), 'password': 'Real999' }, { 'username': _0x113d48(0x198), 'password': _0x113d48(0x18c) }, { 'username': _0x113d48(0x190), 'password': _0x113d48(0x191) }, { 'username': _0x113d48(0x17e), 'password': 'Lavila1994' }, { 'username': _0x113d48(0x188), 'password': _0x113d48(0x181) }];

function login(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        localStorage.setItem("authToken", "loggedIn");
        localStorage.setItem("loggedUser", username); // Guardar el nombre de usuario
        window.location.href = "index.html";
    } else {
        document.getElementById("error-message").textContent = "Usuario o contraseña incorrectos.";
    }
}


function checkAuth() {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("authToken");
    window.location.href = "/login.html";
}


// Verificar la autenticación cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Solo verifica la autenticación si no estás en la página de login
    if (!window.location.href.includes('login.html')) {
        checkAuth();
    }
});