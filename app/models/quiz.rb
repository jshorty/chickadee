class Quiz < ActiveRecord::Base
  include ActiveModel::Dirty
  NUM_QUESTIONS = 10

  validates :user_id, :region_id, presence: true
  validate :one_active_quiz_per_region
  validate :quiz_region_exists_for_user

  has_many :questions, class_name: "Question", primary_key: :id, foreign_key: :quiz_id, dependent: :destroy
  belongs_to :user, class_name: "User", primary_key: :id, foreign_key: :user_id
  belongs_to :region, class_name: "Region", primary_key: :id, foreign_key: :region_id
  has_many :birds, through: :region, source: :birds

  def one_active_quiz_per_region
    if incomplete? && Quiz.incomplete(region_id, user_id).any? { |quiz| quiz.id != id }
      errors[:base] << "already an active quiz for that region"
    end
  end

  def quiz_region_exists_for_user
    unless UserRegion.find_by(user_id: user_id, region_id: region_id)
      errors[:base] << "you aren't following this region"
    end
  end

  def generate_questions(num = NUM_QUESTIONS)
    bird_ids = (birds.length >= 4 ? birds : region.all_birds_for_quiz).map(&:id)
    answer_groupings = (0...num).map { bird_ids.sample(4) }
    # Find or create any needed UserBirds.
    new_bird_ids_for_user = answer_groupings.flatten - UserBird.where(user_id: user_id).pluck(:bird_id)
    if new_bird_ids_for_user.any?
      UserBird.create(new_bird_ids_for_user.map { |bird_id| { user_id: user_id, bird_id: bird_id } })
    end
    user_birds = UserBird.where(user_id: user_id).all

    question_attrs = answer_groupings.map do |answers|
      {
        quiz_id: id,
        bird_id: user_birds.find_by_bird_id(answers[0]).id,
        choice_a: user_birds.find_by_bird_id(answers[1]).id,
        choice_b: user_birds.find_by_bird_id(answers[2]).id,
        choice_c: user_birds.find_by_bird_id(answers[3]).id,
      }
    end
    Question.create!(question_attrs)
  end

  def regenerate_remaining_questions
    questions.destroy_all
    generate_questions(NUM_QUESTIONS - progress)
  end

  def correct!
    self.score += 1
    self.progress += 1
    history_will_change!
    self.history << "Y"
    save!
    complete! unless incomplete?
  end

  def incorrect!
    self.progress += 1
    history_will_change!
    self.history << "N"
    save!
    complete! unless incomplete?
  end

  def next_question
    Question.includes(:correct_answer, :answer_a, :answer_b, :answer_c).find_by(quiz_id: id, answered: false)
  end

  def complete!
    user_region.update(
      total_answers: user_region.total_answers + questions.count,
      correct_answers: user_region.correct_answers + questions.select(&:correct).count,
    )
    questions.destroy_all
    user.gain_xp(region, score * 10) # XP gain must occur before streak update to properly modify XP timeseries
    user.continue_streak
  end

  def xp_timeseries
    user_region.xp_timeseries
  end

  def level
    user_region.level
  end

  def incomplete?
    self.progress < NUM_QUESTIONS
  end

  def self.incomplete(region_id, user_id)
    Quiz.where("quizzes.progress < ?", NUM_QUESTIONS).where(region_id: region_id, user_id: user_id)
  end

  def self.find_incomplete_or_create_new(region_id, user_id)
    Quiz.incomplete(region_id, user_id).first || Quiz.new(user_id: user_id, region_id: region_id)
  end

  def user_region # adjust associations to get rid of this
    UserRegion.find_by(user_id: user_id, region_id: region_id)
  end
end
