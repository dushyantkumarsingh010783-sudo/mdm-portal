/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Admin Dashboard Controller
 File : admin.js
 Version : Production Final
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

    ADMIN.token = localStorage.getItem("token");

    if(!ADMIN.token){

        window.location.href="index.html";

        return;

    }

    try{

        loadUserInfo();

        await loadDashboard();

        bindEvents();

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

    const user =
    JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    ADMIN.user=user;

    const div=
    document.getElementById("userInfo");

    if(!div){

        return;

    }

    div.innerHTML=
    `
    <b>Name :</b> ${user.name || "-"}<br>
    <b>User ID :</b> ${user.userId || "-"}<br>
    <b>Role :</b> ${user.role || "-"}
    `;

}


/*=====================================================
 LOAD DASHBOARD
=====================================================*/

async function loadDashboard(){

    const url=

        WEB_APP_URL

        +

        "?action=dashboard"

        +

        "&token="

        +

        encodeURIComponent(
            ADMIN.token
        );


    const response=
    await fetch(url);

    const result=
    await response.json();


    if(!result.status){

        throw new Error(

            result.message

        );

    }


    updateDashboard(

        result.data

    );

}


/*=====================================================
 UPDATE DASHBOARD
=====================================================*/

function updateDashboard(data){

    setText(

        "schoolCount",

        data.totalSchools || 0

    );


    setText(

        "responseCount",

        data.totalResponses || 0

    );


    setText(

        "userCount",

        data.activeUsers || 0

    );

}


/*=====================================================
 SET TEXT
=====================================================*/

function setText(

id,

value

){

    const el=

    document.getElementById(id);

    if(el){

        el.textContent=value;

    }

}


/*=====================================================
 EVENTS
=====================================================*/

function bindEvents(){

    const btn=

    document.getElementById(

        "logoutBtn"

    );

    if(btn){

        btn.addEventListener(

            "click",

            logout

        );

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

        const url=

        WEB_APP_URL

        +

        "?action=logout"

        +

        "&token="

        +

        encodeURIComponent(

            ADMIN.token

        );


        await fetch(url);

    }

    catch(e){

        console.log(e);

    }


    localStorage.clear();

    window.location.href="index.html";

}
