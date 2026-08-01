/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Login Controller
 File : script.js
 Version : GET API Final
=====================================================*/


"use strict";


const APP = {

    loading:false,

    session:null

};



/*=====================================================
 DOM READY
=====================================================*/

document.addEventListener(
"DOMContentLoaded",
function(){

    bindEvents();

});



/*=====================================================
 EVENTS
=====================================================*/

function bindEvents(){


    const btn =
    document.getElementById(
        "loginBtn"
    );


    if(btn){

        btn.addEventListener(
            "click",
            login
        );

    }



    const password =
    document.getElementById(
        "password"
    );


    if(password){

        password.addEventListener(
            "keydown",
            function(e){

                if(e.key==="Enter"){

                    login();

                }

            }
        );

    }


}



/*=====================================================
 LOGIN
=====================================================*/

async function login(){


    const userId =
    document
    .getElementById("userId")
    .value
    .trim();



    const password =
    document
    .getElementById("password")
    .value
    .trim();



    if(!userId){

        alert(
        "कृपया User ID दर्ज करें।"
        );

        return;

    }



    if(!password){

        alert(
        "कृपया Password दर्ज करें।"
        );

        return;

    }



    setLoading(true);



    try{


        const result =
        await loginAPI(
            userId,
            password
        );



        setLoading(false);



        if(!result.status){


            alert(
            result.message
            );


            return;

        }



        localStorage.setItem(

            "token",

            result.data.token

        );



        localStorage.setItem(

            "role",

            result.data.role

        );



        localStorage.setItem(

            "user",

            JSON.stringify(
                result.data
            )

        );



        alert(
        "Login Successful"
        );



        redirectUser(
            result.data.role
        );



    }

    catch(error){


        setLoading(false);


        alert(

        "Server Connection Error : "
        +
        error.message

        );


    }


}





/*=====================================================
 GET LOGIN API
=====================================================*/

async function loginAPI(
userId,
password
){


    const url =

    WEB_APP_URL

    +
    "?action=login"

    +
    "&userId="

    +
    encodeURIComponent(userId)

    +
    "&password="

    +
    encodeURIComponent(password);



    const response =

    await fetch(url);



    const text =

    await response.text();



    return JSON.parse(text);


}





/*=====================================================
 ROLE REDIRECT
=====================================================*/

function redirectUser(role){


    role =

    String(role)
    .toUpperCase();



    if(role==="ADMIN"){


        window.location.href =
        "admin.html";


    }

    else if(role==="NODAL"){


        window.location.href =
        "nodal.html";


    }

    else if(role==="SCHOOL"){


        window.location.href =
        "school.html";


    }

    else{


        alert(
        "Invalid User Role"
        );


    }


}





/*=====================================================
 LOADING
=====================================================*/

function setLoading(status){


    APP.loading=status;



    const btn =

    document.getElementById(
        "loginBtn"
    );



    if(!btn){

        return;

    }



    if(status){


        btn.disabled=true;

        btn.innerHTML=
        "Please Wait...";


    }

    else{


        btn.disabled=false;

        btn.innerHTML=
        "LOGIN";


    }


}
