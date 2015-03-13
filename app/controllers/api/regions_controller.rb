module Api
  class RegionsController < ApplicationController
    before_action :require_logged_in

    def create
      @region = Region.find_by(region_params)
      if !@region
        render json: ["Region doesn't exist in the database"], status: 404
      elsif @region.users.include?(current_user)
        render json: ["You are already studying that region"], status: 422
      else
        @user_region = UserRegion.new(region_id: @region.id,
                                      user_id: current_user.id)
        if @user_region.save
          @region.parse_birds_from_ebird_data
          render json: @region
        else
          render json: @user_region.errors.full_messages, status: 422
        end
      end
    end

    def show
      @region = Region.includes(:birds).find(params[:id])
      if params[:requery]
        @region.bird_regions.destroy_all
        @region.parse_birds_from_ebird_data
      end
      render :show
    end

    def index
      @regions = current_user.regions
      render :index
    end

    private

      def region_params
        params[:region][:county] = nil if params[:region][:county] == ""
        params[:region][:state] = nil if params[:region][:state] == ""
        params[:region][:country] = nil if params[:region][:country] == ""
        params.require(:region).permit(:id, :county, :state, :country)
      end
  end
end
