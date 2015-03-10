class UsersController < ApplicationController
  def new
    @user = User.new
    render :form
  end

  def create
    @user = User.new(user_params)
    if @user.save!
      log_in!(@user)
      redirect_to user_url(@user)
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
      params.require(:user).permit(:id, :email, :password, :alias)
    end
end
