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
