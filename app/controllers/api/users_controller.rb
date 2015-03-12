module Api
  class UsersController < ApplicationController
    before_action :confirm_user_id, only: [:update, :show]

    def create
      @user = User.new(user_params)
      if @user.save
        log_in!(@user)
        redirect_to ("/#regions")
      else
        render json: @region.errors.full_messages, status: 422
      end
    end

    def update
      @user = current_user
      if @user.update(user_params)
        render :show
      else
        render json: @user.errors.full_messages, status: 422
      end
    end

    def show
      @user = current_user
      render :show
    end

    private
      def confirm_user_id
        unless (params[:id] || user_params[:id]) == current_user.id.to_s
          render json: ["There was an error with your request"], status: 404
        end
      end

      def user_params
        params[:user][:alias] = nil if params[:user] && params[:user][:alias] == ""
        params.require(:user).permit(:email, :password, :alias)
      end
  end
end
