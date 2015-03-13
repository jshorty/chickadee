class Quiz < ActiveRecord::Base
  validates :user_id, :region_id, presence: true
  validate :one_active_quiz_per_region

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

  def one_active_quiz_per_region
    if self.progress < 10 &&
        Quiz.where({user_id: self.user_id,
                    region_id: self.region_id})
                    .where("quizzes.progress < 10")
                    .any? { |quiz| quiz.id != self.id }
      errors[:base] << "already an active quiz for that region"
    end
  end

end
