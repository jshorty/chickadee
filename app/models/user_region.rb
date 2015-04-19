class UserRegion < ActiveRecord::Base
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
    self.update!(xp: self.xp + xp)
    self.maybe_level_up!
  end

  def maybe_level_up!
    threshold = self.level * 100
    if self.xp >= threshold
      self.update!(xp: self.xp - threshold, level: self.level + 1)
    end
  end
end
