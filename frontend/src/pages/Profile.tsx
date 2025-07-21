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
  IonList,
  IonItem,
  IonLabel
} from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { personOutline, logInOutline, logOutOutline, createOutline, helpCircleOutline } from 'ionicons/icons';
import './Profile.css';

const Profile: React.FC = () => {
  const history = useHistory();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // TODO: Replace with actual auth state
  const [user, setUser] = useState(null); // TODO: Replace with actual user data

  const handleLogin = () => {
    history.push('/login');
  };

  const handleRegister = () => {
    history.push('/register');
  };

  const handleLogout = () => {
    // TODO: Implement logout logic
    setIsLoggedIn(false);
    setUser(null);
  };

  if (!isLoggedIn) {
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent fullscreen>
          <IonHeader collapse="condense">
            <IonToolbar>
              <IonTitle size="large">Profil</IonTitle>
            </IonToolbar>
          </IonHeader>
          
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={personOutline} /> Selamat Datang
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Silakan masuk atau daftar untuk menggunakan fitur lengkap aplikasi Belajar Islam.</p>
              
              <div className="auth-buttons">
                <IonButton expand="block" onClick={handleLogin}>
                  <IonIcon icon={logInOutline} slot="start" />
                  Masuk
                </IonButton>
                
                <IonButton expand="block" fill="outline" onClick={handleRegister}>
                  <IonIcon icon={createOutline} slot="start" />
                  Daftar
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>

          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Tentang Aplikasi</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Aplikasi Belajar Islam menyediakan:</p>
              <IonList>
                <IonItem>
                  <IonLabel>• Al-Quran digital lengkap</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>• Jadwal waktu sholat dan arah kiblat</IonLabel>
                </IonItem>
                <IonItem>
                  <IonLabel>• Forum tanya jawab dengan ustadz</IonLabel>
                </IonItem>
              </IonList>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Profil</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Profil</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={personOutline} /> Informasi Pengguna
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem>
                <IonLabel>
                  <h2>Nama</h2>
                  <p>{user?.name || 'Nama Pengguna'}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Email</h2>
                  <p>{user?.email || 'user@example.com'}</p>
                </IonLabel>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <h2>Role</h2>
                  <p>{user?.role === 'admin' ? 'Ustadz' : 'Pengguna'}</p>
                </IonLabel>
              </IonItem>
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={helpCircleOutline} /> Aktivitas
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              <IonItem button>
                <IonLabel>
                  <h2>Pertanyaan Saya</h2>
                  <p>Lihat daftar pertanyaan yang telah diajukan</p>
                </IonLabel>
              </IonItem>
              {user?.role === 'admin' && (
                <IonItem button>
                  <IonLabel>
                    <h2>Jawab Pertanyaan</h2>
                    <p>Jawab pertanyaan dari pengguna</p>
                  </IonLabel>
                </IonItem>
              )}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardContent>
            <IonButton expand="block" color="danger" onClick={handleLogout}>
              <IonIcon icon={logOutOutline} slot="start" />
              Keluar
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Profile;