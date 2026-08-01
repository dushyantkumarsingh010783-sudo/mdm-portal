/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Admin Dashboard Controller
 File : admin.js
 Version : Final
=====================================================*/


"use strict";


const ADMIN_APP = {

    user:null,

    token:null

};





/*=====================================================
 PAGE LOAD
=====================================================*/


document.addEventListener(
"DOMContentLoaded",
function(){

    initializeAdmin();

});





/*=====================================================
 INITIALIZE
=====================================================*/


function initializeAdmin(){


    ADMIN_APP.token =
    localStorage.getItem("token");



    const user =
    localStorage.getItem("user");



    if(!ADMIN_APP.token || !user){


        window.location.href =
        "index.html";


        return;

    }



    ADMIN_APP.user =
    JSON.parse(user);



    loadUser();



    bindAdminEvents();


}






/*=====================================================
 LOAD USER
=====================================================*/


function loadUser(){


    const box =
    document.getElementById(
        "userInfo"
    );



    if(!box){

        return;

    }



    box.innerHTML =

    `
    <p>
    <b>Name:</b>
    ${ADMIN_APP.user.name || ""}
    </p>


    <p>
    <b>Role:</b>
    ${ADMIN_APP.user.role || ""}
    </p>


    <p>
    <b>User ID:</b>
    ${ADMIN_APP.user.userId || "admin"}
    </p>
    `;


}






/*=====================================================
 EVENTS
=====================================================*/


function bindAdminEvents(){


    const logout =
    document.getElementById(
        "logoutBtn"
    );



    if(logout){


        logout.addEventListener(
            "click",
            logoutUser
        );


    }


}






/*=====================================================
 LOGOUT
=====================================================*/


function logoutUser(){


    localStorage.removeItem(
        "token"
    );


    localStorage.removeItem(
        "role"
    );


    localStorage.removeItem(
        "user"
    );



    alert(
    "Logout Successful"
    );



    window.location.href =
    "index.html";


}
