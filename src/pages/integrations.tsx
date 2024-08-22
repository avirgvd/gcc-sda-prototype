import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
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
import data from "../data.json";
import { nameToSlug } from "../utils";
import { cardGrid, container, mainGrid } from "../styles.css";
import {Search, Filter} from "grommet-icons";
import {Toolbar} from "grommet/components/Toolbar";
import {DropButton, TextInput} from "grommet";

import {restget} from "../utils/restclient";


const Integrations = () => {

  const [integrations, setIntegrations] = useState({});

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

    restget("/api/integrations")
    .then((response: JSON) => {
      console.log(response);
      setIntegrations(response);
    })

  }, []);

  return (
    <Page kind="wide">
      <PageContent className={container} gap="medium">
        <PageHeader title="Integrations" />
        <Grid className={mainGrid} align="start" gap="medium">
          <LeftNav />
          <MainContent />
        </Grid>
      </PageContent>
    </Page>
  );
};

const MainContent = () => {
  const [cardView, setCardView] = useState(false);

  return (
    <ContentContainer className={container}>
      <Box direction="row" align="start" gap="small" justify="between">
        <Box gap="xsmall">
          <Toolbar>
            <TextInput icon={<Search />} />
            <DropButton kind="toolbar" icon={<Filter />} dropContent={<Box flex></Box>}>

            </DropButton>
            <Button label="Add" onClick={() => {window.location.href = "/add_integration"}} />
          </Toolbar>
        </Box>
        <Box direction="row" gap="small" align="start" justify="between">
          <Box width="small">
            <Select
              value="All regions"
              options={["All regions", "Africa", "Asia Pacific", "Europe"]}
            />
          </Box>
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
            <Card key={index} data={datum} level={3} />
          ))}
        </Grid>
      ) : (
        <DataTable
          columns={[
            {
              property: "title",
              header: "Name",
            },
            { property: "author", header: "Publisher" },
            { property: "region", header: "Region" },
            {
              property: "category",
              header: "Type",
              render: (datum) => datum.category || "--",
            },
            {
              header: "Action",
              render: (datum) => (
                <Link
                  to={`/${nameToSlug(datum.title)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Button label="View detailsss" kind="secondary" />
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
