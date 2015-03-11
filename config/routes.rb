Rails.application.routes.draw do

  get "/", to: "static_pages#public", as: "public"
  get "/private", to: "static_pages#private", as: "private"

  resources :users
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resources :birds, only: [:create, :show, :index]
    resources :regions, only: [:create, :show, :index]
  end

end
