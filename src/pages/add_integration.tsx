import React, { useState } from 'react';
import Form from '@rjsf/core';
import { RJSFSchema } from '@rjsf/utils';
import validator from '@rjsf/validator-ajv8';
import { withTheme, ThemeProps } from '@rjsf/core';
import {Box, Page, PageContent} from "grommet-exp";
import Devices from "./devices";
import {DetailPageHeader} from "../components";
import {PageMain} from "grommet-exp";
import {Select} from "grommet";

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

    let options = ["OneView", "vCenter"]

    return (
        <Page kind="wide" layout="header-main-aside">
            <PageContent align="start">

                <PageMain>
        <Box gap={"medium"}>
            <Box align={"start"} direction={"column"} >
                <Select
                    id="select"
                    name="select"
                    placeholder="Select Provider"
                    value={value}
                    options={options}
                    onChange={({ option }) => setValue(option)}
                />
            </Box>
            <Form
                schema={schema}
                validator={validator}
                onChange={() => {console.log('changed')}}
                onSubmit={() => {console.log('submitted')}}
                onError={() => {console.log('errors')}}
            />
        </Box>
                </PageMain>
            </PageContent>
        </Page>
    );
};

export default AddIntegration;
