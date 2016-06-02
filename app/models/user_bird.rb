class UserBird < ActiveRecord::Base
  # Represents a user's 'relationship of study' with a bird over time.
  # Includes learning-related stats, like the % of the time the user
  # correctly identifies the bird in-game.

  belongs_to :user,
    class_name: "User",
    primary_key: :id,
    foreign_key: :user_id

  belongs_to :bird,
    class_name: "Bird",
    primary_key: :id,
    foreign_key: :bird_id

  def percent_correct
    return 0.0 if total_answers < 1
    (correct_answers * 100.0 / total_answers).round(1)
  end

  def stats_hash
    {
      total_answers: total_answers,
      correct_answers: correct_answers,
      percent_correct: percent_correct,
    }
  end

  # # HACK: Real solution here is to remove jbuilder templates, just
  # # use simpler `render json:` syntax instead.
  # def to_json(options = {})
  #   super.merge(options)
  # end
  #
  def serializable_hash(options = {})
    super.merge({common_name: bird.common_name, sci_name: bird.sci_name})
  end
end
