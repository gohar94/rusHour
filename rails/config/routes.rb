Rails.application.routes.draw do
  get 'welcome/index'

  resources :users
  
  get '/services/find' => 'services#find'
  post '/services/find' => 'services#find'
  resources :services
  
  post '/service_admins/login' => 'service_admins#login'
  get '/service_admins/logout' => 'service_admins#logout'
  get '/service_admins/home' => 'service_admins#home'
  resources :service_admins
  
  post '/admins/login' => 'admins#login'
  get '/admins/logout' => 'admins#logout'
  get '/admins/home' => 'admins#home'
  resources :admins
  
  root to: 'visitors#index'
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'
end
