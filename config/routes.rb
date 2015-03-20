Rails.application.routes.draw do

  root to: "static_pages#root"

  resource :session, only: [:new, :create, :destroy]

  get "/auth/:provider/callback", to: "api/sessions#omniauth",
    :defaults => { :format => 'json' }
  get "/auth/failure", to: "static_pages#root"

  namespace :api, defaults: { format: :json } do
    resource :session, only: [:create, :show, :destroy]

    resources :users, only: [:create, :update, :show]

    resources :regions, only: [:show, :index, :create]
    get "/countries", to: "regions#countries"

    resources :birds, only: [:create, :show, :index]
    get "/birds_all", to: "birds#world_index"
    get "/birds_quiz", to: "birds#quiz_question"

    resources :quizzes, only: [:create, :update, :show]
  end

end
