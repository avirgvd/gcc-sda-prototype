import { Box, Button, Nav, Text } from "grommet-exp";
import { ContentContainer } from "../ContentContainer";

export const LeftNav = () => {

  const page = window.location.pathname;
  console.log(window.location);

  console.log(page);

  let providers_active = false;
  let orchestrators_active = false;
  let catalogs_active = false;

  if (page === "/integrations") 
    providers_active = true;
  else if (page === "/orchestrators") 
    orchestrators_active = true;
  else if (page === "/catalogs")
    catalogs_active = true;

  return (
    <ContentContainer>
      <Nav>
        <Box gap="small">
          <Button label="Providers" active={providers_active} onClick={() => {window.location.href = "/integrations"}} />
          <Button label="Orchestrators" active={orchestrators_active} onClick={() => {window.location.href = "/orchestrators"}} />
          <Button label="Service Catalogs" active={catalogs_active} onClick={() => {window.location.href = "/catalogs"}} />
        </Box>
      </Nav>
    </ContentContainer>
  );
};
