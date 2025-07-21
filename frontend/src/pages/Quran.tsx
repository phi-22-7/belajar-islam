import React from 'react';
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
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon
} from '@ionic/react';
import { bookOutline } from 'ionicons/icons';
import './Quran.css';

const Quran: React.FC = () => {
  // Placeholder data - will be replaced with API data
  const surahs = [
    { number: 1, name: 'Al-Fatiha', arabicName: 'الْفَاتِحَة', verses: 7 },
    { number: 2, name: 'Al-Baqarah', arabicName: 'البقرة', verses: 286 },
    { number: 3, name: 'Ali Imran', arabicName: 'آل عمران', verses: 200 },
    { number: 4, name: 'An-Nisa', arabicName: 'النساء', verses: 176 },
    { number: 5, name: 'Al-Maidah', arabicName: 'المائدة', verses: 120 }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Al-Quran</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Al-Quran</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Baca Al-Quran</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Pilih surah yang ingin Anda baca. Al-Quran terdiri dari 114 surah dengan berbagai jumlah ayat.
          </IonCardContent>
        </IonCard>

        <IonList>
          {surahs.map((surah) => (
            <IonItem key={surah.number} button>
              <IonIcon icon={bookOutline} slot="start" />
              <IonLabel>
                <h2>{surah.number}. {surah.name}</h2>
                <h3>{surah.arabicName}</h3>
                <p>{surah.verses} ayat</p>
              </IonLabel>
              <IonButton fill="outline" slot="end">
                Baca
              </IonButton>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Quran;