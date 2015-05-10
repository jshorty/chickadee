module Api
  class RegionsController < ApplicationController
    before_action :require_logged_in

    def create
      @region = Region.find_most_specific(region_params)
      if !@region
        render json: ["Sorry, we couldn't find this region. Please confirm your spelling, or be less specific."], status: 404
      elsif @region.users.include?(current_user)
        render json: ["You are already studying that region!"], status: 422
      else
        @user_region = UserRegion.new(region_id: @region.id,
                                      user_id: current_user.id,
                                      country: @region.country,
                                      state: @region.state,
                                      county: @region.county)
        if @user_region.save
          @region.parse_birds_from_ebird_data
          render json: @user_region
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
      @user_regions = current_user.user_regions
      render :index
    end

    def countries
      @countries = []
      countries = Region.all.where("county IS NULL and state IS NULL")
      countries.each { |region| @countries.push(region.country) }
      @countries.sort
      render :countries
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
