module Api
  class RegionsController < ApiController
    def create
      @region = Region.find_by(region_params)

      if @region.nil?
        @region = Region.new(region_params)
        if @region.save
          UserRegion.create(user_id: current_user.id, region_id: @region.id)
          render json: @region
        else
          render json: @region.errors.full_messages, status: :unprocessable_entity
        end
      else
        UserRegion.create(user_id: current_user.id, region_id: @region.id)
        render json: @region
      end
    end

    def show
      @region = Region.find(params[:id])
      render json: @region
    end

    def index
      @regions = current_user.regions
      render json: @regions
    end

    private

      def region_params
        params.require(:region).permit(:id, :county, :state, :country)
      end
  end
end
