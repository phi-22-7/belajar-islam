import ApiService from './api';
import OfflineService from './offline';

export interface City {
  value: string;
  label: string;
  latitude: number;
  longitude: number;
}

export interface PrayerTime {
  time: string;
  name: string;
  passed: boolean;
}

export interface PrayerTimes {
  fajr: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
}

export interface QiblaDirection {
  degrees: number;
  direction: string;
}

export interface PrayerTimesResponse {
  city: string;
  date: string;
  prayer_times: PrayerTimes;
  qibla_direction: QiblaDirection;
}

class PrayerTimesService {
  static async getCities(): Promise<City[]> {
    // Try to get from cache first if offline
    if (!OfflineService.isOnline()) {
      const cached = OfflineService.getCachedCities();
      if (cached) {
        return cached;
      }
    }

    const response = await ApiService.get<{ cities: City[] }>('/cities');
    if (response.error) {
      console.error('Error fetching cities:', response.error);
      
      // Try cache as fallback
      const cached = OfflineService.getCachedCities();
      return cached || [];
    }
    
    const cities = response.data?.cities || [];
    
    // Cache the data for offline use
    if (cities.length > 0) {
      OfflineService.cacheCities(cities);
    }
    
    return cities;
  }

  static async getPrayerTimes(city: string, date?: string): Promise<PrayerTimesResponse | null> {
    // Try to get from cache first if offline
    if (!OfflineService.isOnline()) {
      const cached = OfflineService.getCachedPrayerTimes(city);
      if (cached) {
        return cached;
      }
    }

    const endpoint = date ? `/prayer-times/${city}?date=${date}` : `/prayer-times/${city}`;
    const response = await ApiService.get<PrayerTimesResponse>(endpoint);
    if (response.error) {
      console.error('Error fetching prayer times:', response.error);
      
      // Try cache as fallback
      const cached = OfflineService.getCachedPrayerTimes(city);
      return cached;
    }
    
    const prayerTimes = response.data || null;
    
    // Cache the data for offline use
    if (prayerTimes) {
      OfflineService.cachePrayerTimes(city, prayerTimes);
    }
    
    return prayerTimes;
  }

  static async enableNotifications(city: string): Promise<boolean> {
    const response = await ApiService.post('/notifications/enable-prayer', { city });
    return !response.error;
  }

  static async disableNotifications(): Promise<boolean> {
    const response = await ApiService.delete('/notifications/disable-prayer');
    return !response.error;
  }
}

export default PrayerTimesService;