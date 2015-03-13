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
      @user = current_user
      render :current_user
    end

    def destroy
      log_out!
      render :current_user
    end
  end
end
