/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Admin Dashboard Controller
 File : admin.js
 Version : Production Debug v5.1
=====================================================*/

"use strict";

/*=====================================================
 APPLICATION
=====================================================*/

const ADMIN = {

    token : "",

    user  : null

};


/*=====================================================
 DOM READY
=====================================================*/

document.addEventListener(
    "DOMContentLoaded",
    initializeDashboard
);


/*=====================================================
 INITIALIZE
=====================================================*/

async function initializeDashboard(){

    try{

        ADMIN.token = localStorage.getItem("token");

        if(!ADMIN.token){

            alert("Session Expired");

            window.location.href="index.html";

            return;

        }

        loadUserInfo();

        bindEvents();

        await loadDashboard();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}


/*=====================================================
 USER INFO
=====================================================*/

function loadUserInfo(){

    const user = JSON.parse(

        localStorage.getItem("user") || "{}"

    );

    ADMIN.user = user;

    const div = document.getElementById("userInfo");

    if(!div){

        return;

    }

    div.innerHTML =

    "<b>Name:</b> " + (user.name || "-")

    + "<br>"

    + "<b>Role:</b> " + (user.role || "-")

    + "<br>"

    + "<b>User ID:</b> " + (user.userId || "-");

}


/*=====================================================
 LOAD DASHBOARD
=====================================================*/

async function loadDashboard(){

    try{

        const url =

            WEB_APP_URL

            +

            "?action=dashboard"

            +

            "&token="

            +

            encodeURIComponent(

                ADMIN.token

            );

        console.log("Dashboard URL");

        console.log(url);

        const response = await fetch(

            url,

            {

                method:"GET"

            }

        );

        console.log("HTTP Status");

        console.log(response.status);

        const result = await response.json();

        console.log("Dashboard Response");

        console.log(result);

        if(!result.status){

            throw new Error(

                result.message

            );

        }

        updateDashboard(

            result.data

        );

    }

    catch(error){

        console.error(error);

        alert(

            "Dashboard Load Failed\n\n"

            +

            error.message

        );

    }

}


/*=====================================================
 UPDATE DASHBOARD
=====================================================*/

function updateDashboard(data){

    console.log("Updating Dashboard");

    console.log(data);

    document.getElementById(

        "schoolCount"

    ).textContent =

    data.totalSchools || 0;



    document.getElementById(

        "responseCount"

    ).textContent =

    data.totalResponses || 0;



    document.getElementById(

        "userCount"

    ).textContent =

    data.activeUsers || 0;

}


/*=====================================================
 EVENTS
=====================================================*/

function bindEvents(){

    const btn =

    document.getElementById(

        "logoutBtn"

    );

    if(btn){

        btn.onclick = logout;

    }

}


/*=====================================================
 LOGOUT
=====================================================*/

async function logout(){

    if(

        !confirm(

            "क्या आप Logout करना चाहते हैं?"

        )

    ){

        return;

    }

    try{

        await fetch(

            WEB_APP_URL

            +

            "?action=logout"

            +

            "&token="

            +

            encodeURIComponent(

                ADMIN.token

            )

        );

    }

    catch(error){

        console.log(error);

    }

    localStorage.clear();

    window.location.href="index.html";

}
