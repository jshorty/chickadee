class Quiz < ActiveRecord::Base
  validates :user_id, :region_id, presence: true
  validate :one_active_quiz_per_region

  def one_incomplete_quiz_per_region
    if self.progress < 10 &&
        Quiz.find_by(user_id: self.user_id,
                    region_id: self.region_id)
                    .where("quizzes.progress < 10")
                    .any? { |quiz| quiz.id != self.id }
      errors[:base] << "already an active quiz for that region"
    end
  end

end
