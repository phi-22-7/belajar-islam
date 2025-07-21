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
import { createOutline, personOutline, mailOutline, lockClosedOutline } from 'ionicons/icons';
import './Register.css';

const Register: React.FC = () => {
  const history = useHistory();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const handleRegister = async () => {
    try {
      // Validation
      if (!name || !email || !password || !confirmPassword) {
        setAlertMessage('Semua field harus diisi');
        setShowAlert(true);
        return;
      }

      if (password !== confirmPassword) {
        setAlertMessage('Password dan konfirmasi password tidak cocok');
        setShowAlert(true);
        return;
      }

      if (password.length < 6) {
        setAlertMessage('Password minimal 6 karakter');
        setShowAlert(true);
        return;
      }

      // TODO: Implement actual API call
      console.log('Register attempt:', { name, email, password, role });
      
      // Simulate API call
      setAlertMessage('Registrasi berhasil! Silakan login.');
      setShowAlert(true);
      setTimeout(() => {
        history.push('/login');
      }, 1500);
    } catch (error) {
      console.error('Registration error:', error);
      setAlertMessage('Terjadi kesalahan saat registrasi');
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
          <IonTitle>Daftar</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={createOutline} /> Buat Akun Baru
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <div className="register-form">
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonInput
                  label="Nama Lengkap"
                  labelPlacement="stacked"
                  type="text"
                  placeholder="masukkan nama lengkap"
                  value={name}
                  onIonInput={(e) => setName(e.detail.value!)}
                />
              </IonItem>
              
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
                  placeholder="masukkan password (min. 6 karakter)"
                  value={password}
                  onIonInput={(e) => setPassword(e.detail.value!)}
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={lockClosedOutline} slot="start" />
                <IonInput
                  label="Konfirmasi Password"
                  labelPlacement="stacked"
                  type="password"
                  placeholder="ulangi password"
                  value={confirmPassword}
                  onIonInput={(e) => setConfirmPassword(e.detail.value!)}
                />
              </IonItem>
              
              <IonItem>
                <IonIcon icon={personOutline} slot="start" />
                <IonSelect
                  label="Daftar sebagai"
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
                  onClick={handleRegister}
                  disabled={!name || !email || !password || !confirmPassword}
                >
                  <IonIcon icon={createOutline} slot="start" />
                  Daftar
                </IonButton>
                
                <IonButton 
                  expand="block" 
                  fill="clear"
                  onClick={() => history.push('/login')}
                >
                  Sudah punya akun? Masuk di sini
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

export default Register;