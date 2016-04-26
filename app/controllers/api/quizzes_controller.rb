module Api
  class QuizzesController < ApplicationController
    before_action :require_logged_in

    def create
      @quiz = Quiz.find_incomplete_or_create_new(params[:region_id], current_user.id)

      if @quiz.new_record? #get questions for a new quiz
        unless @quiz.save
          render json: @quiz.errors.full_messages, status: 422
          return
        end
        begin
          @quiz.generate_questions
        rescue
          render json: ["Region has too few birds for quiz"], status: 422
          return
        end
      end

      begin
        @question = @quiz.next_question
        @image = @question.correct_answer.bird.random_photo
        @song = @question.correct_answer.bird.random_song
      rescue NoMethodError => e
        @quiz.regenerate_remaining_questions
        retry
      end
      render :show
    end

    def update
      id = params[:id]
      correct = params[:correct]
      @question = Question.find(id);

      unless @question && (@question.user == current_user || @question.answered)
        render json: ["You don't have permission to do that"], status: 403
        return
      end

      @question.update(correct: correct, answered: true)
      @quiz = @question.quiz
      correct ? @quiz.correct! : @quiz.incorrect!
      @question = @quiz.next_question

      if @question
        @image = @question.correct_answer.bird.random_photo
        @song = @question.correct_answer.bird.random_song
      end

      render :show
    end

    def show
      @quiz = Quiz.includes(:questions).find(params[:id])
      render :show
    end
  end
end
