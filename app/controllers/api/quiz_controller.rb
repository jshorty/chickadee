module Api
  class QuizController < ApplicationController
    before_action :require_logged_in

    def create
      @quiz = Quiz.new(user_id: current_user.id,
                       region_id: params[:region_id])
      if @quiz.save
        begin
          @quiz.seed_questions
        rescue
          render json: ["Region has too few birds for quiz"], status: 422
        end
        @quiz = Quiz.includes(:questions).find(@quiz.id)
        render :show
      else
        render json: @quiz.errors.full_messages, status: 422
      end
    end

    def update
      params[:questions].each do |id, correct|
        question = Question.find(id);
        @quiz = question.quiz

        unless question.user == current_user || question.answered
          render json: ["You don't have permission to do that"], status: 403
        end

        question.update(correct: correct, answered: true)
        correct ? quiz.correct! : quiz.incorrect!

        render json: @quiz
      end
    end

    def show
      @quiz = Quiz.includes(:questions).find(params[:id])
      render :show
    end

    # private
    #
    #   def quiz_params
    #     params.require(:quiz).permit(:region_id, :questions)
    #   end
  end
end
