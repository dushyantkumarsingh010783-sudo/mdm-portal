/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Admin Dashboard
 admin.js
 Part-1
=====================================================*/

"use strict";

const ADMIN = {

    api: WEB_APP_URL,

    dashboard: null,

    users: []

};

document.addEventListener("DOMContentLoaded", () => {

    initializeAdmin();

});

async function initializeAdmin() {

    bindEvents();

    await loadDashboard();

}

function bindEvents() {

    const logout = document.getElementById("logoutButton");

    if (logout) {

        logout.addEventListener("click", logoutUser);

    }

}

async function loadDashboard() {

    try {

        const result = await apiRequest("getDashboard", {});

        if (!result.status) {

            alert(result.message);

            return;

        }

        ADMIN.dashboard = result.data;

        renderDashboard(result.data);

    } catch (err) {

        console.error(err);

    }

}

function renderDashboard(data) {

    document.getElementById("totalUsers").textContent =
        data.totalUsers || 0;

    document.getElementById("totalNodal").textContent =
        data.totalNodal || 0;

    document.getElementById("totalSchools").textContent =
        data.totalSchools || 0;

    document.getElementById("pendingForms").textContent =
        data.pendingForms || 0;

    document.getElementById("submittedForms").textContent =
        data.submittedForms || 0;

    document.getElementById("todayLogin").textContent =
        data.todayLogin || 0;

}
/*=====================================================
 API REQUEST
=====================================================*/

async function apiRequest(action, payload = {}) {

    try {

        const response = await fetch(ADMIN.api, {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify({

                action: action,

                ...payload

            })

        });

        return await response.json();

    } catch (err) {

        return {

            status: false,

            message: err.message

        };

    }

}

/*=====================================================
 LOAD USERS
=====================================================*/

async function loadUsers() {

    const result = await apiRequest("getUsers");

    if (!result.status) {

        alert(result.message);

        return;

    }

    ADMIN.users = result.data || [];

    renderUsers();

}

/*=====================================================
 RENDER USER TABLE
=====================================================*/

function renderUsers() {

    const tbody = document.getElementById("userTableBody");

    if (!tbody) return;

    tbody.innerHTML = "";

    ADMIN.users.forEach(user => {

        const tr = document.createElement("tr");

        tr.innerHTML = `

            <td>${user[0]}</td>
            <td>${user[3]}</td>
            <td>${user[2]}</td>
            <td>${user[6]}</td>
            <td>${user[7]}</td>

            <td>

                <button onclick="editUser('${user[0]}')">

                    Edit

                </button>

                <button onclick="deleteUserConfirm('${user[0]}')">

                    Delete

                </button>

            </td>

        `;

        tbody.appendChild(tr);

    });

}
/*=====================================================
 CREATE USER
=====================================================*/

async function createUser(){

    const data = {

        userId:
        document.getElementById("newUserId").value.trim(),

        password:
        document.getElementById("newPassword").value.trim(),

        role:
        document.getElementById("newRole").value,

        name:
        document.getElementById("newName").value.trim(),

        nyayaPanchayat:
        document.getElementById("newNyayaPanchayat").value.trim(),

        schoolCode:
        document.getElementById("newSchoolCode").value.trim(),

        schoolName:
        document.getElementById("newSchoolName").value.trim()

    };


    const result = await apiRequest(
        "createUser",
        data
    );


    alert(result.message);


    if(result.status){

        closeUserModal();

        loadUsers();

    }

}


/*=====================================================
 DELETE USER
=====================================================*/

async function deleteUserConfirm(userId){


    if(!confirm("क्या आप इस User को Delete करना चाहते हैं?")){

        return;

    }


    const result = await apiRequest(
        "deleteUser",
        {
            userId:userId
        }
    );


    alert(result.message);


    if(result.status){

        loadUsers();

    }

}


/*=====================================================
 RESET PASSWORD
=====================================================*/

async function resetUserPassword(userId,newPassword){


    const result = await apiRequest(
        "resetPassword",
        {

            userId:userId,

            newPassword:newPassword

        }
    );


    alert(result.message);


}



/*=====================================================
 SEARCH USER
=====================================================*/


const searchBox =
document.getElementById("searchUser");


if(searchBox){

searchBox.addEventListener(
"keyup",
function(){

const keyword=this.value.toLowerCase();


const rows =
document.querySelectorAll(
"#userTableBody tr"
);


rows.forEach(row=>{


if(row.innerText.toLowerCase()
.includes(keyword)){


row.style.display="";


}else{


row.style.display="none";


}


});


});


}
