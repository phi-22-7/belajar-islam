import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
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
  IonToast,
  IonBackButton,
  IonButtons
} from '@ionic/react';
import { arrowBackOutline, wifiOutline } from 'ionicons/icons';
import QuranService, { SurahWithVerses } from '../services/quran';
import OfflineService from '../services/offline';
import './SurahReader.css';

interface SurahParams {
  surahNumber: string;
}

const SurahReader: React.FC = () => {
  const { surahNumber } = useParams<SurahParams>();
  const history = useHistory();
  const [surah, setSurah] = useState<SurahWithVerses | null>(null);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isOnline, setIsOnline] = useState(OfflineService.isOnline());

  useEffect(() => {
    const loadSurah = async () => {
      if (!surahNumber) {
        setToastMessage('Invalid surah number');
        setShowToast(true);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const surahData = await QuranService.getSurah(parseInt(surahNumber));
        if (surahData) {
          setSurah(surahData);
          
          if (!isOnline) {
            setToastMessage('Surah dimuat dari penyimpanan offline');
            setShowToast(true);
          }
        } else {
          setToastMessage('Surah tidak ditemukan');
          setShowToast(true);
        }
      } catch (error) {
        console.error('Error loading surah:', error);
        setToastMessage('Gagal memuat surah');
        setShowToast(true);
      }
      setLoading(false);
    };

    loadSurah();

    // Listen for online/offline status changes
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [surahNumber, isOnline]);

  const goBack = () => {
    history.goBack();
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/quran" />
          </IonButtons>
          <IonTitle>
            {surah ? `${surah.number}. ${surah.name}` : 'Memuat...'}
          </IonTitle>
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
            <IonTitle size="large">
              {surah ? `${surah.number}. ${surah.name}` : 'Memuat...'}
            </IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {!isOnline && (
          <IonCard color="warning">
            <IonCardContent>
              <p><strong>Mode Offline</strong> - Menampilkan data tersimpan</p>
            </IonCardContent>
          </IonCard>
        )}

        {surah && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle className="surah-header">
                <div className="surah-info">
                  <h1>{surah.name}</h1>
                  <h2 className="arabic-name">{surah.arabic_name}</h2>
                  <p>{surah.verses_count} ayat • {surah.revelation_place}</p>
                </div>
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
        )}

        <IonLoading isOpen={loading} message="Memuat surah..." />

        {surah && (
          <IonList>
            {surah.verses.map((verse) => (
              <IonCard key={verse.number} className="verse-card">
                <IonCardContent>
                  <div className="verse-number">
                    <span className="ayah-number">{verse.number}</span>
                  </div>
                  <div className="verse-content">
                    <div className="arabic-text" dir="rtl">
                      {verse.arabic}
                    </div>
                    <div className="translation-text">
                      {verse.translation}
                    </div>
                  </div>
                </IonCardContent>
              </IonCard>
            ))}
          </IonList>
        )}

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

export default SurahReader;