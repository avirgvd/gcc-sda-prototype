import { Button, Heading, Paragraph, Text } from "grommet-exp";
import { Box } from "grommet";
import { nameToSlug } from "../utils";
import { Link } from "react-router-dom";

export const Card = ({
  data: { alias, hostname, provider_type },
  level,
}: {
  data: {
    alias: string;
    hostname?: string;
    provider_type?: string;
  };
  level?: 1 | 2 | 3;
}) => (
  <Box align="start" gap="medium" border={{"color":"border","size":"small","side":"all","style":"solid"}} round="small" pad={"small"}>
    <Box align="start" gap="small">
      <Box>
        <Heading level={level}>{alias}</Heading>
      </Box>
      <Paragraph><b>Type:</b> {provider_type}</Paragraph>
      <Paragraph><b>Hostname:</b> {hostname}</Paragraph>
    </Box>
    <Link
      to={`/integrations/?name=${(alias)}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Button label="View details" kind="secondary" />
    </Link>
  </Box>
);
