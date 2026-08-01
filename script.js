/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Production JavaScript
 File : script.js
 Version : Final
=====================================================*/


"use strict";


const APP = {

    loading:false,

    session:null,

    role:null

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
        await apiRequest({

            action:"login",

            userId:userId,

            password:password

        });



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
 API REQUEST
=====================================================*/

async function apiRequest(data){


    const response =
    await fetch(

        WEB_APP_URL,

        {


            method:"POST",


            headers:{

                "Content-Type":
                "text/plain;charset=utf-8"

            },


            body:

            JSON.stringify(data)


        }

    );



    const text =
    await response.text();



    try{


        return JSON.parse(text);


    }

    catch(e){


        throw new Error(
            text
        );


    }


}





/*=====================================================
 ROLE REDIRECT
=====================================================*/

function redirectUser(role){


    role =
    String(role)
    .toUpperCase();



    switch(role){


        case "ADMIN":


            window.location.href =
            "admin.html";


            break;



        case "NODAL":


            window.location.href =
            "nodal.html";


            break;



        case "SCHOOL":


            window.location.href =
            "school.html";


            break;



        default:


            alert(
            "Role Not Defined"
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
