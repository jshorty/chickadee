class SessionsController < ApplicationController
  def new
    render :new
  end

  def create
    debugger
    @user = User.find_by_credentials(params[:user][:email], params[:user][:password])

    if @user
      log_in!(@user)
      redirect_to ("/#regions")
      puts "WE ALREADY REDIRECTED"
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
