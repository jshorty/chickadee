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

  def gain_xp(xp)
    self.advance_days unless self.user.completed_quiz_today?
    self.update!(xp: self.xp + xp)
    self.maybe_level_up!
  end

  def maybe_level_up!
    threshold = self.level * XP_MULTIPLIER
    if self.xp >= threshold
      self.update!(xp: self.xp - threshold, level: self.level + 1)
    end
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
end
