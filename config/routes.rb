Rails.application.routes.draw do

  root "welcome#index"
  resource :session, only: [:new, :create, :destroy]
  resources :users
  resources :birds, only: [:create, :show]
  resources :regions, only: [:create, :show]

end
