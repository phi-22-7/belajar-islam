class Api::QuranController < Api::BaseController
  skip_before_action :authenticate_user
  
  def index
    # Get list of all surahs
    surahs = QuranService.get_surahs_list
    render json: { surahs: surahs }
  end
  
  def get_surah
    surah_number = params[:surah]
    surah_data = QuranService.get_surah(surah_number)
    
    if surah_data
      render json: { surah: surah_data }
    else
      render json: { error: 'Surah not found' }, status: :not_found
    end
  end
  
  def get_ayah
    surah_number = params[:surah]
    ayah_number = params[:ayah]
    ayah_data = QuranService.get_ayah(surah_number, ayah_number)
    
    if ayah_data
      render json: { ayah: ayah_data }
    else
      render json: { error: 'Ayah not found' }, status: :not_found
    end
  end
end