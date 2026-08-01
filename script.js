/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Production JavaScript
 Login Module Final
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
()=>{

    bindEvents();

});



/*=====================================================
 EVENTS
=====================================================*/

function bindEvents(){


    const loginBtn =
    document.getElementById("loginBtn");


    if(loginBtn){

        loginBtn.addEventListener(
            "click",
            login
        );

    }


    const password =
    document.getElementById("password");


    if(password){

        password.addEventListener(
        "keydown",
        e=>{

            if(e.key==="Enter"){

                login();

            }

        });

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
        await apiRequest(
            "login",
            {

                userId:userId,

                password:password

            }
        );



        setLoading(false);



        if(!result.status){


            alert(
            result.message
            );


            return;

        }



        // Save Session

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
            JSON.stringify(result.data)
        );



        APP.session =
        result.data;



        APP.role =
        result.data.role;



        alert(
        "Login Successful"
        );



        redirectUser(
            result.data.role
        );



    }catch(error){


        setLoading(false);


        alert(
        error.message
        );


    }


}



/*=====================================================
 API REQUEST
=====================================================*/

async function apiRequest(
action,
data={}
){


    const response =
    await fetch(
        WEB_APP_URL,
        {


        method:"POST",


        headers:{

            "Content-Type":
            "application/json"

        },


        body:JSON.stringify({

            action:action,

            ...data

        })


    });



    return await response.json();


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
        "Invalid Role"
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



    if(!btn) return;



    if(status){


        btn.disabled=true;

        btn.innerHTML=
        "Please Wait...";


    }else{


        btn.disabled=false;

        btn.innerHTML=
        "LOGIN";


    }


}
