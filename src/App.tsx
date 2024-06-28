import { AppShell, Group, Title } from '@mantine/core'
import './App.css'
import { MainPage } from './pages'
import './i18n/config';
import { icons } from './assets';
import { useTranslation } from 'react-i18next';

function App() {
  const { t } = useTranslation();

  return <AppShell
    header={{ height: 60 }}
  >
    <AppShell.Header>
      <Group m={15}>
        <icons.Logo size={30} />
        <Title order={3}>{t('title')}</Title>
      </Group>
    </AppShell.Header>

    <AppShell.Main>
      <MainPage />
    </AppShell.Main>
  </AppShell>
}

export default App
