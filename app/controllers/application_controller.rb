class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  def log_in!(user)
    user.reset_session_token!
    session[:token] = user.session_token
  end

  def log_out!
    current_user && current_user.reset_session_token!
    session[:token] = nil
  end

  def current_user
    return nil unless session[:token]
    @current_user ||= User.find_by(session_token: session[:token])
  end

  def logged_in?
    !!current_user
  end

  def require_logged_in
    redirect_to new_session_url unless logged_in?
  end

  helper_method :logged_in?, :current_user
end
