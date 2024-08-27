// src/DynamicForm.tsx
import React, { useState } from 'react';
import { Box, Button, Select, CheckBox, TextArea, RadioButton } from 'grommet';
import { Form, FormField, TextInput } from 'grommet-exp';
import { useNavigate } from "react-router-dom";
import {JSONPath} from "jsonpath-plus";

import {Password} from './password';

interface Option {
  value: string;
  label: string;
}

interface Field {
  name: string;
  type: string;
  label: string;
  mapto: string;
  required?: boolean;
  options?: Option[];
  placeholder?: string;
}

interface Section {
  sectionTitle: string;
  fields: Field[];
}

interface DynamicFormProps {
  schema: Section[];
  data1: object;
  onSubmit: (formData: Record<string, any>) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({ schema, data1, onSubmit }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    console.log(e.target);
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const vcenter_name = JSONPath({json: (data1), path: "$.vcenter.name"})
  const datacenters = JSONPath({json: (data1), path: "$.vcenter.datacenters[*].name"})
  console.log("Vcenter name data1: ", data1);
  console.log("Vcenter name is: ", vcenter_name);
  console.log("Vcenter datacenters is: ", datacenters);


  const handleValidation = (): boolean => {
    let errors: Record<string, string> = {};
    let formIsValid = true;

    schema.forEach((section) => {
      if (section.fields) {
        section.fields.forEach((field) => {
          if (field.required && !formData[field.name]) {
            formIsValid = false;
            errors[field.name] = 'This field is required';
          }
        });
      }
    });

    setFormErrors(errors);
    return formIsValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (handleValidation()) {
      onSubmit(formData);
    }
  };

  const renderField = (field: Field) => {
    console.log(field);
    switch (field.type) {
      case 'select':

        return (
          <Select
            name={field.name}
            onChange={handleChange}
            required={field.required}
            options={JSONPath({json: data1, path: field.mapto}) || ''}
            value={formData[field.name]}
          >
          </Select>
        );
      case 'radio':
        return field.options?.map((option, index) => (
          <RadioButton
            key={index}
            type="radio"
            name={field.name}
            value={option.value}
            label={option.label}
            onChange={handleChange}
            required={field.required}
            checked={formData[field.name] === option.value}
          />
        ));
      case 'checkbox':
        return (
          <CheckBox
            type="checkbox"
            name={field.name}
            label={field.label}
            onChange={handleChange}
            required={field.required}
            checked={formData[field.name]}
          />
        );
      case 'textarea':
        return (
          <TextArea
            as="textarea"
            rows={3}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={formData[field.name]}
          />
        );
        case 'text':
        return (
          <TextInput
            rows={3}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={formData[field.name]}
          />
        );
        case 'password':
          return (
            
            <Password
              rows={3}
              type="password"
              name={field.name}
              placeholder={field.placeholder}
              onChange={handleChange}
              required={field.required}
              value={formData[field.name] || ''}
            />
          );
      default:
        // Handle other HTML5 input types like date, email, etc.
        return (
          <TextArea
            type={field.type}
            name={field.name}
            placeholder={field.placeholder}
            onChange={handleChange}
            required={field.required}
            value={formData[field.name] || ''}
          />
        );
    }
  };

  const navigate = useNavigate();
  console.log("Form Data: ", formData);

  return (
    <Form gap='small' onSubmit={handleSubmit}>
      {schema.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <h3>{section.sectionTitle}</h3>
            {section.fields &&
              section.fields.map((field, fieldIndex) => (
                    <FormField margin={{"vertical": "medium"}} label={field.label}>
                      {renderField(field)}
                    </FormField>
              ))}
        </div>
      ))}
      <Box direction="row" justify="between" margin={{ top: 'medium' }}>
      <Button label="Cancel" onClick={() => {navigate(-1)}} />
            <Button
              disabled
              type="reset"
              label="Reset"
            />
            <Button type="submit" label="Submit" primary />
          </Box>
    </Form>
  );
};

export default DynamicForm;

