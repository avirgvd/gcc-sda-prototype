import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Carousel,
  Page,
  PageContent,
  PageMain,
  PageAside,
  Paragraph,
  Tab,
  Tabs,
} from "grommet-exp";
import { Markdown, Button, PageHeader, Card, CardBody, CardHeader} from "grommet";
import { DetailPageHeader, Details } from "../components";
import data from "../data.json";
import { nameToSlug } from "../utils";

import { restget } from "../utils/restclient";

import { JsonView, allExpanded, darkStyles, defaultStyles } from 'react-json-view-lite';
import 'react-json-view-lite/dist/index.css';

const Detail = () => {
  const { id } = useParams();
  const [page] = Object.values(data).filter(
    (value) => nameToSlug(value.title) === id
  );

  const [detailsPage, setDetailsPage] = useState("");
  const [details, setDetails] = useState({});

  console.log(window.location.href);

  const url_params = new URLSearchParams(window.location.href.split("?")[1]);

  console.log(url_params.get("name"));
  // if (url_params.has("name")) {
  //   setDetailsPage(url_params.get("name"))

  // }

  const navigate = useNavigate();
  // useEffect(() => {
  //   const changeRoute = () => {
  //     navigate(window.location.pathname);
  //   };

  //   window.addEventListener("routeChange", changeRoute);
  //   changeRoute();
  //   return () => window.removeEventListener("routeChange", changeRoute);
  // }, []);

  useEffect(() => {

    const url = "/api/details/?category=" + url_params.get("category") + "&name=" + url_params.get("name")
    restget(url)
    .then((response) => {
      console.log(response)
      setDetails(response)
    })

  }, []);

  return (
    <Box align="center" margin={"large"}>
    <Page kind="full" >
       <PageHeader align="start"
    title="Details"
    subtitle={"For " + url_params.get("category") + " - " + url_params.get("name")}
/>
      <PageContent align="start">
        <PageMain>
          <Card >
          <CardHeader pad="medium">{"Name: " + url_params.get("name")}</CardHeader>
          <CardBody pad="medium">
        <JsonView data={details} shouldExpandNode={allExpanded} style={defaultStyles} />
        </CardBody>
        </Card>
          
        </PageMain>
        <PageAside>
        </PageAside>
      </PageContent>
      <Box align="end" margin={"medium"}>
      <Button primary label="Close" onClick={() => {navigate(-1)}}></Button>
      </Box>
      
    </Page>
    </Box>
  );
};

export default Detail;
