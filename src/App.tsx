import { AppShell, MantineProvider } from "@mantine/core";
import Content from "./Content";
import AppHeader from "./AppHeader";

import "@mantine/core/styles.css";

function App() {
  return (
    <MantineProvider defaultColorScheme="auto">
      <AppShell padding="md" header={{ height: 60 }}>
        <AppShell.Header>
          <AppHeader />
        </AppShell.Header>
        <AppShell.Main>
          <Content />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}

export default App;
