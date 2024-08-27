import React, { useState, useEffect } from 'react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { withTheme, ThemeProps } from '@rjsf/core';
import Devices from "./devices";
import { DetailPageHeader } from "../components";
import { PageMain, Page, PageContent, } from "grommet-exp";
import { Select, Notification, Grid, Box, Tip } from "grommet";

import { restget, restpost } from "../utils/restclient";
import DynamicForm from '../components/DynamicForm';

import { Tree } from "../components/JSONTree";
import { setOptions } from 'leaflet';

const treeData = [
    {
        key: "0",
        label: "Documents",
        children: [
            {
                key: "0-0",
                label: "Document 1-1",
                children: [
                    {
                        key: "0-1-1",
                        label: "Document-0-1.doc",
                    },
                    {
                        key: "0-1-2",
                        label: "Document-0-2.doc",
                    },
                ],
            },
        ],
    },
    {
        key: "1",
        label: "Desktop",
        children: [
            {
                key: "1-0",
                label: "document1.doc",
            },
            {
                key: "0-0",
                label: "documennt-2.doc",
            },
        ],
    },
    {
        key: "2",
        label: "Downloads",
        children: [],
    },
];


const AddIntegration = () => {

    const [notif, setNotif] = useState(false);
    const [value, setValue] = useState('');
    const [provider_type, setProviderType] = useState('');
    const [job_template, setJobTemplate] = useState('');
    const [job_template_options, setJobTemplateOptions] = useState([]);
    const [job_template_options_full, setJobTemplateOptionsFull] = useState([]);
    const [form_json_schema, setFormJsonSchema] = useState({"catalog_fields": [], "instance_fields": [], "dependencies": []});
    
    const [orchestrator_type, setOrchestratorType] = useState('');
    const [provider, setProvider] = useState({});
    const [providers, setProviders] = useState([]);
    const [providerMeta, setProviderMeta] = useState({});

    const [data1, setData1] = useState({"name": "", "description": "", "vcenter": {"name": "vcenter1", "datacenters": [ {"name": "datacenter1", "clusters": [{"name": "cluster1"}, {"name": "cluster2"}]}, {"name": "datacenter2"}]}});

    const [jsonschema, setJsonSchema] = useState([
        {
          "sectionTitle": "VCenter Details",
          "fields": [
            {
              "name": "provider",
              "label": "vCenter Provider",
              "type": "text",
              "required": true,
              "placeholder": "Select the provider",
              "mapto": "$.vcenter.name"
            },
            {
              "name": "datacenter",
              "label": "Datacenter",
              "type": "select",
              "required": true,
              "placeholder": "Select the datacenter",
              "mapto": "$.vcenter.datacenters[*].name"
            },
            {
              "name": "cluster",
              "label": "Cluster",
              "type": "select",
              "required": true,
              "placeholder": "Select the cluster",
              "mapto": "$.vcenter.datacenters[0].clusters[*].name"
            }
          ]
        }
      ]);

    let options = ["OneView", "vCenter"];

    // Step#1: TODO: Hardcoded the orchestrator options. 
    let orchestrators_options = ["awx", "terraform"];

    useEffect(() => {
        console.log("inside useEffect for making REST call")

        /*
        Step#0:Get list of available providers
        Get list if integrated providers
        The output is like:
        {
            "data": [
                {
                "alias": "vcenter1",
                "hostname": "10.55.81.54",
                "username": "Administrator@vsphere.local",
                "password": "<password>",
                "provider_type": "vcenter"
                }
            ]
        }
        */
        restget("/api/providers")
            .then((response: object) => {
                console.log(response);
                setProviders(response["data"])
            })
            .catch((err) => {
                console.log("Exception: ", err);
            }); 

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

    interface ProviderData {
        "alias": string;
        "username": string;
        "password": string;
        "hostname": string;
    }

    const handleSubmit = (formData: any) => {


        formData["provider_type"] = provider_type;

        console.log(formData);

        const data = { "data": formData };
        restpost("/api/provider", data)
            .then((response: JSON) => {
                console.log(response);
                setNotif(false)
                window.location.href = "/integrations"
            })
            .catch((err) => {
                setNotif(true);
            });
    };

    console.log(providers);
    function onProviderSelection(event) {
        console.log(event)
        setProvider(event.option);
    }

    function onOrchestratorSelection(event) {
        console.log(event)

        const url = "/api/details/?category=" + "orchestrator" + "&name=" + event.value;
        restget(url)
        .then((response) => {
            console.log(response)
            setJobTemplateOptions(response["job_templates"])
            setJobTemplateOptionsFull(response["job_templates"])
        })

        setOrchestratorType(event.value);
    }

    function onJobTemplateSelection(event) {
        console.log(event.option);

        // job_template
        // Get the form-JSON schema for the selected job-template
        const url = "/api/job/schema?orchestrator=awx";
        restpost(url, event.option)
        .then((response) => {
            console.log(response);
            setFormJsonSchema(response);
        })
        setJobTemplate(event.option);


    }

    function onFilterOptions(text: string) {

        // The line below escapes regular expression special characters:
        // [ \ ^ $ . | ? * + ( )
        const escapedText = text.replace(/[-\\^$*+?.()|[\]{}]/g, '\\$&');

        // Create the regular expression with modified value which
        // handles escaping special characters. Without escaping special
        // characters, errors will appear in the console
        const exp = new RegExp(escapedText, 'i');

        const filtered_options = job_template_options.filter((item) => {
            return exp.test((item['name']));
        });

        setJobTemplateOptions(filtered_options);
    }

    console.log("Provider: ", provider);
    console.log("Length: ", job_template_options_full.length)

    return (
        <Grid columns={["medium", "xlarge", "flex"]} rows={["large", "xsmall"]}
            areas={
                [
                    { "name": "left", "start": [0, 0], "end": [0, 1] },
                    { "name": "main", "start": [1, 0], "end": [1, 1] },
                    { "name": "tools", "start": [2, 0], "end": [2, 1] }
                ]}>
            <Box align="center" justify="center" gridArea="left" background={{ "color": "accent-1" }} >
            {/* <Tree treeData={treeData} /> */}
            <h3>Choose Provider</h3>
                <Select
                    id="provider"
                    name="provider"
                    placeholder="Select Provider"
                    labelKey="alias"
                    valueKey={{ key: 'alias', reduce: true }}
                    value={provider['alias']}
                    options={providers}
                    onChange={onProviderSelection}
                />
            </Box>
            <Box align="center" justify="center" gridArea="main" border={{ "color": "border" }} background={{ "color": "active" }} elevation="none" >
                <Page kind="wide" layout="header-main-aside">
                    <PageContent align="start">
                        <PageMain>
                            <Box gap={"small"} pad={'large'} align={"start"}>
                                <Box align={"start"} direction={"column"} justify='start' >
                                    <h3>Create Service Catalog</h3>
                                </Box>
                                <Box>
                                    {notif && (<Notification
                                        status='critical'
                                        title="Error"
                                        message="Failed to connect to the specified provider"
                                        onClose={() => { }}
                                    />)}
                                </Box>
                                <Box>
                                    <DynamicForm schema={form_json_schema["catalog_fields"]} data1={data1} onSubmit={(formData) => { handleSubmit(formData) }} />
                                </Box>
                            </Box>
                        </PageMain>
                    </PageContent>
                </Page>
            </Box>
            <Box align="start" justify="start" pad={"small"} gridArea="tools" background={{ "color": "light-4" }} elevation="large" >
                <h3>Dependencies</h3>
                <h3>Choose Orchestrator</h3>
                <Select
                    id="orchestrator"
                    name="orchestrator"
                    placeholder="Select Orchestrator"
                    value={orchestrator_type}
                    options={orchestrators_options}
                    onChange={onOrchestratorSelection}
                />
                <h3>Choose Job Template</h3>
                <Tip content={job_template['name']}>
                <Select
                    id="jobtemplate"
                    name="jobtemplate"
                    disabled={job_template_options_full.length === 0}
                    placeholder="Select Job"
                    labelKey="name"
                    valueKey={{ key: 'name', reduce: true }}
                    value={job_template['name']}
                    options={job_template_options}
                    onChange={onJobTemplateSelection}
                    onClose={() => setJobTemplateOptions(job_template_options_full)}
                    onSearch={(text) => {onFilterOptions(text)}}
                />
                </Tip>

                
            </Box>
        </Grid>

    );
};

export default AddIntegration;
