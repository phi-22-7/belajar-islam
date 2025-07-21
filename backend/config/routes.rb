Rails.application.routes.draw do
  # API routes
  namespace :api do
    # Authentication routes
    post 'auth/register', to: 'auth#register'
    post 'auth/login', to: 'auth#login'
    delete 'auth/logout', to: 'auth#logout'
    
    # Questions routes
    resources :questions do
      resources :answers, except: [:show]
    end
    
    # Islamic content routes
    get 'prayer-times/:city', to: 'prayer_times#get_times'
    get 'cities', to: 'prayer_times#cities'
    
    # Notification routes
    post 'notifications/enable-prayer', to: 'notifications#enable_prayer_notifications'
    delete 'notifications/disable-prayer', to: 'notifications#disable_prayer_notifications'
    put 'notifications/fcm-token', to: 'notifications#update_fcm_token'
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
