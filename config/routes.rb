Rails.application.routes.draw do

  root "welcome#index"
  resource :session, only: [:new, :create, :destroy]
  resources :users

end
