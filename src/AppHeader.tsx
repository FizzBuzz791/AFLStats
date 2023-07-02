import { Divider, Group, Header, Title } from "@mantine/core";
import { ThemeToggle } from "./ThemeToggle";
import { GitHubLink } from "./GitHubLink";

function AppHeader() {
  return (
    <Header height={60}>
      <Group sx={{ height: "100%" }} px={20} position="apart">
        <Group>
          <Title>AFL Stats</Title>
        </Group>
        <Group>
          <ThemeToggle />
          <Divider orientation="vertical" />
          <GitHubLink />
        </Group>
      </Group>
    </Header>
  );
}

export default AppHeader;
