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
    get 'quran/:surah/:ayah', to: 'quran#get_ayah'
    get 'quran/:surah', to: 'quran#get_surah'
    get 'quran', to: 'quran#index'
    
    get 'prayer-times/:city', to: 'prayer_times#get_times'
    get 'cities', to: 'prayer_times#cities'
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
