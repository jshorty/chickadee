module Api
  class BirdsController < ApplicationController
    before_action :require_logged_in

    def show
      @bird = Bird.find(params[:id])
      @photograph = @bird.random_photo
      render :show
    end

    def index
      @region = Region.find(params[:region_id])
      @birds = @region.birds
      render :index
    end

    def world_index
      @birds = current_user.birds
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
