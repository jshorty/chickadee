module Api
  class RegionsController < ApiController
    def create
      # @region = Region.find_by(region_params)
      # @user_region = UserRegion.find_by(region_params)
      # if @region.nil?
      #   @region = Region.new(region_params)
      #   if @region.save
      #     UserRegion.create(user_id: current_user.id, region_id: @region.id)
      #     @region.parse_birds_from_ebird_data
      #     render json: @region
      #   else
      #     render json: @region.errors.full_messages, status: :unprocessable_entity
      #   end
      # else
      #   if UserRegion.new.save(user_id: current_user.id, region_id: @region.id)
      #     @region.parse_birds_from_ebird_data
      #     render json: @region
      #   else
      #     render json: ["You are already studying that region"], status:
      #     :unprocessable_entity
      #   end
      # end
    end

    def show
      @region = Region.includes(:birds).find(params[:id])
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
