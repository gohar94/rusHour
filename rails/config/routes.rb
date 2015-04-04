Rails.application.routes.draw do
  root to: 'welcome#index'
  
  get 'welcome/index'
  
  get '/admin_access' => 'admin_access#index'
  post '/admin_access/login' => 'admin_access#login'
  get '/admin_access/logout' => 'admin_access#logout'

  resources :users
  
  get '/services/find' => 'services#find'
  post '/services/find' => 'services#find'
  resources :services
  
  get '/service_admins/home' => 'service_admins#home'
  resources :service_admins
  
  get '/admins/home' => 'admins#home'
  resources :admins
  
  get '/auth/:provider/callback' => 'sessions#create'
  get '/signin' => 'sessions#new', :as => :signin
  get '/signout' => 'sessions#destroy', :as => :signout
  get '/auth/failure' => 'sessions#failure'
end
