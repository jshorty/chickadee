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
    10.times do
      bird = self.birds.to_a.sample
      Question.create(quiz_id: self.id, bird_id: bird.id)
  end
end