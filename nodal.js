/*=====================================================
 SMART FORM ENTERPRISE v6.0
 Nodal Dashboard Controller
 File : nodal.js
 Version : Production Final
=====================================================*/

"use strict";

/*=====================================================
 CONFIGURATION
=====================================================*/

const NODAL = {

    token : "",

    profile : {},

    dashboard : {},

    schools : [],

    filteredSchools : [],

    currentPage : 1,

    pageSize : 10,

    totalPages : 1

};


/*=====================================================
 PAGE LOAD
=====================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initNodal

);


/*=====================================================
 INITIALIZE
=====================================================*/

async function initNodal(){

    try{

        NODAL.token =

        localStorage.getItem("token");

        if(!NODAL.token){

            window.location.href="index.html";

            return;

        }

        registerEvents();

        showLoading(true);

        await loadProfile();

        await loadDashboard();

        await loadAssignedSchools();

        initializeServices();

        showLoading(false);

    }

    catch(error){

        showLoading(false);

        console.error(error);

        alert(error.message);

    }

}


/*=====================================================
 EVENTS
=====================================================*/

function registerEvents(){

    const logoutBtn =

    document.getElementById("logoutBtn");

    if(logoutBtn){

        logoutBtn.onclick = logout;

    }

    const refreshBtn =

    document.getElementById("refreshBtn");

    if(refreshBtn){

        refreshBtn.onclick = refreshDashboard;

    }

    const searchBtn =

    document.getElementById("searchBtn");

    if(searchBtn){

        searchBtn.onclick = searchSchool;

    }

    const searchBox =

    document.getElementById("searchSchool");

    if(searchBox){

        searchBox.addEventListener(

            "keyup",

            searchSchool

        );

    }

}
/*=====================================================
 LOAD PROFILE
=====================================================*/

async function loadProfile(){

    const response = await fetch(

        WEB_APP_URL +

        "?action=nodalProfile&token=" +

        encodeURIComponent(NODAL.token)

    );

    const result = await response.json();

    if(!result.status){

        throw new Error(result.message);

    }

    NODAL.profile = result.data;

    const userInfo =

    document.getElementById("userInfo");

    if(userInfo){

        userInfo.innerHTML =

        "<b>Name :</b> "

        + result.data.name +

        "<br><b>User ID :</b> "

        + result.data.userId +

        "<br><b>Nyay Panchayat :</b> "

        + result.data.nyayPanchayat;

    }

}


/*=====================================================
 LOAD DASHBOARD
=====================================================*/

async function loadDashboard(){

    const response = await fetch(

        WEB_APP_URL +

        "?action=nodalDashboard&token=" +

        encodeURIComponent(NODAL.token)

    );

    const result = await response.json();

    if(!result.status){

        throw new Error(result.message);

    }

    NODAL.dashboard = result.data;

    setText(

        "assignedSchools",

        result.data.assignedSchools

    );

    setText(

        "submittedResponses",

        result.data.submittedResponses

    );

    setText(

        "pendingSchools",

        result.data.pendingSchools

    );

    setText(

        "progressPercent",

        result.data.progress + "%"

    );

}


/*=====================================================
 REFRESH DASHBOARD
=====================================================*/

async function refreshDashboard(){

    showLoading(true);

    try{

        await loadDashboard();

        await loadAssignedSchools();

    }

    finally{

        showLoading(false);

    }

}


/*=====================================================
 LOAD ASSIGNED SCHOOLS
=====================================================*/

async function loadAssignedSchools(){

    const response = await fetch(

        WEB_APP_URL +

        "?action=assignedSchools&token=" +

        encodeURIComponent(NODAL.token)

    );

    const result = await response.json();

    if(!result.status){

        throw new Error(result.message);

    }

    /*-----------------------------------------
      API Compatibility
    -----------------------------------------*/

    if(Array.isArray(result.data)){

        NODAL.schools = result.data;

    }

    else if(

        result.data &&

        Array.isArray(result.data.schools)

    ){

        NODAL.schools =

        result.data.schools;

    }

    else{

        NODAL.schools = [];

    }

    NODAL.filteredSchools =

    [...NODAL.schools];

    NODAL.currentPage = 1;

    renderCurrentPage();

}


/*=====================================================
 SET TEXT
=====================================================*/

function setText(id,value){

    const element =

    document.getElementById(id);

    if(element){

        element.textContent = value;

    }

}
/*=====================================================
 SCHOOL TABLE
=====================================================*/

function renderSchoolTable(list){

    const tbody = document.getElementById("schoolTableBody");

    if(!tbody){
        return;
    }

    tbody.innerHTML = "";

    if(list.length===0){

        tbody.innerHTML =

        "<tr>" +

        "<td colspan='6' style='text-align:center'>" +

        "No School Found" +

        "</td>" +

        "</tr>";

        return;

    }

    list.forEach(function(item,index){

        const rowNumber =

        ((NODAL.currentPage-1)*NODAL.pageSize)

        +

        index

        +

        1;

        tbody.innerHTML +=

        "<tr>"

        +

        "<td>"+rowNumber+"</td>"

        +

        "<td>"+item.schoolName+"</td>"

        +

        "<td>"+item.udise+"</td>"

        +

        "<td>"+item.status+"</td>"

        +

        "<td>"

        +

        "<button class='btn-primary' "

        +

        "onclick=\"openEntry('"

        +

        item.schoolId

        +

        "')\">Entry</button>"

        +

        "</td>"

        +

        "</tr>";

    });

}


/*=====================================================
 PAGINATION
=====================================================*/

function renderCurrentPage(){

    NODAL.totalPages =

    Math.max(

        1,

        Math.ceil(

            NODAL.filteredSchools.length /

            NODAL.pageSize

        )

    );

    const start =

    (NODAL.currentPage-1)

    *

    NODAL.pageSize;

    const end =

    start +

    NODAL.pageSize;

    renderSchoolTable(

        NODAL.filteredSchools.slice(

            start,

            end

        )

    );

    const pageInfo =

    document.getElementById("pageInfo");

    if(pageInfo){

        pageInfo.textContent =

        "Page "

        +

        NODAL.currentPage

        +

        " / "

        +

        NODAL.totalPages;

    }

}


/*=====================================================
 NEXT PAGE
=====================================================*/

function nextPage(){

    if(

        NODAL.currentPage

        <

        NODAL.totalPages

    ){

        NODAL.currentPage++;

        renderCurrentPage();

    }

}


/*=====================================================
 PREVIOUS PAGE
=====================================================*/

function previousPage(){

    if(

        NODAL.currentPage>1

    ){

        NODAL.currentPage--;

        renderCurrentPage();

    }

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

        NODAL.filteredSchools =

        [...NODAL.schools];

    }

    else{

        NODAL.filteredSchools =

        NODAL.schools.filter(function(item){

            return(

                String(item.schoolName)

                .toLowerCase()

                .includes(keyword)

                ||

                String(item.udise)

                .toLowerCase()

                .includes(keyword)

                ||

                String(item.status)

                .toLowerCase()

                .includes(keyword)

            );

        });

    }

    NODAL.currentPage = 1;

    renderCurrentPage();

}
/*=====================================================
 ENTRY MODAL
=====================================================*/

function openEntry(schoolId){

    const modal = document.getElementById("entryModal");

    if(modal){

        modal.style.display = "block";

    }

    loadSchoolDetails(schoolId);

}


function closeEntry(){

    const modal = document.getElementById("entryModal");

    if(modal){

        modal.style.display = "none";

    }

}


/*=====================================================
 LOAD SCHOOL DETAILS
=====================================================*/

async function loadSchoolDetails(schoolId){

    showLoading(true);

    try{

        const response = await fetch(

            WEB_APP_URL +

            "?action=schoolDetails" +

            "&token=" +

            encodeURIComponent(NODAL.token) +

            "&schoolId=" +

            encodeURIComponent(schoolId)

        );

        const result = await response.json();

        if(!result.status){

            throw new Error(result.message);

        }

        const school = result.data;

        setValue("schoolId",school.schoolId);

        setValue("schoolName",school.schoolName);

        setValue("udise",school.udise);

    }

    catch(error){

        alert(error.message);

    }

    finally{

        showLoading(false);

    }

}


/*=====================================================
 SUBMIT ENTRY
=====================================================*/

async function submitEntry(){

    try{

        const data = collectFormData();

        if(!validateForm(data)){

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

                    data:data

                })

            }

        );

        const result = await response.json();

        if(!result.status){

            throw new Error(result.message);

        }

        alert("Response Saved Successfully");

        closeEntry();

        await refreshDashboard();

    }

    catch(error){

        alert(error.message);

    }

    finally{

        showLoading(false);

    }

}


/*=====================================================
 COLLECT FORM DATA
=====================================================*/

function collectFormData(){

    return{

        schoolId:getValue("schoolId"),

        schoolName:getValue("schoolName"),

        udise:getValue("udise"),

        month:getValue("month"),

        year:getValue("year"),

        students:Number(getValue("students")),

        workingDays:Number(getValue("workingDays")),

        mealDays:Number(getValue("mealDays")),

        wheat:Number(getValue("wheat")),

        rice:Number(getValue("rice")),

        fruitDays:Number(getValue("fruitDays")),

        fruitQty:Number(getValue("fruitQty"))

    };

}


/*=====================================================
 VALIDATE FORM
=====================================================*/

function validateForm(data){

    if(data.month===""){

        alert("Please Select Month");

        return false;

    }

    if(data.year===""){

        alert("Please Select Year");

        return false;

    }

    if(data.students<=0){

        alert("Enter Student Count");

        return false;

    }

    if(data.workingDays<=0){

        alert("Enter Working Days");

        return false;

    }

    return true;

}


/*=====================================================
 COMMON GET VALUE
=====================================================*/

function getValue(id){

    const el=document.getElementById(id);

    return el ? el.value : "";

}


/*=====================================================
 COMMON SET VALUE
=====================================================*/

function setValue(id,value){

    const el=document.getElementById(id);

    if(el){

        el.value=value;

    }

}
/*=====================================================
 SESSION MONITOR
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

                alert("Your session has expired.");

                localStorage.clear();

                window.location.href="index.html";

            }

        }

        catch(error){

            console.log(error);

        }

    },300000); // 5 Minutes

}


/*=====================================================
 AUTO REFRESH
=====================================================*/

function startAutoRefresh(){

    setInterval(async function(){

        try{

            await loadDashboard();

        }

        catch(error){

            console.log(error);

        }

    },60000); // 1 Minute

}


/*=====================================================
 LOADING PANEL
=====================================================*/

function showLoading(status){

    const panel = document.getElementById("loadingPanel");

    if(!panel){

        return;

    }

    panel.style.display = status ? "flex" : "none";

}


/*=====================================================
 NETWORK STATUS
=====================================================*/

window.addEventListener("offline",function(){

    alert("Internet connection lost.");

});

window.addEventListener("online",function(){

    refreshDashboard();

});


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

    return Number(value||0).toLocaleString("en-IN");

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
 CONFIRM
=====================================================*/

function confirmAction(message){

    return confirm(message);

}


/*=====================================================
 GLOBAL ERROR
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

        column,

        error

    );

    alert(

        "Application Error\n\n"

        +

        message

    );

};


/*=====================================================
 WINDOW LOAD
=====================================================*/

window.addEventListener(

    "load",
/*=====================================================
 LOGOUT
=====================================================*/

async function logout(){

    try{

        if(!confirm("Are you sure you want to logout?")){

            return;

        }

        await fetch(

            WEB_APP_URL +

            "?action=logout&token=" +

            encodeURIComponent(NODAL.token)

        );

    }

    catch(error){

        console.log(error);

    }

    finally{

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        sessionStorage.clear();

        window.location.replace("index.html");

    }

}
    function(){

        initializeServices();

    }

);
/*=====================================================
 LOGOUT
=====================================================*/

async function logout(){

    try{

        if(!confirm("Are you sure you want to logout?")){

            return;

        }

        await fetch(

            WEB_APP_URL +

            "?action=logout&token=" +

            encodeURIComponent(NODAL.token)

        );

    }

    catch(error){

        console.log(error);

    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    sessionStorage.clear();

    window.location.href = "index.html";

}
