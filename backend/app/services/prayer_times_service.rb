require 'net/http'
require 'json'

class PrayerTimesService
  # Using Aladhan API for prayer times
  BASE_URL = 'http://api.aladhan.com/v1'
  
  def self.get_available_cities
    # Indonesian cities with their coordinates
    [
      { value: 'jakarta', label: 'Jakarta', latitude: -6.2088, longitude: 106.8456 },
      { value: 'surabaya', label: 'Surabaya', latitude: -7.2575, longitude: 112.7521 },
      { value: 'bandung', label: 'Bandung', latitude: -6.9175, longitude: 107.6191 },
      { value: 'medan', label: 'Medan', latitude: 3.5952, longitude: 98.6722 },
      { value: 'semarang', label: 'Semarang', latitude: -6.9667, longitude: 110.4167 },
      { value: 'makassar', label: 'Makassar', latitude: -5.1477, longitude: 119.4327 },
      { value: 'palembang', label: 'Palembang', latitude: -2.9761, longitude: 104.7754 },
      { value: 'yogyakarta', label: 'Yogyakarta', latitude: -7.7956, longitude: 110.3695 },
      { value: 'denpasar', label: 'Denpasar', latitude: -8.6500, longitude: 115.2167 },
      { value: 'balikpapan', label: 'Balikpapan', latitude: -1.2379, longitude: 116.8529 }
    ]
  end
  
  def self.get_prayer_times(city, date = nil)
    city_info = get_available_cities.find { |c| c[:value] == city }
    return nil unless city_info
    
    date ||= Date.current.strftime('%d-%m-%Y')
    
    # For now, return sample data. In production, fetch from external API
    # fetch_prayer_times_from_api(city_info[:latitude], city_info[:longitude], date)
    get_sample_prayer_times(city_info)
  end
  
  def self.get_qibla_direction(city)
    city_info = get_available_cities.find { |c| c[:value] == city }
    return nil unless city_info
    
    # Calculate approximate qibla direction for Indonesian cities
    # All Indonesian cities face roughly northwest to Mecca
    case city
    when 'jakarta', 'bandung', 'semarang'
      { degrees: 295, direction: 'Barat Laut' }
    when 'surabaya', 'yogyakarta'
      { degrees: 292, direction: 'Barat Laut' }
    when 'medan'
      { degrees: 280, direction: 'Barat' }
    when 'makassar', 'balikpapan'
      { degrees: 285, direction: 'Barat Laut' }
    when 'palembang'
      { degrees: 298, direction: 'Barat Laut' }
    when 'denpasar'
      { degrees: 289, direction: 'Barat Laut' }
    else
      { degrees: 295, direction: 'Barat Laut' }
    end
  end
  
  private
  
  def self.get_sample_prayer_times(city_info)
    current_time = Time.current
    
    {
      fajr: { time: '04:30', name: 'Subuh', passed: current_time.hour >= 5 },
      dhuhr: { time: '12:15', name: 'Dzuhur', passed: current_time.hour >= 12 },
      asr: { time: '15:30', name: 'Ashar', passed: current_time.hour >= 15 },
      maghrib: { time: '18:45', name: 'Maghrib', passed: current_time.hour >= 18 },
      isha: { time: '20:00', name: 'Isya', passed: current_time.hour >= 20 }
    }
  end
  
  def self.fetch_prayer_times_from_api(latitude, longitude, date)
    begin
      uri = URI("#{BASE_URL}/timings/#{date}")
      uri.query = URI.encode_www_form({
        latitude: latitude,
        longitude: longitude,
        method: 2, # Islamic Society of North America (ISNA) method
        school: 0  # Shafi school (common in Indonesia)
      })
      
      response = Net::HTTP.get_response(uri)
      
      if response.code == '200'
        data = JSON.parse(response.body, symbolize_names: true)
        parse_prayer_times(data[:data][:timings])
      else
        nil
      end
    rescue => e
      Rails.logger.error "Error fetching prayer times: #{e.message}"
      nil
    end
  end
  
  def self.parse_prayer_times(timings)
    current_time = Time.current
    
    {
      fajr: { 
        time: timings[:Fajr], 
        name: 'Subuh', 
        passed: Time.parse(timings[:Fajr]) < current_time 
      },
      dhuhr: { 
        time: timings[:Dhuhr], 
        name: 'Dzuhur', 
        passed: Time.parse(timings[:Dhuhr]) < current_time 
      },
      asr: { 
        time: timings[:Asr], 
        name: 'Ashar', 
        passed: Time.parse(timings[:Asr]) < current_time 
      },
      maghrib: { 
        time: timings[:Maghrib], 
        name: 'Maghrib', 
        passed: Time.parse(timings[:Maghrib]) < current_time 
      },
      isha: { 
        time: timings[:Isha], 
        name: 'Isya', 
        passed: Time.parse(timings[:Isha]) < current_time 
      }
    }
  end
end