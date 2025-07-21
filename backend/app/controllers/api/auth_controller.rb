class Api::AuthController < Api::BaseController
  skip_before_action :authenticate_user, only: [:login, :register]
  
  def register
    user = User.new(user_params)
    
    if user.save
      token = generate_jwt(user)
      render json: { 
        message: 'User created successfully', 
        user: user_response(user),
        token: token 
      }, status: :created
    else
      render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
    end
  end
  
  def login
    user = User.find_by(email: params[:email])
    
    if user&.authenticate(params[:password])
      token = generate_jwt(user)
      render json: { 
        message: 'Login successful', 
        user: user_response(user),
        token: token 
      }
    else
      render json: { error: 'Invalid email or password' }, status: :unauthorized
    end
  end
  
  def logout
    # Since we're using JWT, logout is handled client-side by removing the token
    render json: { message: 'Logged out successfully' }
  end
  
  private
  
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation, :role, :avatar)
  end
  
  def user_response(user)
    {
      id: user.id.to_s,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar_url: user.avatar.url
    }
  end
end
