class BirdsController < ApplicationController
  def create
    @bird = Bird.new(bird_params)
    if @bird.save
      render json: @bird
    else
      render json: @bird.errors.full_messages
    end
  end

  def show
    @bird = Bird.find(params[:id])
    render json: @bird
  end

  private

    def bird_params
      params.require(:bird).permit(:common_name, :sci_name, :song_desc)
    end
end
