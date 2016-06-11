class UserRegion < ActiveRecord::Base
  XP_MULTIPLIER = 100

  validates :user_id, :region_id, presence: true
  validates :region_id, uniqueness: { scope: :user_id }

  belongs_to :user,
    class_name: "User",
    primary_key: :id,
    foreign_key: :user_id

  belongs_to :region,
    class_name: "Region",
    primary_key: :id,
    foreign_key: :region_id

  after_create :get_photo_if_new

  def gain_xp(xp)
    self.advance_days unless self.user.completed_quiz_today?
    self.update!(xp: self.xp + xp)
    self.maybe_level_up!
  end

  def xp_timeseries
    [self.xp_day7, self.xp_day6, self.xp_day5, self.xp_day4,
     self.xp_day3, self.xp_day2, self.xp]
  end

  def maybe_level_up!
    if self.xp >= level_threshold(self.level)
      self.update!(level: self.level + 1)
    end
  end

  def level_threshold(level)
    return 100 if level == 1
    xp_threshold = level * XP_MULTIPLIER
    xp_threshold + level_threshold(level - 1)
  end

  def advance_days
    today = Date.today.in_time_zone(self.user.time_zone).to_date
    days_ago = (today - self.user.last_quiz_date).to_i

    if days_ago > 5
      (2..7).each do |num|
        self.assign_attributes("xp_day#{num}".to_sym => self.xp)
      end
    else
      (7..days_ago + 2).each do |num|
        self.assign_attributes("xp_day#{num}".to_sym =>
                               self.send("xp_day#{num - days_ago}"))
      end
      (2..days_ago + 1).each do |num|
        self.assign_attributes("xp_day#{num}".to_sym => self.xp)
      end
    end
    self.save!
  end

  def leaderboard(current_user_id)
    region.leaderboard(current_user_id)
  end

  def get_photo_if_new
    if region.image.url == "/images/original/missing.png"
      region.get_image
    end
  end

  def percent_correct
    (correct_answers * 100.0 / total_answers).round(1)
  end

  # TODO: Replace user_id and region_id columns/associations on Quiz
  # and associate with this model instead.
  def quiz_count
    Quiz.where(user_id: user_id, region_id: region_id)
      .where('progress >= ?', Quiz::NUM_QUESTIONS).count
  end
end
