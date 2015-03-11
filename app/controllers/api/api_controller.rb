module Api
  class ApiController < ApplicationController
    before_action :require_logged_in
  end
end
