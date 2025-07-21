class Api::PrayerTimesController < Api::BaseController
  skip_before_action :authenticate_user
  
  def cities
    # Get list of available cities
    cities = PrayerTimesService.get_available_cities
    render json: { cities: cities }
  end
  
  def get_times
    city = params[:city]
    date = params[:date] || Date.current.strftime('%Y-%m-%d')
    
    prayer_times = PrayerTimesService.get_prayer_times(city, date)
    
    if prayer_times
      render json: { 
        city: city,
        date: date,
        prayer_times: prayer_times,
        qibla_direction: PrayerTimesService.get_qibla_direction(city)
      }
    else
      render json: { error: 'Prayer times not available for this city' }, status: :not_found
    end
  end
end