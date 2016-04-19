module Api
  class RegionsController < ApplicationController
    before_action :require_logged_in

    def create
      @region = Region.find_most_specific(region_params)
      if @region.users.include?(current_user)
        render json: ["You are already studying that region!"], status: 422
      else
        # TODO: Record last date we pulled from eBird, so this doesn't
        # have to get called any time someone adds a new region.
        @region.parse_birds_from_ebird_data
        @user_region = UserRegion.new(
          region_id: @region.id,
          user_id: current_user.id,
          country: @region.country,
          state: @region.state,
          county: @region.county
        )
        if @user_region.save
          @region.parse_birds_from_ebird_data
          if @region.birds.count > 0
            render json: @user_region
          else
            @user_region.destroy
            render json: ["We couldn't find any reported birds for this region."], status: 404
          end
        else
          render json: @user_region.errors.full_messages, status: 422
        end
      end
    rescue
      render json: ["Sorry, we couldn't find this region."], status: 404
    end

    def show
      @region = Region.includes(birds: :photographs).find(params[:id])
      @user_region = @region.user_regions.find_by_user_id(current_user.id)
      if params[:requery]
        @region.bird_regions.destroy_all
        @region.parse_birds_from_ebird_data
      end
      render :show
    end

    def index
      @user_regions = current_user.user_regions.includes(:region)
      render :index
    end

    def destroy
      @user_region = current_user.user_regions.find_by(region_id: params[:id])
      @user_region.destroy
      render json: @user_region, status: 200
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
      [:country, :state, :country].each do |scope|
        params[:region][scope] = nil if params[:region][scope].blank?
      end
      params.require(:region).permit(:id, :county, :state, :country)
    end
  end
end
