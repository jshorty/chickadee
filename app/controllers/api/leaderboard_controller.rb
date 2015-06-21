module Api
  class LeaderboardController < ApplicationController
    before_action :require_logged_in

    def index
      regions = Region.find(leaderboard_params[:region_ids])
      render json: regions.map(:&leaderboard)
    end

    private

    def leaderboard_params
      params.permit(:region_ids)
    end

  end
end
