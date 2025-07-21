import OfflineService from './offline';

// QuranJSON data structure interfaces
export interface QuranJSONSurah {
  name: string;
  name_translations: {
    ar: string;
    en: string;
    id: string;
  };
  number_of_ayah: number;
  number_of_surah: number;
  place: string;
  recitation?: string;
  type: string;
}

export interface QuranJSONVerse {
  number: number;
  text: string;
  translation_en: string;
  translation_id: string;
}

export interface QuranJSONSurahWithVerses extends QuranJSONSurah {
  recitations?: Array<{
    name: string;
    audio_url: string;
  }>;
  verses: QuranJSONVerse[];
}

// Legacy interfaces for compatibility
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
  // Convert QuranJSON data to legacy format for compatibility
  private static convertQuranJSONToLegacy(quranJSONSurah: QuranJSONSurah): Surah {
    return {
      number: quranJSONSurah.number_of_surah,
      name: quranJSONSurah.name,
      english_name: quranJSONSurah.name_translations.en,
      arabic_name: quranJSONSurah.name_translations.ar,
      verses_count: quranJSONSurah.number_of_ayah,
      revelation_place: quranJSONSurah.place.toLowerCase() === 'mecca' ? 'makkah' : 'madinah'
    };
  }

  private static convertQuranJSONWithVersesToLegacy(quranJSONSurah: QuranJSONSurahWithVerses): SurahWithVerses {
    const baseSurah = this.convertQuranJSONToLegacy(quranJSONSurah);
    return {
      ...baseSurah,
      verses: quranJSONSurah.verses.map(verse => ({
        number: verse.number,
        arabic: verse.text,
        translation: verse.translation_id // Use Indonesian translation as default
      }))
    };
  }

  static async getSurahs(): Promise<Surah[]> {
    // Try to get from cache first if offline
    if (!OfflineService.isOnline()) {
      const cached = OfflineService.getCachedSurahs();
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await fetch('/data/quran/quran.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const quranData: QuranJSONSurah[] = await response.json();
      const surahs = quranData.map(this.convertQuranJSONToLegacy);
      
      // Cache the data for offline use
      if (surahs.length > 0) {
        OfflineService.cacheSurahs(surahs);
      }
      
      return surahs;
    } catch (error) {
      console.error('Error loading Quran data from local JSON:', error);
      
      // Try cache as fallback
      const cached = OfflineService.getCachedSurahs();
      return cached || [];
    }
  }

  static async getSurah(surahNumber: number): Promise<SurahWithVerses | null> {
    // Try to get from cache first if offline
    if (!OfflineService.isOnline()) {
      const cached = OfflineService.getCachedSurah(surahNumber);
      if (cached) {
        return cached;
      }
    }

    try {
      const response = await fetch(`/data/quran/surah/${surahNumber}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const surahData: QuranJSONSurahWithVerses = await response.json();
      const surah = this.convertQuranJSONWithVersesToLegacy(surahData);
      
      // Cache the data for offline use
      if (surah) {
        OfflineService.cacheSurah(surahNumber, surah);
      }
      
      return surah;
    } catch (error) {
      console.error('Error loading surah data from local JSON:', error);
      
      // Try cache as fallback
      const cached = OfflineService.getCachedSurah(surahNumber);
      return cached;
    }
  }

  static async getAyah(surahNumber: number, ayahNumber: number): Promise<Ayah | null> {
    try {
      const surah = await this.getSurah(surahNumber);
      if (!surah) {
        return null;
      }
      
      const verse = surah.verses.find(v => v.number === ayahNumber);
      if (!verse) {
        return null;
      }
      
      return {
        surah_number: surahNumber,
        ayah_number: ayahNumber,
        surah_name: surah.name,
        surah_arabic_name: surah.arabic_name,
        arabic: verse.arabic,
        translation: verse.translation
      };
    } catch (error) {
      console.error('Error fetching ayah:', error);
      return null;
    }
  }

  // Method to get raw QuranJSON data (for future use with audio features)
  static async getQuranJSONSurah(surahNumber: number): Promise<QuranJSONSurahWithVerses | null> {
    try {
      const response = await fetch(`/data/quran/surah/${surahNumber}.json`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error loading QuranJSON surah data:', error);
      return null;
    }
  }
}

export default QuranService;