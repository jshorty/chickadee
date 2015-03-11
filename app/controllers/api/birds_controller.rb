module Api
  class BirdsController < ApiController
    def show
      @bird = Bird.find(params[:id])
      render json: @bird
    end

    def index
      @region = Region.find(params[:region_id])
      @birds = @region.birds
      render json: @birds
    end

    private

      def bird_params
        params.require(:bird).permit(:id, :common_name, :sci_name, :song_desc)
      end
  end
end
