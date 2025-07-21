import React, { useState, useEffect, useCallback } from 'react';
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
  IonCol,
  IonLoading,
  IonToast,
  IonButton,
  IonToggle
} from '@ionic/react';
import { timeOutline, locationOutline, compassOutline, notificationsOutline, wifiOutline } from 'ionicons/icons';
import PrayerTimesService, { City, PrayerTimesResponse } from '../services/prayer-times';
import OfflineService from '../services/offline';
import './PrayerTimes.css';

const PrayerTimes: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('jakarta');
  const [cities, setCities] = useState<City[]>([]);
  const [prayerData, setPrayerData] = useState<PrayerTimesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isOnline, setIsOnline] = useState(OfflineService.isOnline());

  const loadPrayerTimes = useCallback(async () => {
    try {
      const data = await PrayerTimesService.getPrayerTimes(selectedCity);
      setPrayerData(data);
    } catch (error) {
      console.error('Error loading prayer times:', error);
      setToastMessage('Failed to load prayer times');
      setShowToast(true);
    }
  }, [selectedCity]);

  useEffect(() => {
    loadInitialData();

    // Listen for online/offline status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (selectedCity) {
      loadPrayerTimes();
    }
  }, [selectedCity, loadPrayerTimes]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const citiesList = await PrayerTimesService.getCities();
      setCities(citiesList);
      
      if (citiesList.length > 0) {
        const defaultCity = citiesList.find(c => c.value === 'jakarta') || citiesList[0];
        setSelectedCity(defaultCity.value);
      }
    } catch (error) {
      console.error('Error loading cities:', error);
      setToastMessage('Failed to load cities data');
      setShowToast(true);
    }
    setLoading(false);
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    setNotificationsEnabled(enabled);
    
    try {
      if (enabled) {
        const success = await PrayerTimesService.enableNotifications(selectedCity);
        if (success) {
          setToastMessage('Prayer notifications enabled');
        } else {
          setToastMessage('Failed to enable notifications');
          setNotificationsEnabled(false);
        }
      } else {
        const success = await PrayerTimesService.disableNotifications();
        if (success) {
          setToastMessage('Prayer notifications disabled');
        } else {
          setToastMessage('Failed to disable notifications');
          setNotificationsEnabled(true);
        }
      }
      setShowToast(true);
    } catch (error) {
      console.error('Error updating notifications:', error);
      setToastMessage('Error updating notification settings');
      setShowToast(true);
      setNotificationsEnabled(!enabled);
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getPrayerTimesArray = () => {
    if (!prayerData) return [];
    
    return [
      prayerData.prayer_times.fajr,
      prayerData.prayer_times.dhuhr,
      prayerData.prayer_times.asr,
      prayerData.prayer_times.maghrib,
      prayerData.prayer_times.isha
    ];
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Waktu Sholat</IonTitle>
          <IonButton slot="end" fill="clear">
            <IonIcon 
              icon={wifiOutline} 
              color={isOnline ? 'success' : 'danger'} 
            />
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Waktu Sholat</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {!isOnline && (
          <IonCard color="warning">
            <IonCardContent>
              <p><strong>Mode Offline</strong> - Menampilkan data tersimpan</p>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={locationOutline} /> Pilih Kota
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonSelect 
              value={selectedCity} 
              onIonChange={(e) => setSelectedCity(e.detail.value)}
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
              <IonIcon icon={notificationsOutline} /> Notifikasi Sholat
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel>
                <h3>Pengingat Waktu Sholat</h3>
                <p>Dapatkan notifikasi 10 menit sebelum waktu sholat</p>
              </IonLabel>
              <IonToggle 
                checked={notificationsEnabled}
                onIonChange={(e) => handleNotificationToggle(e.detail.checked)}
                disabled={!isOnline}
              />
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>
              <IonIcon icon={timeOutline} /> Jadwal Sholat Hari Ini
            </IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p><strong>{getCurrentDate()}</strong></p>
            <IonList>
              {getPrayerTimesArray().map((prayer, index) => (
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
                  {prayerData?.qibla_direction && (
                    <>
                      <p>Arah kiblat: {prayerData.qibla_direction.degrees}° ({prayerData.qibla_direction.direction})</p>
                      <p><small>Berdasarkan lokasi: {cities.find(c => c.value === selectedCity)?.label}</small></p>
                    </>
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>

        <IonLoading isOpen={loading} message="Loading prayer times..." />

        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
        />
      </IonContent>
    </IonPage>
  );
};

export default PrayerTimes;