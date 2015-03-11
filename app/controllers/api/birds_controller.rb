module Api
  class BirdsController < ApiController
    def show
      @bird = Bird.find(params[:id])
      render :show
    end

    def index
      @region = Region.find(params[:region_id])
      @birds = @region.birds
      render :index
    end

    def quiz_question
      @birds = []
      region_birds = Region.find(params[:region_id]).birds

      indices = (0..(region_birds.length - 1)).to_a
      indices.sample(4).each { |i| @birds.push(region_birds[i]) }

      render json: @birds
    end

    private

      def bird_params
        params.require(:bird).permit(:id, :common_name, :sci_name, :song_desc)
      end
  end
end
