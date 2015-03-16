class Quiz < ActiveRecord::Base
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
    if self.progress < 10 &&
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

  def seed_questions
    10.times do |i|
      birds = self.region.quiz_question
      Question.create(quiz_id: self.id,
                      bird_id: birds[0].id,
                      choice_a: birds[1].id,
                      choice_b: birds[2].id,
                      choice_c: birds[3].id)
    end
  end

  def correct!
    self.update(score: (self.score + 1), progress: (self.progress + 1))
    if self.progress == 10
      self.questions.destroy_all
      self.user.continue_streak
    end
  end

  def incorrect!
    self.update(progress: (self.progress + 1))
    if self.progress == 10
      self.questions.destroy_all
      self.user.continue_streak
    end
  end

  def next_question
    Question.includes([:correct_answer, :answer_a, :answer_b, :answer_c])
            .find_by(quiz_id: self.id, answered: false)
  end
end
