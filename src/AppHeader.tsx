import { Divider, Group, Title } from "@mantine/core";
import { ThemeToggle } from "./ThemeToggle";
import { GitHubLink } from "./GitHubLink";

function AppHeader() {
  return (
    <Group style={{ height: "100%" }} px={20} justify="space-between">
      <Title>AFL Stats</Title>
      <Group>
        <ThemeToggle />
        <Divider orientation="vertical" />
        <GitHubLink />
      </Group>
    </Group>
  );
}

export default AppHeader;
