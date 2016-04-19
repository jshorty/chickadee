Rails.application.routes.draw do

  root to: "static_pages#root"
  get "/wip/home", to: "static_pages#home"
  get "/wip/welcome", to: "static_pages#welcome"

  resource :session, only: [:new, :create, :destroy]

  get "/auth/:provider/callback", to: "api/sessions#omniauth",
    :defaults => { :format => 'json' }
  get "/auth/failure", to: "static_pages#root"
  # get "/auth/api/session", to: "static_pages#root"

  namespace :api, defaults: { format: :json } do

    resource :session, only: [:create, :show, :destroy]

    resources :users, only: [:create, :update, :show]

    resources :regions, only: [:show, :index, :create, :destroy]
    get "/countries", to: "regions#countries"

    resources :birds, only: [:create, :show, :index] do
      collection do
        get :random_image
      end
    end
    
    get "/birds_all", to: "birds#world_index"
    get "/birds_quiz", to: "birds#quiz_question"
    get "/random_song", to: "birds#random_song"
    get "birds/random_image", to: "birds#random_image"

    resources :quizzes, only: [:create, :update, :show]

    get "/leaderboard", to: "leaderboard#index"
  end

end
