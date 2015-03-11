Rails.application.routes.draw do

  root "static_pages#public"

  resources :users
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resources :birds, only: [:create, :show, :index]
    resources :regions, only: [:create, :show, :index]
  end

end
