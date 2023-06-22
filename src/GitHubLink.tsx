import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconBrandGithub } from "@tabler/icons-react";

export function GitHubLink() {
  const { colorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  return (
    <ActionIcon
      variant="outline"
      color={dark ? "white" : "black"}
      onClick={() =>
        window.open("https://github.com/FizzBuzz791/AFLStats", "_blank")
      }
    >
      <IconBrandGithub size="1.1rem" />
    </ActionIcon>
  );
}
