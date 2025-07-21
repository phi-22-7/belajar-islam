import ApiService from './api';
import OfflineService from './offline';

export interface Surah {
  number: number;
  name: string;
  english_name: string;
  arabic_name: string;
  verses_count: number;
  revelation_place: string;
}

export interface Verse {
  number: number;
  arabic: string;
  translation: string;
}

export interface SurahWithVerses extends Surah {
  verses: Verse[];
}

export interface Ayah {
  surah_number: number;
  ayah_number: number;
  surah_name: string;
  surah_arabic_name: string;
  arabic: string;
  translation: string;
}

class QuranService {
  static async getSurahs(): Promise<Surah[]> {
    // Try to get from cache first if offline
    if (!OfflineService.isOnline()) {
      const cached = OfflineService.getCachedSurahs();
      if (cached) {
        return cached;
      }
    }

    const response = await ApiService.get<{ surahs: Surah[] }>('/quran');
    if (response.error) {
      console.error('Error fetching surahs:', response.error);
      
      // Try cache as fallback
      const cached = OfflineService.getCachedSurahs();
      return cached || [];
    }
    
    const surahs = response.data?.surahs || [];
    
    // Cache the data for offline use
    if (surahs.length > 0) {
      OfflineService.cacheSurahs(surahs);
    }
    
    return surahs;
  }

  static async getSurah(surahNumber: number): Promise<SurahWithVerses | null> {
    // Try to get from cache first if offline
    if (!OfflineService.isOnline()) {
      const cached = OfflineService.getCachedSurah(surahNumber);
      if (cached) {
        return cached;
      }
    }

    const response = await ApiService.get<{ surah: SurahWithVerses }>(`/quran/${surahNumber}`);
    if (response.error) {
      console.error('Error fetching surah:', response.error);
      
      // Try cache as fallback
      const cached = OfflineService.getCachedSurah(surahNumber);
      return cached;
    }
    
    const surah = response.data?.surah || null;
    
    // Cache the data for offline use
    if (surah) {
      OfflineService.cacheSurah(surahNumber, surah);
    }
    
    return surah;
  }

  static async getAyah(surahNumber: number, ayahNumber: number): Promise<Ayah | null> {
    const response = await ApiService.get<{ ayah: Ayah }>(`/quran/${surahNumber}/${ayahNumber}`);
    if (response.error) {
      console.error('Error fetching ayah:', response.error);
      return null;
    }
    return response.data?.ayah || null;
  }
}

export default QuranService;