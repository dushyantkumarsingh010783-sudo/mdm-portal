'use strict';

/*=========================================================
 MDM SMART MONITORING PORTAL
 API MODULE
 Version : 1.0
=========================================================*/

const API = {

    /*=====================================================
     Request
    =====================================================*/

    async request(action, payload = {}) {

        try {

            const body = {

                action,

                ...payload

            };

            const controller = new AbortController();

            const timer = setTimeout(() => {

                controller.abort();

            }, CONFIG.REQUEST_TIMEOUT);

            const response = await fetch(CONFIG.API_URL, {

                method: 'POST',

                headers: {

                    'Content-Type': 'application/json'

                },

                body: JSON.stringify(body),

                signal: controller.signal

            });

            clearTimeout(timer);

            if (!response.ok) {

                throw new Error(

                    'HTTP ' + response.status

                );

            }

            const json = await response.json();

            return json;

        }

        catch (error) {

            console.error(error);

            return {

                success: false,

                message: error.message

            };

        }

    },

    /*=====================================================
     Init
    =====================================================*/

    async init() {

        return await this.request(

            ACTIONS.INIT

        );

    },

    /*=====================================================
     Load Schools
    =====================================================*/

    async loadSchools(

        nyayPanchayat,

        schoolType

    ) {

        return await this.request(

            ACTIONS.LOAD_SCHOOLS,

            {

                nyayPanchayat,

                schoolType

            }

        );

    },

    /*=====================================================
     Submit
    =====================================================*/

    async submit(formData) {

        return await this.request(

            ACTIONS.SUBMIT,

            formData

        );

    }

};

Object.freeze(API);
