class Question < ActiveRecord::Base
  validates :quiz_id, :bird_id, :choice_a, :choice_b, :choice_c, presence: true
  validate :question_is_incorrect_if_unanswered

  belongs_to :quiz,
    class_name: "Quiz",
    primary_key: :id,
    foreign_key: :quiz_id

  belongs_to :correct_answer,
    class_name: "UserBird",
    primary_key: :id,
    foreign_key: :bird_id

  belongs_to :answer_a,
    class_name: "UserBird",
    primary_key: :id,
    foreign_key: :choice_a

  belongs_to :answer_b,
    class_name: "UserBird",
    primary_key: :id,
    foreign_key: :choice_b

  belongs_to :answer_c,
    class_name: "UserBird",
    primary_key: :id,
    foreign_key: :choice_c

  has_one :user,
    through: :quiz,
    source: :user

  def question_is_incorrect_if_unanswered
    if self.correct && !self.answered
      errors[:base] << "cannot be correct if unanswered"
    end
  end
end
