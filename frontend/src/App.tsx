import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { bookOutline, timeOutline, helpCircleOutline, personOutline } from 'ionicons/icons';

// Pages
import Quran from './pages/Quran';
import PrayerTimes from './pages/PrayerTimes';
import Questions from './pages/Questions';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/quran">
            <Quran />
          </Route>
          <Route exact path="/prayer-times">
            <PrayerTimes />
          </Route>
          <Route path="/questions">
            <Questions />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/register">
            <Register />
          </Route>
          <Route exact path="/">
            <Redirect to="/quran" />
          </Route>
        </IonRouterOutlet>
        <IonTabBar slot="bottom">
          <IonTabButton tab="quran" href="/quran">
            <IonIcon aria-hidden="true" icon={bookOutline} />
            <IonLabel>Al-Quran</IonLabel>
          </IonTabButton>
          <IonTabButton tab="prayer-times" href="/prayer-times">
            <IonIcon aria-hidden="true" icon={timeOutline} />
            <IonLabel>Waktu Sholat</IonLabel>
          </IonTabButton>
          <IonTabButton tab="questions" href="/questions">
            <IonIcon aria-hidden="true" icon={helpCircleOutline} />
            <IonLabel>Tanya Jawab</IonLabel>
          </IonTabButton>
          <IonTabButton tab="profile" href="/profile">
            <IonIcon aria-hidden="true" icon={personOutline} />
            <IonLabel>Profil</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
