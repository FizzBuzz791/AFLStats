import {
  AppShell,
  ColorScheme,
  ColorSchemeProvider,
  Group,
  Header,
  MantineProvider,
  Title,
} from "@mantine/core";
import { ThemeToggle } from "./ThemeToggle";
import { useColorScheme, useLocalStorage } from "@mantine/hooks";
import Content from "./Content";

function App() {
  const preferredColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: "mantine-color-scheme",
    defaultValue: preferredColorScheme,
    getInitialValueInEffect: true,
  });
  const toggleColorScheme = (value?: ColorScheme) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));

  return (
    <ColorSchemeProvider
      colorScheme={colorScheme}
      toggleColorScheme={toggleColorScheme}
    >
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{ colorScheme }}
      >
        <AppShell
          padding="md"
          header={
            <Header height={60}>
              <Group sx={{ height: "100%" }} px={20} position="apart">
                <Group>
                  <Title>AFL Stats</Title>
                </Group>
                <ThemeToggle />
              </Group>
            </Header>
          }
        >
          <Content />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  );
}

export default App;
