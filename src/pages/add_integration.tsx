import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { withTheme, ThemeProps } from '@rjsf/core';
import Devices from "./devices";
import { DetailPageHeader } from "../components";
import { PageMain, Box, Page, PageContent } from "grommet-exp";
import { Select, Notification } from "grommet";

import { restget } from "../utils/restclient";
import DynamicForm from '../components/DynamicForm';

const schema: RJSFSchema = {
    title: 'Todo',
    type: 'object',
    required: ['title'],
    properties: {
        title: { type: 'string', title: 'Title', default: 'A new task' },
        done: { type: 'boolean', title: 'Done?', default: false },
    },
};

const AddIntegration = () => {

    const [value, setValue] = useState('');
    const [provider_type, setProviderType] = useState('');
    const [providers, setProviders] = useState({});
    const [providerMeta, setProviderMeta] = useState({});

    let options = ["OneView", "vCenter"]

    useEffect(() => {
        console.log("inside useEffect for making REST call")

        restget("/api/providers")
            .then((response: JSON) => {
                console.log(response);
                setProviders(response)
            })

    }, []);


    useEffect(() => {
        console.log("inside useEffect for making REST call for providers ", provider_type);

        if (provider_type) {
            restget("/api/provider/?name=" + provider_type)
                .then((response: JSON) => {
                    console.log(response);
                    setProviderMeta(response)
                })

        }


    }, [provider_type]);

    console.log(providers);
    if (providers.hasOwnProperty("providers")) {
        options = providers["providers"].map((item: string) => item);
    }

    let jsonschema = [];
    let uischema = {};

    console.log("providers meta: ", providerMeta);

    if (providerMeta.hasOwnProperty("jsonschema")) {
        jsonschema = providerMeta["jsonschema"];
    }
    if (providerMeta.hasOwnProperty("uischema")) {
        uischema = providerMeta["uischema"];
    }

    function onProviderSelection(event) {
        console.log(event)
        setProviderType(event.value);
    }

    console.log("jsonschema: ", jsonschema);
    console.log("uischema: ", uischema);

    return (
        <Page kind="wide" layout="header-main-aside">
            <PageContent align="start">

                <PageMain>
                    <Box gap={"small"} pad={'large'} align={"start"}>
                        <Box align={"start"} direction={"column"} justify='start' >
                            <h3>Provider Type</h3>
                            <Select
                                id="select"
                                name="select"
                                placeholder="Select Provider"
                                value={provider_type}
                                options={options}
                                onChange={onProviderSelection}
                            />
                        </Box>
                        <Box>
                        <Notification
                        status='critical'
                    title="Default Status Title"
                    message="This is an example of a notification message"
                    onClose={() => { }}
                />

                        </Box>
                        {/* <Form
                            schema={jsonschema}
                            uiSchema={uischema}
                            validator={validator}
                            onChange={() => { console.log('changed') }}
                            onSubmit={() => { console.log('submitted') }}
                            onError={() => { console.log('errors') }}
                        /> */}
                        <DynamicForm schema={jsonschema} onSubmit={(formData) => {console.log(formData) }} />
                    </Box>
                </PageMain>
            </PageContent>
        </Page>
    );
};

export default AddIntegration;
