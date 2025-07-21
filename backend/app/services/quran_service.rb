require 'net/http'
require 'json'

class QuranService
  # Using Quran API (https://api.quran.com or similar)
  BASE_URL = 'https://api.quran.com/api/v4'
  
  def self.get_surahs_list
    # For now, return static data. In production, this could be cached from API
    # or stored in database for offline access
    [
      { number: 1, name: 'Al-Fatiha', english_name: 'The Opening', arabic_name: 'الْفَاتِحَة', verses_count: 7, revelation_place: 'makkah' },
      { number: 2, name: 'Al-Baqarah', english_name: 'The Cow', arabic_name: 'البقرة', verses_count: 286, revelation_place: 'madinah' },
      { number: 3, name: 'Ali Imran', english_name: 'The Family of Imran', arabic_name: 'آل عمران', verses_count: 200, revelation_place: 'madinah' },
      { number: 4, name: 'An-Nisa', english_name: 'The Women', arabic_name: 'النساء', verses_count: 176, revelation_place: 'madinah' },
      { number: 5, name: 'Al-Maidah', english_name: 'The Table', arabic_name: 'المائدة', verses_count: 120, revelation_place: 'madinah' },
      { number: 6, name: 'Al-Anam', english_name: 'The Cattle', arabic_name: 'الأنعام', verses_count: 165, revelation_place: 'makkah' },
      { number: 7, name: 'Al-Araf', english_name: 'The Heights', arabic_name: 'الأعراف', verses_count: 206, revelation_place: 'makkah' },
      { number: 8, name: 'Al-Anfal', english_name: 'The Spoils of War', arabic_name: 'الأنفال', verses_count: 75, revelation_place: 'madinah' },
      { number: 9, name: 'At-Tawbah', english_name: 'The Repentance', arabic_name: 'التوبة', verses_count: 129, revelation_place: 'madinah' },
      { number: 10, name: 'Yunus', english_name: 'Jonah', arabic_name: 'يونس', verses_count: 109, revelation_place: 'makkah' }
    ]
  end
  
  def self.get_surah(surah_number)
    # In production, this would fetch from external API or local database
    # For now, return sample data for demonstration
    surah_info = get_surahs_list.find { |s| s[:number] == surah_number.to_i }
    return nil unless surah_info
    
    # Sample verses for Al-Fatiha (Surah 1)
    if surah_number.to_i == 1
      surah_info.merge({
        verses: [
          { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', translation: 'In the name of Allah, the Beneficent, the Merciful.' },
          { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: 'Praise be to Allah, Lord of the Worlds,' },
          { number: 3, arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', translation: 'The Beneficent, the Merciful.' },
          { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Master of the Day of Judgment,' },
          { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'Thee (alone) we worship; Thee (alone) we ask for help.' },
          { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Show us the straight path,' },
          { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those whom Thou hast favoured; Not the (path) of those who earn Thine anger nor of those who go astray.' }
        ]
      })
    else
      surah_info.merge({
        verses: [
          { number: 1, arabic: 'Sample Arabic text', translation: 'Sample translation for surah ' + surah_number.to_s }
        ]
      })
    end
  end
  
  def self.get_ayah(surah_number, ayah_number)
    surah = get_surah(surah_number)
    return nil unless surah
    
    verse = surah[:verses].find { |v| v[:number] == ayah_number.to_i }
    return nil unless verse
    
    {
      surah_number: surah_number.to_i,
      ayah_number: ayah_number.to_i,
      surah_name: surah[:name],
      surah_arabic_name: surah[:arabic_name],
      arabic: verse[:arabic],
      translation: verse[:translation]
    }
  end
  
  private
  
  def self.fetch_from_api(endpoint)
    begin
      uri = URI("#{BASE_URL}/#{endpoint}")
      response = Net::HTTP.get_response(uri)
      
      if response.code == '200'
        JSON.parse(response.body, symbolize_names: true)
      else
        nil
      end
    rescue => e
      Rails.logger.error "Error fetching from Quran API: #{e.message}"
      nil
    end
  end
end