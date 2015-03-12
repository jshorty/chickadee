Rails.application.routes.draw do

  get "/", to: "static_pages#public", as: "public"
  get "/private", to: "static_pages#private", as: "private"

  resources :users
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :update, :show]

    resources :regions, only: [:show, :index, :create]

    resources :birds, only: [:create, :show, :index]
    get "/birds_all", to: "birds#world_index"
    get "/birds_quiz", to: "birds#quiz_question"
  end

end
