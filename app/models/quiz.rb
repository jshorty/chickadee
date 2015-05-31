class Quiz < ActiveRecord::Base
  include ActiveModel::Dirty
  NUM_QUESTIONS = 10

  validates :user_id, :region_id, presence: true
  validate :one_active_quiz_per_region
  validate :quiz_region_exists_for_user

  has_many :questions,
    class_name: "Question",
    primary_key: :id,
    foreign_key: :quiz_id,
    dependent: :destroy

  belongs_to :user,
    class_name: "User",
    primary_key: :id,
    foreign_key: :user_id

  belongs_to :region,
    class_name: "Region",
    primary_key: :id,
    foreign_key: :region_id

  has_many :birds,
    through: :region,
    source: :birds

  def one_active_quiz_per_region
    if self.progress < NUM_QUESTIONS &&
        Quiz.where({user_id: self.user_id,
                    region_id: self.region_id})
                    .where("quizzes.progress < 10")
                    .any? { |quiz| quiz.id != self.id }
      errors[:base] << "already an active quiz for that region"
    end
  end

  def quiz_region_exists_for_user
    unless UserRegion.find_by(user_id: self.user_id, region_id: self.region_id)
      errors[:base] << "you aren't following this region"
    end
  end

  def seed_questions(num)
    num.times do |i|
      birds = self.region.quiz_question
      Question.create(quiz_id: self.id,
                      bird_id: birds[0].id,
                      choice_a: birds[1].id,
                      choice_b: birds[2].id,
                      choice_c: birds[3].id)
    end
  end

  def reseed_remaining_questions
    self.questions.destroy_all
    self.seed_questions(NUM_QUESTIONS - self.progress)
  end

  def correct!
    self.score += 1
    self.progress += 1
    self.history_will_change!
    self.history << "Y"
    self.save!
    self.complete! if self.progress == NUM_QUESTIONS
  end

  def incorrect!
    self.progress += 1
    self.history_will_change!
    self.history << "N"
    self.save!
    self.complete! if self.completed?
  end

  def next_question
    Question.includes(:correct_answer, :answer_a, :answer_b, :answer_c)
            .find_by(quiz_id: self.id, answered: false)
  end

  def complete!
    self.questions.destroy_all
    self.user.gain_xp(self.region, self.score * 10)
    #XP gain must occur before streak update to properly modify XP timeseries
    self.user.continue_streak
  end

  def completed?
    self.progress == NUM_QUESTIONS
  end

  def xp_timeseries
    UserRegion.find_by(user_id: self.user_id, region_id: self.region_id)
              .xp_timeseries
  end

  def level
    UserRegion.find_by(user_id: self.user_id, region_id: self.region_id)
              .level
  end

  def self.find_incomplete_or_create(region_id, user_id)
    quiz = Quiz.where("quizzes.progress < 10")
               .where(region_id: region_id, user_id: user_id)
               .first
    quiz ||= Quiz.new(user_id: user_id, region_id: region_id)
  end

end
