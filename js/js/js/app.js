'use strict';

/*=========================================================
 MDM SMART MONITORING PORTAL
 APP MODULE
=========================================================*/

const APP = {

    tomSelect: null,

    schools: [],

    elements: {},

    /*=====================================================
     Initialize
    =====================================================*/

    async init() {

        this.cacheElements();

        this.bindEvents();

        this.loadMonths();

        this.loadYears();

        await this.loadInitialData();

        this.hideLoader();

    },

    /*=====================================================
     Cache DOM
    =====================================================*/

    cacheElements() {

        this.elements = {

            loader:

                document.getElementById('loader'),

            form:

                document.getElementById('entryForm'),

            month:

                document.getElementById('month'),

            year:

                document.getElementById('year'),

            nyayPanchayat:

                document.getElementById('nyayPanchayat'),

            schoolType:

                document.getElementById('schoolType'),

            schoolName:

                document.getElementById('schoolName'),

            udise:

                document.getElementById('udise'),

            studentCount:

                document.getElementById('studentCount'),

            beneficiary:

                document.getElementById('beneficiary'),

            workingDays:

                document.getElementById('workingDays'),

            grain:

                document.getElementById('grain'),

            fruitMilk:

                document.getElementById('fruitMilk'),

            remarks:

                document.getElementById('remarks'),

            submitBtn:

                document.getElementById('submitBtn')

        };

    },

    /*=====================================================
     Events
    =====================================================*/

    bindEvents() {

        this.elements.schoolType
            .addEventListener(

                'change',

                () => this.loadSchools()

            );

        this.elements.nyayPanchayat
            .addEventListener(

                'change',

                () => this.loadSchools()

            );

        this.elements.form
            .addEventListener(

                'submit',

                (e)=>{

                    e.preventDefault();

                    this.submitForm();

                }

            );

    },

    /*=====================================================
     Loader
    =====================================================*/

    hideLoader(){

        this.elements.loader.style.display='none';

    },

    /*=====================================================
     Months
    =====================================================*/

    loadMonths(){

        MONTHS.forEach(month=>{

            const option=document.createElement('option');

            option.value=month;

            option.textContent=month;

            this.elements.month.appendChild(option);

        });

    },

    /*=====================================================
     Years
    =====================================================*/

    loadYears(){

        YEARS.forEach(year=>{

            const option=document.createElement('option');

            option.value=year;

            option.textContent=year;

            this.elements.year.appendChild(option);

        });

    },
      /*=====================================================
     Load Initial Data
    =====================================================*/

    async loadInitialData() {

        try {

            const response = await API.init();

            if (!response.success) {

                this.showError(

                    response.message || 'डेटा लोड नहीं हो सका।'

                );

                return;

            }

            this.populateNyayPanchayat(

                response.nyayPanchayat || []

            );

        }

        catch (error) {

            console.error(error);

            this.showError(error.message);

        }

    },

    /*=====================================================
     Nyay Panchayat
    =====================================================*/

    populateNyayPanchayat(list) {

        const select = this.elements.nyayPanchayat;

        select.innerHTML = '';

        const first = document.createElement('option');

        first.value = '';

        first.textContent = CONFIG.DEFAULT_OPTION;

        select.appendChild(first);

        list.forEach(item => {

            const option = document.createElement('option');

            option.value = item;

            option.textContent = item;

            select.appendChild(option);

        });

    },

    /*=====================================================
     Load Schools
    =====================================================*/

    async loadSchools() {

        const nyayPanchayat =

            this.elements.nyayPanchayat.value;

        const schoolType =

            this.elements.schoolType.value;

        if (!nyayPanchayat || !schoolType) {

            return;

        }

        try {

            const response = await API.loadSchools(

                nyayPanchayat,

                schoolType

            );

            if (!response.success) {

                this.showError(

                    response.message

                );

                return;

            }

            this.schools =

                response.schools || [];

            this.populateSchools();

        }

        catch (error) {

            console.error(error);

            this.showError(

                error.message

            );

        }

    },

    /*=====================================================
     School Dropdown
    =====================================================*/

    populateSchools() {

        const select =

            this.elements.schoolName;

        select.innerHTML = '';

        const first = document.createElement('option');

        first.value = '';

        first.textContent =

            'विद्यालय चुनें';

        select.appendChild(first);

        this.schools.forEach(

            school => {

                const option =

                    document.createElement('option');

                option.value =

                    school.udise;

                option.textContent =

                    school.name;

                option.dataset.udise =

                    school.udise;

                select.appendChild(option);

            }

        );

        if (this.tomSelect) {

            this.tomSelect.destroy();

        }

        this.tomSelect =

            new TomSelect(

                '#schoolName',

                {

                    create: false,

                    sortField: {

                        field: 'text',

                        direction: 'asc'

                    }

                }

            );

        this.elements.schoolName

            .addEventListener(

                'change',

                () => this.fillSchool()

            );

    },

    /*=====================================================
     Fill School
    =====================================================*/

    fillSchool() {

        const udise =

            this.elements.schoolName.value;

        const school =

            this.schools.find(

                x => x.udise === udise

            );

        if (!school) {

            this.elements.udise.value = '';

            return;

        }

        this.elements.udise.value =

            school.udise;

    },
      /*=====================================================
     Validate Form
    =====================================================*/

    validateForm() {

        if (!this.elements.month.value) {

            this.showSnackbar('कृपया माह चुनें।');

            return false;

        }

        if (!this.elements.year.value) {

            this.showSnackbar('कृपया वर्ष चुनें।');

            return false;

        }

        if (!this.elements.nyayPanchayat.value) {

            this.showSnackbar('कृपया न्याय पंचायत चुनें।');

            return false;

        }

        if (!this.elements.schoolType.value) {

            this.showSnackbar('कृपया विद्यालय का प्रकार चुनें।');

            return false;

        }

        if (!this.elements.schoolName.value) {

            this.showSnackbar('कृपया विद्यालय चुनें।');

            return false;

        }

        return true;

    },

    /*=====================================================
     Submit Form
    =====================================================*/

    async submitForm() {

        if (!this.validateForm()) {

            return;

        }

        this.elements.submitBtn.disabled = true;

        const payload = {

            month: this.elements.month.value,

            year: this.elements.year.value,

            nyayPanchayat: this.elements.nyayPanchayat.value,

            schoolType: this.elements.schoolType.value,

            schoolName: this.elements.schoolName.options[
                this.elements.schoolName.selectedIndex
            ].text,

            udise: this.elements.udise.value,

            studentCount: this.elements.studentCount.value,

            beneficiary: this.elements.beneficiary.value,

            workingDays: this.elements.workingDays.value,

            grain: this.elements.grain.value,

            fruitMilk: this.elements.fruitMilk.value,

            remarks: this.elements.remarks.value

        };

        const response = await API.submit(payload);

        this.elements.submitBtn.disabled = false;

        if (response.success) {

            this.showSuccess();

            this.resetForm();

        } else {

            this.showError(

                response.message || 'डेटा सेव नहीं हो सका।'

            );

        }

    },

    /*=====================================================
     Reset
    =====================================================*/

    resetForm() {

        this.elements.form.reset();

        this.elements.udise.value = '';

        if (this.tomSelect) {

            this.tomSelect.clear();

            this.tomSelect.clearOptions();

        }

    },

    /*=====================================================
     Snackbar
    =====================================================*/

    showSnackbar(message) {

        const bar = document.getElementById('snackbar');

        bar.textContent = message;

        bar.classList.add('show');

        setTimeout(() => {

            bar.classList.remove('show');

        }, 3000);

    },

    /*=====================================================
     Success
    =====================================================*/

    showSuccess() {

        document

            .getElementById('successDialog')

            .classList

            .remove('hidden');

    },

    /*=====================================================
     Error
    =====================================================*/

    showError(message) {

        document

            .getElementById('errorMessage')

            .textContent = message;

        document

            .getElementById('errorDialog')

            .classList

            .remove('hidden');

    }

};

/*=========================================================
 Dialog Buttons
=========================================================*/

document.addEventListener(

    'click',

    function(e){

        if(e.target.id==='dialogOkBtn'){

            document

            .getElementById('successDialog')

            .classList

            .add('hidden');

        }

        if(e.target.id==='errorOkBtn'){

            document

            .getElementById('errorDialog')

            .classList

            .add('hidden');

        }

    }

);

/*=========================================================
 Start Application
=========================================================*/

document.addEventListener(

    'DOMContentLoaded',

    () => APP.init()

);
