module Api
  class QuizzesController < ApplicationController
    before_action :require_logged_in

    def create
      @quiz = Quiz.includes(:region)
                  .where("quizzes.progress < 10")
                  .find_by(region_id: params[:region_id])

      if @quiz
        puts "Existing quiz found."
        begin
          @question = @quiz.next_question
          puts "We found a question. Calling 'random_song' now..."
          @song = @question.correct_answer.random_song
          puts "We found a song!"
        rescue NoMethodError
          @quiz.questions.destroy_all
          @quiz.seed_questions(10 - @quiz.progress)
          retry
        end
        render :show
      else
        @quiz ||= Quiz.new(user_id: current_user.id,
                           region_id: params[:region_id])
        if @quiz.save
          begin
            @quiz.seed_questions(10)
          rescue
            render json: ["Region has too few birds for quiz"],
                         status: 422
            return
          end
          @question = @quiz.next_question
          @song = @question.correct_answer.random_song
          render :show
        else
          render json: @quiz.errors.full_messages, status: 422
        end
      end
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
        @song = @question.correct_answer.random_song
      end

      render :show
    end

    def show
      @quiz = Quiz.includes(:questions).find(params[:id])
      render :show
    end
  end
end
