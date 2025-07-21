import React, { useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
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
  IonIcon,
  IonLoading,
  IonToast
} from '@ionic/react';
import { bookOutline, wifiOutline } from 'ionicons/icons';
import QuranService, { Surah } from '../services/quran';
import OfflineService from '../services/offline';
import './Quran.css';

const Quran: React.FC = () => {
  const history = useHistory();
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isOnline, setIsOnline] = useState(OfflineService.isOnline());

  const loadSurahs = useCallback(async () => {
    setLoading(true);
    try {
      const surahList = await QuranService.getSurahs();
      setSurahs(surahList);
      
      if (!isOnline && surahList.length > 0) {
        setToastMessage('Data Al-Quran dimuat dari penyimpanan offline');
        setShowToast(true);
      }
    } catch (error) {
      console.error('Error loading surahs:', error);
      setToastMessage('Failed to load Quran data');
      setShowToast(true);
    }
    setLoading(false);
  }, [isOnline]);

  useEffect(() => {
    loadSurahs();

    // Listen for online/offline status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [loadSurahs]);

  const handleReadSurah = async (surahNumber: number) => {
    // Navigate to surah reading page
    history.push(`/quran/surah/${surahNumber}`);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Al-Quran</IonTitle>
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
            <IonTitle size="large">Al-Quran</IonTitle>
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
            <IonCardTitle>Baca Al-Quran</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            Pilih surah yang ingin Anda baca. Al-Quran terdiri dari 114 surah dengan berbagai jumlah ayat.
            {!isOnline && surahs.length > 0 && (
              <p><small><strong>Tersedia offline:</strong> Data surah tersimpan untuk akses tanpa internet.</small></p>
            )}
          </IonCardContent>
        </IonCard>

        <IonLoading isOpen={loading} message="Loading Quran data..." />

        <IonList>
          {surahs.map((surah) => (
            <IonItem key={surah.number} button>
              <IonIcon icon={bookOutline} slot="start" />
              <IonLabel>
                <h2>{surah.number}. {surah.name}</h2>
                <h3>{surah.arabic_name}</h3>
                <p>{surah.verses_count} ayat • {surah.revelation_place}</p>
              </IonLabel>
              <IonButton 
                fill="outline" 
                slot="end"
                onClick={() => handleReadSurah(surah.number)}
              >
                Baca
              </IonButton>
            </IonItem>
          ))}
        </IonList>

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

export default Quran;