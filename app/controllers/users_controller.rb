class UsersController < ApplicationController
  def new
    @user = User.new
  end

  def create
    @user = User.new(user_params)
    if @user.save!
      log_in!(@user)
      redirect_to user_url(@user)
    else
      render :json @user.errors.full_messages
    end
  end

  def edit
    @user = User.find(params[:id])

  end

  def update
    @user = User.find(params[:id])
    if @user.update!(user_params)
      render :json @user
  end

  def destroy
    @user = User.find(params[:id])
  end

  def show
    @user = User.find(params[:id])
  end

  def index
  end

  private

    def user_params
      params.require(:user).permit(:id, :email, :password, :alias)
    end
end
