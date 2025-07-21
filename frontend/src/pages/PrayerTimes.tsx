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
  IonList,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { timeOutline, locationOutline, compassOutline } from 'ionicons/icons';
import './PrayerTimes.css';

const PrayerTimes: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('jakarta');
  
  // Placeholder data - will be replaced with API data
  const cities = [
    { value: 'jakarta', label: 'Jakarta' },
    { value: 'surabaya', label: 'Surabaya' },
    { value: 'bandung', label: 'Bandung' },
    { value: 'medan', label: 'Medan' },
    { value: 'semarang', label: 'Semarang' }
  ];

  const prayerTimes = [
    { name: 'Subuh', time: '04:30', passed: true },
    { name: 'Dzuhur', time: '12:15', passed: true },
    { name: 'Ashar', time: '15:30', passed: false },
    { name: 'Maghrib', time: '18:45', passed: false },
    { name: 'Isya', time: '20:00', passed: false }
  ];

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Waktu Sholat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Waktu Sholat</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={locationOutline} /> Pilih Kota
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonSelect 
              value={selectedCity} 
              onSelectionChange={(e) => setSelectedCity(e.detail.value)}
              placeholder="Pilih kota"
            >
              {cities.map(city => (
                <IonSelectOption key={city.value} value={city.value}>
                  {city.label}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={timeOutline} /> Jadwal Sholat Hari Ini
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonList>
              {prayerTimes.map((prayer, index) => (
                <IonItem key={index}>
                  <IonLabel>
                    <h2>{prayer.name}</h2>
                    <p style={{ color: prayer.passed ? '#999' : '#000' }}>
                      {prayer.time} {prayer.passed ? '(sudah lewat)' : ''}
                    </p>
                  </IonLabel>
                </IonItem>
              ))}
            </IonList>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={compassOutline} /> Arah Kiblat
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="12" className="ion-text-center">
                  <div className="qibla-compass">
                    <IonIcon icon={compassOutline} style={{ fontSize: '100px', color: '#3880ff' }} />
                  </div>
                  <p>Arah kiblat: 295° (Barat Laut)</p>
                  <p><small>Berdasarkan lokasi: {cities.find(c => c.value === selectedCity)?.label}</small></p>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default PrayerTimes;