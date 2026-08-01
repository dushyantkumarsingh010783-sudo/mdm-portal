/*=====================================================
 SMART FORM ENTERPRISE v5.0
 Nodal Dashboard Controller
 File : nodal.js
 Version : Production Part-1
=====================================================*/

"use strict";

/*=====================================================
 APPLICATION STATE
=====================================================*/

const NODAL = {

    token : "",

    profile : null,

    dashboard : null,

    schools : [],

    currentPage : 1,

    pageSize : 10

};


/*=====================================================
 DOM READY
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeNodal

);


/*=====================================================
 INITIALIZE
=====================================================*/

async function initializeNodal(){

    try{

        NODAL.token =

        localStorage.getItem("token");

        if(!NODAL.token){

            window.location.href="index.html";

            return;

        }

        bindEvents();

        await loadProfile();

        await loadDashboard();

        await loadSchools();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}


/*=====================================================
 EVENTS
=====================================================*/

function bindEvents(){

    document
    .getElementById("logoutBtn")
    .addEventListener(
        "click",
        logout
    );

    document
    .getElementById("searchBtn")
    .addEventListener(
        "click",
        searchSchool
    );

    document
    .getElementById("refreshBtn")
    .addEventListener(
        "click",
        refreshDashboard
    );

}


/*=====================================================
 LOAD PROFILE
=====================================================*/

async function loadProfile(){

    const url =

        WEB_APP_URL

        +

        "?action=nodalProfile"

        +

        "&token="

        +

        encodeURIComponent(

            NODAL.token

        );

    const response =
    await fetch(url);

    const result =
    await response.json();

    if(!result.status){

        throw new Error(

            result.message

        );

    }

    NODAL.profile =
    result.data;

    document
    .getElementById("userInfo")
    .innerHTML =

    "<b>Name :</b> "

    +

    result.data.name

    +

    "<br><b>Nyay Panchayat :</b> "

    +

    result.data.nyayPanchayat;

}


/*=====================================================
 LOAD DASHBOARD
=====================================================*/

async function loadDashboard(){

    const url =

        WEB_APP_URL

        +

        "?action=nodalDashboard"

        +

        "&token="

        +

        encodeURIComponent(

            NODAL.token

        );

    const response =
    await fetch(url);

    const result =
    await response.json();

    if(!result.status){

        throw new Error(

            result.message

        );

    }

    NODAL.dashboard =
    result.data;

    document.getElementById(
        "assignedSchools"
    ).textContent =
    result.data.assignedSchools;

    document.getElementById(
        "submittedResponses"
    ).textContent =
    result.data.submittedResponses;

    document.getElementById(
        "pendingSchools"
    ).textContent =
    result.data.pendingSchools;

    document.getElementById(
        "progressPercent"
    ).textContent =
    result.data.progress + "%";
/*=====================================================
 LOAD SCHOOL LIST
=====================================================*/

async function loadSchools(){

    const url =

        WEB_APP_URL

        +

        "?action=assignedSchools"

        +

        "&token="

        +

        encodeURIComponent(

            NODAL.token

        );

    showLoading(true);

    const response = await fetch(url);

    const result = await response.json();

    showLoading(false);

    if(!result.status){

        throw new Error(result.message);

    }

    NODAL.schools = result.data.schools;

    renderSchoolTable(NODAL.schools);

}


/*=====================================================
 RENDER SCHOOL TABLE
=====================================================*/

function renderSchoolTable(list){

    const tbody =

    document.getElementById(

        "schoolTableBody"

    );

    tbody.innerHTML="";

    if(list.length===0){

        tbody.innerHTML=

        "<tr><td colspan='5'>No School Found</td></tr>";

        return;

    }

    list.forEach(function(item,index){

        tbody.innerHTML +=

        "<tr>"

        +

        "<td>"+(index+1)+"</td>"

        +

        "<td>"+item.schoolName+"</td>"

        +

        "<td>"+item.udise+"</td>"

        +

        "<td>"+item.status+"</td>"

        +

        "<td>"

        +

        "<button "

        +

        "onclick='openEntry(\""

        +

        item.schoolId

        +

        "\")'>"

        +

        "ENTRY"

        +

        "</button>"

        +

        "</td>"

        +

        "</tr>";

    });

}


/*=====================================================
 SEARCH SCHOOL
=====================================================*/

function searchSchool(){

    const keyword =

    document

    .getElementById(

        "searchSchool"

    )

    .value

    .toLowerCase()

    .trim();

    if(keyword===""){

        renderSchoolTable(

            NODAL.schools

        );

        return;

    }

    const result =

    NODAL.schools.filter(function(item){

        return (

            item.schoolName

            .toLowerCase()

            .includes(keyword)

            ||

            item.udise

            .toLowerCase()

            .includes(keyword)

        );

    });

    renderSchoolTable(result);

}


/*=====================================================
 REFRESH
=====================================================*/

async function refreshDashboard(){

    await loadDashboard();

    await loadSchools();

}


/*=====================================================
 OPEN ENTRY
=====================================================*/

function openEntry(schoolId){

    alert(

        "School Entry Module\n\n"

        +

        "School ID : "

        +

        schoolId

    );

}


/*=====================================================
 LOADING PANEL
=====================================================*/

function showLoading(status){

    const panel =

    document.getElementById(

        "loadingPanel"

    );

    if(!panel){

        return;

    }

    panel.style.display =

    status

    ?

    "flex"

    :

    "none";

}
}
/*=====================================================
 PAGINATION
=====================================================*/

function nextPage(){

    const totalPages =

    Math.ceil(

        NODAL.schools.length /

        NODAL.pageSize

    );

    if(

        NODAL.currentPage < totalPages

    ){

        NODAL.currentPage++;

        renderCurrentPage();

    }

}


function previousPage(){

    if(

        NODAL.currentPage > 1

    ){

        NODAL.currentPage--;

        renderCurrentPage();

    }

}


function renderCurrentPage(){

    const start =

    (

        NODAL.currentPage - 1

    )

    *

    NODAL.pageSize;

    const end =

    start +

    NODAL.pageSize;

    const pageData =

    NODAL.schools.slice(

        start,

        end

    );

    renderSchoolTable(

        pageData

    );

    document.getElementById(

        "pageInfo"

    ).textContent =

    "Page "

    +

    NODAL.currentPage;

}


/*=====================================================
 ENTRY MODAL
=====================================================*/

function openEntry(

schoolId

){

    document.getElementById(

        "entryModal"

    ).style.display="block";

    loadSchoolDetails(

        schoolId

    );

}


function closeEntry(){

    document.getElementById(

        "entryModal"

    ).style.display="none";

}


/*=====================================================
 LOAD SCHOOL DETAILS
=====================================================*/

async function loadSchoolDetails(

schoolId

){

    const url =

        WEB_APP_URL

        +

        "?action=schoolDetails"

        +

        "&token="

        +

        encodeURIComponent(

            NODAL.token

        )

        +

        "&schoolId="

        +

        encodeURIComponent(

            schoolId

        );

    const response =

    await fetch(url);

    const result =

    await response.json();

    if(

        !result.status

    ){

        alert(

            result.message

        );

        return;

    }

    document.getElementById(

        "formContainer"

    ).innerHTML =

    "<h3>"

    +

    result.data.schoolName

    +

    "</h3>"

    +

    "<p>UDISE : "

    +

    result.data.udise

    +

    "</p>";

}


/*=====================================================
 LOGOUT
=====================================================*/

async function logout(){

    if(

        !confirm(

            "Logout ?"

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

                NODAL.token

            )

        );

    }

    catch(e){

        console.log(e);

    }

    localStorage.clear();

    window.location.href =

    "index.html";

}


/*=====================================================
 ERROR HANDLER
=====================================================*/

window.onerror = function(

message,

source,

line,

column,

error

){

    console.error(

        message,

        source,

        line,

        column

    );

    alert(

        "Application Error\n\n"

        +

        message

    );

};
/*=====================================================
 FORM SUBMIT
=====================================================*/

async function submitEntry(){

    try{

        const formData = collectFormData();

        if(!validateForm(formData)){
            return;
        }

        showLoading(true);

        const response = await fetch(

            WEB_APP_URL,

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body:JSON.stringify({

                    action:"saveResponse",

                    token:NODAL.token,

                    data:formData

                })

            }

        );

        const result = await response.json();

        showLoading(false);

        if(!result.status){

            alert(result.message);

            return;

        }

        alert("Response Saved Successfully");

        closeEntry();

        await refreshDashboard();

    }

    catch(error){

        showLoading(false);

        console.error(error);

        alert(error.message);

    }

}


/*=====================================================
 COLLECT FORM DATA
=====================================================*/

function collectFormData(){

    return{

        schoolId :

        document.getElementById("schoolId").value,

        schoolName :

        document.getElementById("schoolName").value,

        udise :

        document.getElementById("udise").value,

        month :

        document.getElementById("month").value,

        year :

        document.getElementById("year").value,

        students :

        Number(

            document.getElementById("students").value

        ),

        workingDays :

        Number(

            document.getElementById("workingDays").value

        ),

        mealDays :

        Number(

            document.getElementById("mealDays").value

        ),

        wheat :

        Number(

            document.getElementById("wheat").value

        ),

        rice :

        Number(

            document.getElementById("rice").value

        ),

        fruitDays :

        Number(

            document.getElementById("fruitDays").value

        ),

        fruitQty :

        Number(

            document.getElementById("fruitQty").value

        )

    };

}


/*=====================================================
 FORM VALIDATION
=====================================================*/

function validateForm(data){

    if(!data.month){

        alert("Select Month");

        return false;

    }

    if(!data.year){

        alert("Select Year");

        return false;

    }

    if(data.students<=0){

        alert("Enter Students");

        return false;

    }

    if(data.workingDays<=0){

        alert("Enter Working Days");

        return false;

    }

    return true;

}


/*=====================================================
 RESET FORM
=====================================================*/

function resetEntryForm(){

    document
    .querySelectorAll(

        "#formContainer input"

    )

    .forEach(function(item){

        item.value="";

    });

}
/*=====================================================
 AUTO SESSION CHECK
=====================================================*/

function startSessionMonitor(){

    setInterval(async function(){

        try{

            const response = await fetch(

                WEB_APP_URL +

                "?action=nodalProfile&token=" +

                encodeURIComponent(NODAL.token)

            );

            const result = await response.json();

            if(!result.status){

                alert("Session Expired");

                localStorage.clear();

                window.location.href="index.html";

            }

        }

        catch(error){

            console.log(error);

        }

    },300000);

}


/*=====================================================
 AUTO REFRESH DASHBOARD
=====================================================*/

function startAutoRefresh(){

    setInterval(async function(){

        try{

            await loadDashboard();

        }

        catch(error){

            console.log(error);

        }

    },30000);

}


/*=====================================================
 NETWORK STATUS
=====================================================*/

window.addEventListener(

    "offline",

    function(){

        alert(

            "Internet Connection Lost."

        );

    }

);

window.addEventListener(

    "online",

    function(){

        refreshDashboard();

    }

);


/*=====================================================
 INITIALIZE SERVICES
=====================================================*/

function initializeServices(){

    startSessionMonitor();

    startAutoRefresh();

}


/*=====================================================
 FORMAT NUMBER
=====================================================*/

function formatNumber(value){

    return Number(value).toLocaleString("en-IN");

}


/*=====================================================
 SUCCESS MESSAGE
=====================================================*/

function showSuccess(message){

    alert(message);

}


/*=====================================================
 ERROR MESSAGE
=====================================================*/

function showError(message){

    alert(message);

}


/*=====================================================
 CONFIRM DIALOG
=====================================================*/

function confirmAction(message){

    return confirm(message);

}


/*=====================================================
 PAGE LOAD COMPLETE
=====================================================*/

window.addEventListener(

    "load",

    function(){

        initializeServices();

    }

);
