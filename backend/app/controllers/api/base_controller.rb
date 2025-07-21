class Api::BaseController < ApplicationController
  protect_from_forgery with: :null_session
  before_action :authenticate_user
  
  private
  
  def authenticate_user
    token = request.headers['Authorization']&.split(' ')&.last
    
    if token
      begin
        decoded = JWT.decode(token, Rails.application.credentials.secret_key_base, true, algorithm: 'HS256')
        @current_user = User.find(decoded[0]['user_id'])
      rescue JWT::DecodeError, Mongoid::Errors::DocumentNotFound
        render json: { error: 'Unauthorized' }, status: :unauthorized
      end
    else
      render json: { error: 'Unauthorized' }, status: :unauthorized
    end
  end
  
  def current_user
    @current_user
  end
  
  def admin_required
    render json: { error: 'Admin access required' }, status: :forbidden unless current_user&.admin?
  end
  
  def generate_jwt(user)
    JWT.encode({ user_id: user.id.to_s, exp: 24.hours.from_now.to_i }, Rails.application.credentials.secret_key_base, 'HS256')
  end
end