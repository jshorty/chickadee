class UsersController < ApplicationController
  before_action :require_logged_in, only: [:edit, :update, :destroy, :show, :index]

  def create
    @user = User.new(user_params)
    if @user.save
      log_in!(@user)
      redirect_to ("/#regions")
    else
      flash.now[:errors] = @user.errors.full_messages
      render :form
    end
  end

  def edit
    @user = User.find(params[:id])
    render :form
  end

  def update
    debugger
    @user = User.find(params[:id])
    if @user.update!(user_params)
      redirect_to user_url(@user)
    else
      flash.now[:errors] = @user.errors.full_messages
      render :form
    end
  end

  def destroy
    @user = User.find(params[:id])
  end

  def show
    @user = User.find(params[:id])
    render :show
  end

  def index
    @users = User.all
    render :index
  end

  private

    def user_params
      params[:user][:alias] = nil if params[:user] && params[:user][:alias] == ""
      params.require(:user).permit(:email, :password, :alias)
    end
end
