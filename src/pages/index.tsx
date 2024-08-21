import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Grid,
  Heading,
  Legend,
  Meter,
  Nav,
  Page,
  PageContent,
  PageHeader,
  Paragraph,
  Text,
} from "grommet-exp";
import { ReactComponent as Domain } from "grommet-icons/img/domain.svg";
import { ReactComponent as CloudDownload } from "grommet-icons/img/cloud-download.svg";
import { ReactComponent as Database } from "grommet-icons/img/database.svg";
import { ContentContainer } from "../components";
import {
  lowerGrid,
  container,
  mainGrid,
  rightGridContainer,
  upperGrid,
} from "../styles.css";
import { Map } from "../components";

const actions = [
  "Add devices",
  "Add subscriptions",
  "Add users",
  "Assign roles",
  "Create location",
];

const workflows = [
  {
    title: "Build a web app",
    description: `Cloud networking for campus, branch, remote, data center, and
  IoT networks.`,
    icon: <Domain />,
  },
  {
    title: "Import an app",
    description: `Import an existing application onto the GreenLake Cloud Platform.`,
    icon: <CloudDownload />,
  },
  {
    title: "Create a database",
    description: `Monitor, manage and optimize consumption-based IT services, on-premises and in the cloud.`,
    icon: <Database />,
  },
];

const Index = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const changeRoute = () => {
      navigate(window.location.pathname);
    };

    window.addEventListener("routeChange", changeRoute);
    changeRoute();
    return () => window.removeEventListener("routeChange", changeRoute);
  }, []);

  return (
    <Page kind="wide">
      <PageContent className={container} gap="medium">
        <PageHeader
          title="Dashboard"
          actions={
            <Box direction="row-responsive" gap="small">
              <Button label="Customize" kind="secondary" />
              <Button label="Add widget" kind="primary" />
            </Box>
          }
        />
        <Grid gap="medium" pad={{ bottom: "large" }} className={mainGrid}>
          <Box gap="medium">
            <ContentContainer>
              <Heading level={2}>Quick actions</Heading>
              <Nav gap="small">
                {actions.map((action, index) => (
                  <Button key={index} label={action} onClick={() => {window.alert(action)}}/>
                ))}
              </Nav>
            </ContentContainer>
            <ContentContainer>
              <Heading level={2}>Workflows</Heading>
              {workflows.map((workflow, index) => (
                <Box align="start" gap="xsmall" key={index}>
                  {workflow.icon}
                  <Text>{workflow.title}</Text>
                  <Paragraph size="small" color="weak">
                    {workflow.description}
                  </Paragraph>
                </Box>
              ))}
            </ContentContainer>
          </Box>
          <MainContent />
        </Grid>
      </PageContent>
    </Page>
  );
};

const MainContent = () => {
  return (
    <Box gap="medium" className={rightGridContainer}>
      <Grid gap="medium" className={upperGrid}>
        <ContentContainer align="start" justify="between">
          <Box gap="medium">
            <Heading level={2}>Recommendations</Heading>
            <Box gap="small">
              <Text size="xlarge">126 Wellness recommendations</Text>
              <Paragraph size="small">
                Recommendations are based on your current environment and best
                practices.
              </Paragraph>
              <Meter
                thickness="small"
                round
                kind="qualitative"
                values={[
                  { label: "High severity", value: 60 },
                  { label: "Medium severity", value: 35 },
                  { label: "Low severity", value: 5 },
                ]}
              />
              <Legend
                values={[
                  { label: "High severity", value: 60 },
                  { label: "Medium severity", value: 35 },
                  { label: "Low severity", value: 5 },
                ]}
              />
            </Box>
          </Box>
          <Button label="View all recommendations" kind="secondary" />
        </ContentContainer>
        <ContentContainer align="start">
          <Heading level={2}>Open cases</Heading>
          <Meter
            type="circle"
            size="small"
            kind="qualitative"
            values={[
              { label: "Awaiting response", value: 5 },
              { label: "Response sent", value: 6 },
            ]}
            legend
          />
          <Button label="View all cases" kind="secondary" />
        </ContentContainer>
      </Grid>
      <Grid gap="medium" className={lowerGrid}>
        <ContentContainer align="start">
          <Heading level={2}>Locations</Heading>
          <Box height="medium" width="full">
          </Box>
        </ContentContainer>
        <ContentContainer align="start">
          <Heading level={2}>Cost and usage</Heading>
          <Meter
            type="pie"
            size="small"
            kind="qualitative"
            values={[
              { label: "Compute", value: 90000 },
              { label: "Storage", value: 72672 },
              { label: "Database", value: 43732 },
              { label: "Networking", value: 53600 },
              { label: "Other", value: 12000 },
            ]}
            legend
          />
          <Button label="View consumption" kind="secondary" />
        </ContentContainer>
      </Grid>
    </Box>
  );
};

export default Index;
