import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  
  DataTable,
  Grid,
  Heading,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  Select,
} from "grommet-exp";
import { Card, ContentContainer, LeftNav } from "../components";
import { ReactComponent as Apps } from "grommet-icons/img/apps.svg";
import { ReactComponent as List } from "grommet-icons/img/list.svg";
// import data from "../data.json";
import { nameToSlug } from "../utils";
import { cardGrid, container, mainGrid } from "../styles.css";
import {Search, Filter} from "grommet-icons";
import {Toolbar} from "grommet/components/Toolbar";
import {Button, DropButton, TextInput} from "grommet";

import {restget} from "../utils/restclient";


const Integrations = () => {

  const [integrations, setIntegrations] = useState([]);

  console.log(window.location);

  const navigate = useNavigate();
  useEffect(() => {
    const changeRoute = () => {
      navigate(window.location.pathname);
    };

    window.addEventListener("routeChange", changeRoute);
    changeRoute();
    return () => window.removeEventListener("routeChange", changeRoute);
  }, []);

  useEffect(() => {
    console.log("inside useEffect for making REST call")

    restget("/api/catalogs")
    .then((response: any) => {
      console.log(response);
      setIntegrations(response['data']);
    })

  }, []);

  return (
    <Page kind="wide">
      <PageContent className={container} gap="medium">
        <PageHeader title="Integrations" />
        <Grid className={mainGrid} align="start" gap="medium">
          <LeftNav />
          <MainContent data={integrations} />
        </Grid>
      </PageContent>
    </Page>
  );
};

const MainContent = ({data}: {data: any[]}) => {
  const [cardView, setCardView] = useState(false);

  return (
    <ContentContainer className={container}>
      <Box direction="row" align="start" gap="small" justify="between">
        <Box gap="xsmall">
          <Toolbar>
            <TextInput icon={<Search />} />
            <DropButton kind="toolbar" icon={<Filter />} dropContent={<Box flex></Box>}>

            </DropButton>
            <Button primary label="Add" onClick={() => {window.location.href = "/create_catalog"}} />
          </Toolbar>
        </Box>
        <Box direction="row" gap="small" align="start" justify="between">
          <Button
            icon={cardView ? <List /> : <Apps />}
            onClick={() => setCardView(!cardView)}
            style={{ lineHeight: 0 }}
          />
        </Box>
      </Box>
      {cardView ? (
        <Grid gap="xlarge" pad={{ top: "medium" }} className={cardGrid}>
          {data.map((datum, index) => (
            <Card key={index} data={datum} level={1} />
          ))}
        </Grid>
      ) : (
        <DataTable
          columns={[
            {
              property: "alias",
              header: "Alias",
            },
            { property: "provider_type", header: "Type" },
            { property: "hostname", header: "Hostname" },
            {
              header: "Action",
              render: (datum) => (
                <Link
                  to={`/integrations/?name=${datum.alias}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button label="View details" kind="secondary" />
                </Link>
              ),
            },
          ]}
          data={data}
        />
      )}
    </ContentContainer>
  );
};

export default Integrations;
