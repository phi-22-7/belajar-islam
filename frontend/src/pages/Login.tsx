import React, { useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { logInOutline, personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import './Login.css';

const Login: React.FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleLogin = async () => {
    try {
      // TODO: Implement actual API call
      console.log('Login attempt:', { email, password, role });
      
      // Simulate API call
      if (email && password) {
        // Mock successful login
        setAlertMessage('Login berhasil!');
        setShowAlert(true);
        setTimeout(() => {
          history.push('/profile');
        }, 1500);
      } else {
        setAlertMessage('Email dan password harus diisi');
        setShowAlert(true);
      }
    } catch (error) {
      console.error('Login error:', error);
      setAlertMessage('Terjadi kesalahan saat login');
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/profile" />
          </IonButtons>
          <IonTitle>Masuk</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={logInOutline} /> Masuk ke Akun Anda
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="login-form">
              <IonItem>
                <IonIcon icon={mailOutline} slot="start" />
                <IonInput
                  label="Email"
                  labelPlacement="stacked"
                  type="email"
                  placeholder="masukkan email"
                  value={email}
                  onIonInput={(e) => setEmail(e.detail.value!)}
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={lockClosedOutline} slot="start" />
                <IonInput
                  label="Password"
                  labelPlacement="stacked"
                  type="password"
                  placeholder="masukkan password"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonSelect
                  label="Masuk sebagai"
                  labelPlacement="stacked"
                  value={role}
                  onIonChange={(e) => setRole(e.detail.value)}
                >
                  <IonSelectOption value="user">Pengguna</IonSelectOption>
                  <IonSelectOption value="admin">Ustadz</IonSelectOption>
                </IonSelect>
              </IonItem>
              
              <div className="form-buttons">
                <IonButton 
                  expand="block" 
                  onClick={handleLogin}
                  disabled={!email || !password}
                >
                  <IonIcon icon={logInOutline} slot="start" />
                  Masuk
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  fill="clear"
                  onClick={() => history.push('/register')}
                >
                  Belum punya akun? Daftar di sini
                </IonButton>
              </div>
            </div>
          </IonCardContent>
        </IonCard>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          header="Informasi"
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default Login;