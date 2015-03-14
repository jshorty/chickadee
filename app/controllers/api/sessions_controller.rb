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
  end
end
