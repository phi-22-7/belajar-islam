import { Surah, SurahWithVerses } from '../services/quran';
import { PrayerTimesResponse, City } from '../services/prayer-times';

interface CachedData {
  timestamp: number;
  data: unknown;
}

class OfflineService {
  private static readonly CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  private static readonly SURAHS_KEY = 'cached_surahs';
  private static readonly PRAYER_TIMES_KEY = 'cached_prayer_times_';
  private static readonly CITIES_KEY = 'cached_cities';

  static isOnline(): boolean {
    return navigator.onLine;
  }

  static cacheSurahs(surahs: Surah[]): void {
    const cachedData: CachedData = {
      timestamp: Date.now(),
      data: surahs
    };
    localStorage.setItem(this.SURAHS_KEY, JSON.stringify(cachedData));
  }

  static getCachedSurahs(): Surah[] | null {
    try {
      const cached = localStorage.getItem(this.SURAHS_KEY);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - cachedData.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.SURAHS_KEY);
        return null;
      }

      return cachedData.data as Surah[];
    } catch (error) {
      console.error('Error reading cached surahs:', error);
      return null;
    }
  }

  static cacheSurah(surahNumber: number, surah: SurahWithVerses): void {
    const cachedData: CachedData = {
      timestamp: Date.now(),
      data: surah
    };
    localStorage.setItem(`cached_surah_${surahNumber}`, JSON.stringify(cachedData));
  }

  static getCachedSurah(surahNumber: number): SurahWithVerses | null {
    try {
      const cached = localStorage.getItem(`cached_surah_${surahNumber}`);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - cachedData.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(`cached_surah_${surahNumber}`);
        return null;
      }

      return cachedData.data as SurahWithVerses;
    } catch (error) {
      console.error('Error reading cached surah:', error);
      return null;
    }
  }

  static cachePrayerTimes(city: string, prayerTimes: PrayerTimesResponse): void {
    const cachedData: CachedData = {
      timestamp: Date.now(),
      data: prayerTimes
    };
    localStorage.setItem(this.PRAYER_TIMES_KEY + city, JSON.stringify(cachedData));
  }

  static getCachedPrayerTimes(city: string): PrayerTimesResponse | null {
    try {
      const cached = localStorage.getItem(this.PRAYER_TIMES_KEY + city);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      
      // Prayer times cache is only valid for same day
      const cacheDate = new Date(cachedData.timestamp).toDateString();
      const currentDate = new Date().toDateString();
      
      if (cacheDate !== currentDate) {
        localStorage.removeItem(this.PRAYER_TIMES_KEY + city);
        return null;
      }

      return cachedData.data as PrayerTimesResponse;
    } catch (error) {
      console.error('Error reading cached prayer times:', error);
      return null;
    }
  }

  static cacheCities(cities: City[]): void {
    const cachedData: CachedData = {
      timestamp: Date.now(),
      data: cities
    };
    localStorage.setItem(this.CITIES_KEY, JSON.stringify(cachedData));
  }

  static getCachedCities(): City[] | null {
    try {
      const cached = localStorage.getItem(this.CITIES_KEY);
      if (!cached) return null;

      const cachedData: CachedData = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - cachedData.timestamp > this.CACHE_DURATION) {
        localStorage.removeItem(this.CITIES_KEY);
        return null;
      }

      return cachedData.data as City[];
    } catch (error) {
      console.error('Error reading cached cities:', error);
      return null;
    }
  }

  static clearAllCache(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith('cached_')) {
        localStorage.removeItem(key);
      }
    });
  }

  static registerServiceWorker(): void {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }
}

export default OfflineService;