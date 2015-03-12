Rails.application.routes.draw do

  root to: "static_pages#root"

  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: { format: :json } do
    resources :users, only: [:create, :update, :show]

    resources :regions, only: [:show, :index, :create]

    resources :birds, only: [:create, :show, :index]
    get "/birds_all", to: "birds#world_index"
    get "/birds_quiz", to: "birds#quiz_question"
  end

end
