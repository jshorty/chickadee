module Api
  class QuizController < ApplicationController

    def create
      @quiz = Quiz.new(user_id: current_user.id,
                       region_id: params[:region_id])
      if @quiz.save
        @quiz.seed_questions


    end

    def update

    end


    def show

    end
  end
end
