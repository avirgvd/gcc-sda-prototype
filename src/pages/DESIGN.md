

### Create Catalog:

0. Get list of available providers from backend.
1. Select orchestrator (awx, terraform). And query the job_templates
2. Select required job template or script from the selected orchestrator.
3. Get the JSON schema for the selected job template (or script). -> form_json_schema
4. Get the provider dependencies from the JSON schema (like vcenter, netbox).
5. Show list of available integrations for each provider.
6. User selects the desired dependencies.
7. Discover each integrated provider selected by the user. -> providers_data
8. Generate dynamic form using `form_json_schema` and `providers_data`.
    1. Populates the fields with discovered data.
9. Use selects the desired options in the dynamic form and submits. -> catalog_form_data.json
10. Create new catalog item using `catalog_form_data.json`.
