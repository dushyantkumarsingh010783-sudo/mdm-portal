/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Production JavaScript
 Part-1 : Login Events
=====================================================*/

"use strict";

/*=====================================================
 APPLICATION
=====================================================*/

const APP = {

    loading : false,

    session : null,

    role : null

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

function initializeApp(){

    bindEvents();

}

/*=====================================================
 EVENTS
=====================================================*/

function bindEvents(){

    const loginBtn = document.getElementById("loginBtn");

    if(loginBtn){

        loginBtn.addEventListener("click", login);

    }

    const password = document.getElementById("password");

    if(password){

        password.addEventListener("keydown", function(e){

            if(e.key==="Enter"){

                login();

            }

        });

    }

}

/*=====================================================
 LOGIN
=====================================================*/

function login(){

    const userId=document.getElementById("userId").value.trim();

    const password=document.getElementById("password").value.trim();

    if(userId===""){

        alert("User ID दर्ज करें");

        return;

    }

    if(password===""){

        alert("Password दर्ज करें");

        return;

    }

    alert("Login API अगले Part में जोड़ी जाएगी.");

}
