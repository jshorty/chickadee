class SessionController < ApplicationController
  def new
    render :new
  end

  def create
    @user = User.find_by_credentials(params[:user])

    if @user
      log_in!(@user)
      redirect_to user_url(@user)
    else
      flash.now[:errors] = ["Invalid email or password."]
      render :new
    end
  end

  def destroy
    log_out!
    redirect_to new_session_url
  end
end
