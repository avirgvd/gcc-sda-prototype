import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { withTheme, ThemeProps } from '@rjsf/core';
import Devices from "./devices";
import { DetailPageHeader } from "../components";
import { PageMain, Box, Page, PageContent } from "grommet-exp";
import { Select, Notification } from "grommet";

import { restget, restpost } from "../utils/restclient";
import DynamicForm from '../components/DynamicForm';


const AddOrchestrator = () => {

    const [notif, setNotif] = useState(false);
    const [value, setValue] = useState('');
    const [orchestrator_type, setOrchestratorType] = useState('');
    const [orchestrators, setOrchestrators] = useState({});
    const [orchestratorMeta, setOrchestratorMeta] = useState({});

    let options = ["OneView", "vCenter"]

    useEffect(() => {
        console.log("inside useEffect for making REST call")

        restget("/api/orchestrators/types")
            .then((response: JSON) => {
                console.log(response);
                setOrchestrators(response)
            })
            .catch((err) => {
                console.log("Exception: ", err);
            });

    }, []);


    useEffect(() => {
        console.log("inside useEffect for making REST call for orchestrators ", orchestrator_type);

        setOrchestratorMeta({})

        if (orchestrator_type) {
            restget("/api/orchestrator/?name=" + orchestrator_type)
                .then((response: JSON) => {
                    console.log(response);
                    setOrchestratorMeta(response)
                })

        }


    }, [orchestrator_type]);

    const handleSubmit = (formData: any) => {


        formData["orchestrator_type"] = orchestrator_type;

        console.log(formData);

        const data = {"data": formData};
        restpost("/api/orchestrator", data)
            .then((response: JSON) => {
                console.log(response);
                setNotif(false)
                window.location.href = "/orchestrators"
            })
            .catch((err) => {
                setNotif(true);
            });
    };

    console.log(orchestrators);
    if (orchestrators.hasOwnProperty("orchestrators")) {
        options = orchestrators["orchestrators"].map((item: string) => item);
    }

    let jsonschema = [];
    let uischema = {};

    console.log("orchestrator meta: ", orchestratorMeta);

    if (orchestratorMeta.hasOwnProperty("jsonschema")) {
        jsonschema = orchestratorMeta["jsonschema"];
    }
    if (orchestratorMeta.hasOwnProperty("uischema")) {
        uischema = orchestratorMeta["uischema"];
    }

    function onOrchestratorSelection(event) {
        console.log(event)
        setOrchestratorType(event.value);
    }

    console.log("jsonschema: ", jsonschema);
    console.log("uischema: ", uischema);

    return (
        <Page kind="wide" layout="header-main-aside">
            <PageContent align="start">

                <PageMain>
                    <Box gap={"small"} pad={'large'} align={"start"}>
                        <Box align={"start"} direction={"column"} justify='start' >
                            <h3>Orchestrator Type</h3>
                            <Select
                                id="select"
                                name="select"
                                placeholder="Select Orchestrator"
                                value={orchestrator_type}
                                options={options}
                                onChange={onOrchestratorSelection}
                            />
                        </Box>
                        <Box>
                        { notif && (<Notification
                        status='critical'
                    title="Error"
                    message="Failed to connect to the specified orchestrator"
                    onClose={() => { }}
                />)}

                        </Box>
                        {/* <Form
                            schema={jsonschema}
                            uiSchema={uischema}
                            validator={validator}
                            onChange={() => { console.log('changed') }}
                            onSubmit={() => { console.log('submitted') }}
                            onError={() => { console.log('errors') }}
                        /> */}
                        <DynamicForm schema={jsonschema} onSubmit={(formData) => {handleSubmit(formData) }} />
                    </Box>
                </PageMain>
            </PageContent>
        </Page>
    );
};

export default AddOrchestrator;
