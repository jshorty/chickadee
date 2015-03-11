Rails.application.routes.draw do

  root "welcome#index"

  resources :users
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resources :birds, only: [:create, :show]
    resources :regions, only: [:create, :show, :index]
  end

end
