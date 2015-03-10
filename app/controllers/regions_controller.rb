class RegionsController < ApplicationController
  def create
    @region = Region.new(region_params)
    if @region.save
      render json: @region
    else
      render json: @region.errors.full_messages
    end
  end

  def show
    @region = Region.find(params[:id])
    render json: @region
  end
  
  private

    def region_params
      params.require(:region).permit(:id, :county, :state, :country)
    end
end