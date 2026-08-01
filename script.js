/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Production JavaScript v2
=====================================================*/

"use strict";

/*=====================================================
 APPLICATION
=====================================================*/

const APP = {

    loading: false,

    session: null,

    role: null

};

/*=====================================================
 DOM READY
=====================================================*/

document.addEventListener("DOMContentLoaded", () => {

    initializeApp();

});

/*=====================================================
 INITIALIZE
=====================================================*/

function initializeApp() {

    bindEvents();

}

/*=====================================================
 EVENTS
=====================================================*/

function bindEvents() {

    const loginBtn = document.getElementById("loginBtn");

    if (loginBtn) {

        loginBtn.addEventListener("click", login);

    }

    const password = document.getElementById("password");

    if (password) {

        password.addEventListener("keydown", function (e) {

            if (e.key === "Enter") {

                login();

            }

        });

    }

}

/*=====================================================
 LOGIN
=====================================================*/

function login() {

    const userId = document.getElementById("userId").value.trim();

    const password = document.getElementById("password").value.trim();

    if (userId === "") {

        alert("कृपया User ID दर्ज करें।");

        return;

    }

    if (password === "") {

        alert("कृपया Password दर्ज करें।");

        return;

    }

    setLoading(true);

    setTimeout(function () {

        setLoading(false);

        alert("Google Apps Script Login अगले चरण में जोड़ा जाएगा।");

    }, 1200);

}

/*=====================================================
 LOADING
=====================================================*/

function setLoading(status) {

    APP.loading = status;

    const btn = document.getElementById("loginBtn");

    if (!btn) return;

    if (status) {

        btn.disabled = true;

        btn.innerHTML = "Please Wait...";

    } else {

        btn.disabled = false;

        btn.innerHTML = "LOGIN";

    }

}
