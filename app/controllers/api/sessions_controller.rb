module Api
  class SessionsController < ApplicationController
    def create
      @user = User.find_by_credentials(params[:user][:email],
                                       params[:user][:password])
      if @user
        log_in!(@user)
        render :current_user
      else
        render json: ["Invalid email or password."], status: 422
      end
    end

    def show
      if current_user
        render :current_user
      else
        render json: {}
      end
    end

    def destroy
      log_out!
      render json: {}
    end

    def omniauth
      @user = User.find_or_create_by_auth_hash(auth_hash)
      sign_in!(@user)
      redirect_to root_url
    end

    protected

    def auth_hash
      request.env['omniauth.auth']
    end
  end
end
