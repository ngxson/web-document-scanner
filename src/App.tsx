import { AppContextProvider, useAppContext } from './AppContext';
import LoadingScreen from './screen/LoadingScreen';
import LoginScreen from './screen/LoginScreen';
import MainScreen from './screen/MainScreen';

function App() {
  return <AppContextProvider>
    <MainContent />
  </AppContextProvider>;
}

function MainContent() {
  const { auth } = useAppContext();

  return <div className="app">
    <h3 className="web-title">📄 Web Document Scanner</h3>
    {(auth === 'loading')
      ? <LoadingScreen />
      : auth === 'loggedOut' ? <LoginScreen /> : <MainScreen />
    }
  </div>;
}

export default App;
