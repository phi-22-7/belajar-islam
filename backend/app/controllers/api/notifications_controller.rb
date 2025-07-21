class Api::NotificationsController < Api::BaseController
  def enable_prayer_notifications
    city = params[:city] || 'jakarta'
    
    if NotificationService.schedule_prayer_notifications(current_user.id, city)
      render json: { 
        message: 'Prayer notifications enabled successfully',
        city: city 
      }
    else
      render json: { 
        error: 'Failed to enable prayer notifications' 
      }, status: :unprocessable_entity
    end
  end
  
  def disable_prayer_notifications
    # In production, this would remove scheduled notifications for the user
    Rails.logger.info "Disabling prayer notifications for user #{current_user.id}"
    
    render json: { message: 'Prayer notifications disabled successfully' }
  end
  
  def update_fcm_token
    token = params[:fcm_token]
    
    if token.present?
      # In production, save FCM token to user record
      # current_user.update(fcm_token: token)
      Rails.logger.info "FCM token updated for user #{current_user.id}"
      
      render json: { message: 'FCM token updated successfully' }
    else
      render json: { error: 'FCM token is required' }, status: :bad_request
    end
  end
end