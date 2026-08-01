/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Admin Dashboard JavaScript
 File : admin.js
 Version : Final
 Part : 1
=====================================================*/

"use strict";


const ADMIN_APP = {

    api : (typeof WEB_APP_URL !== "undefined")
        ? WEB_APP_URL
        : "",

    users : [],

    dashboard : {},

    editUserId : null

};


/*=====================================================
 INITIALIZE
=====================================================*/

document.addEventListener(
"DOMContentLoaded",
function(){

    initAdmin();

});


function initAdmin(){

    bindAdminEvents();

    loadDashboard();

    loadUsers();

}


/*=====================================================
 API REQUEST
=====================================================*/

async function adminAPI(action,data={}){

    try{

        const response = await fetch(
            ADMIN_APP.api,
            {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                action:action,

                ...data

            })

        });


        return await response.json();


    }catch(error){

        return {

            status:false,

            message:error.message

        };

    }

}


/*=====================================================
 LOAD DASHBOARD
=====================================================*/

async function loadDashboard(){

    const result =
    await adminAPI(
        "getDashboard"
    );


    if(!result.status){

        return;

    }


    ADMIN_APP.dashboard =
    result.data;


    setValue(
        "totalUsers",
        result.data.totalUsers
    );


    setValue(
        "totalNodal",
        result.data.totalNodal
    );


    setValue(
        "totalSchools",
        result.data.totalSchools
    );


    setValue(
        "pendingForms",
        result.data.pendingForms
    );


    setValue(
        "submittedForms",
        result.data.submittedForms
    );


    setValue(
        "todayLogin",
        result.data.todayLogin
    );

}



/*=====================================================
 HELPER
=====================================================*/

function setValue(id,value){

    const el =
    document.getElementById(id);


    if(el){

        el.innerText =
        value || 0;

    }

}
/*=====================================================
 LOAD USERS
=====================================================*/

async function loadUsers(){

    const result =
    await adminAPI(
        "getUsers"
    );


    if(!result.status){

        showMessage(
            result.message
        );

        return;

    }


    ADMIN_APP.users =
    result.data || [];


    renderUsers();

}


/*=====================================================
 RENDER USER TABLE
=====================================================*/

function renderUsers(){

    const tbody =
    document.getElementById(
        "userTableBody"
    );


    if(!tbody){

        return;

    }


    tbody.innerHTML="";


    ADMIN_APP.users.forEach(
    user=>{


        const row =
        document.createElement(
            "tr"
        );


        row.innerHTML = `

        <td>${user[0] || ""}</td>

        <td>${user[3] || ""}</td>

        <td>${user[2] || ""}</td>

        <td>${user[6] || ""}</td>

        <td>
            ${user[7] ? "Active" : "Inactive"}
        </td>

        <td>

            <button 
            onclick="openEditUser('${user[0]}')">

            Edit

            </button>


            <button 
            onclick="removeUser('${user[0]}')">

            Delete

            </button>

        </td>

        `;


        tbody.appendChild(row);


    });

}


/*=====================================================
 CREATE USER
=====================================================*/

async function saveNewUser(){


    const userData={


        userId:
        getInput("newUserId"),


        password:
        getInput("newPassword"),


        role:
        getInput("newRole"),


        name:
        getInput("newName"),


        nyayaPanchayat:
        getInput("newNyayaPanchayat"),


        schoolCode:
        getInput("newSchoolCode"),


        schoolName:
        getInput("newSchoolName")


    };


    const result =
    await adminAPI(
        "createUser",
        userData
    );


    showMessage(
        result.message
    );


    if(result.status){

        closeModal(
            "userModal"
        );

        loadUsers();

    }


}


/*=====================================================
 DELETE USER
=====================================================*/

async function removeUser(userId){


    if(
    !confirm(
    "क्या आप इस User को Delete करना चाहते हैं?"
    )
    ){

        return;

    }


    const result =
    await adminAPI(
        "deleteUser",
        {
            userId:userId
        }
    );


    showMessage(
        result.message
    );


    if(result.status){

        loadUsers();

    }

}
/*=====================================================
 EDIT USER
=====================================================*/

function openEditUser(userId){

    const user =
    ADMIN_APP.users.find(
        u => String(u[0]) === String(userId)
    );


    if(!user){

        showMessage(
            "User not found"
        );

        return;

    }


    ADMIN_APP.editUserId =
    userId;


    setInput(
        "editUserId",
        user[0]
    );

    setInput(
        "editName",
        user[3]
    );

    setInput(
        "editRole",
        user[2]
    );

    setInput(
        "editNyayaPanchayat",
        user[4]
    );

    setInput(
        "editSchoolCode",
        user[5]
    );

    setInput(
        "editSchoolName",
        user[6]
    );


    openModal(
        "editUserModal"
    );

}


/*=====================================================
 UPDATE USER
=====================================================*/

async function updateExistingUser(){

    const data={

        userId:
        getInput("editUserId"),

        role:
        getInput("editRole"),

        name:
        getInput("editName"),

        nyayaPanchayat:
        getInput("editNyayaPanchayat"),

        schoolCode:
        getInput("editSchoolCode"),

        schoolName:
        getInput("editSchoolName")

    };


    const result =
    await adminAPI(
        "updateUser",
        data
    );


    showMessage(
        result.message
    );


    if(result.status){

        closeModal(
            "editUserModal"
        );

        loadUsers();

    }

}


/*=====================================================
 SEARCH USER
=====================================================*/

function searchUser(){

    const keyword =
    getInput("searchUser")
    .toLowerCase();


    document
    .querySelectorAll(
        "#userTableBody tr"
    )
    .forEach(row=>{


        row.style.display =
        row.innerText
        .toLowerCase()
        .includes(keyword)
        ?
        ""
        :
        "none";


    });

}


/*=====================================================
 LOGOUT
=====================================================*/

async function adminLogout(){

    const token =
    localStorage.getItem(
        "token"
    );


    if(token){

        await adminAPI(
            "logout",
            {
                token:token
            }
        );

    }


    localStorage.clear();


    window.location.href =
    "index.html";

}


/*=====================================================
 MODAL FUNCTIONS
=====================================================*/

function openModal(id){

    const modal =
    document.getElementById(id);

    if(modal){

        modal.style.display="flex";

    }

}


function closeModal(id){

    const modal =
    document.getElementById(id);

    if(modal){

        modal.style.display="none";

    }

}


/*=====================================================
 HELPERS
=====================================================*/

function getInput(id){

    const el =
    document.getElementById(id);

    return el ?
    el.value.trim()
    :
    "";

}


function setInput(id,value){

    const el =
    document.getElementById(id);

    if(el){

        el.value =
        value || "";

    }

}


function showMessage(msg){

    alert(
        msg || "Completed"
    );

}


/*=====================================================
 EVENT BINDING
=====================================================*/

function bindAdminEvents(){


    const create =
    document.getElementById(
        "btnCreateUser"
    );

    if(create){

        create.onclick =
        ()=>{
            openModal(
                "userModal"
            );
        };

    }


    const save =
    document.getElementById(
        "saveUserBtn"
    );

    if(save){

        save.onclick =
        saveNewUser;

    }


    const update =
    document.getElementById(
        "updateUserBtn"
    );

    if(update){

        update.onclick =
        updateExistingUser;

    }


    const logout =
    document.getElementById(
        "logoutButton"
    );


    if(logout){

        logout.onclick =
        adminLogout;

    }


    const search =
    document.getElementById(
        "searchUser"
    );


    if(search){

        search.onkeyup =
        searchUser;

    }

}
