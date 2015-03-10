class Region < ActiveRecord::Base
  validates :country, presence: true
  validates :county, uniqueness: {scope: :state}
  validate :region_has_clear_specificity

  has_many :bird_regions,
    class_name: "BirdRegion",
    primary_key: :id,
    foreign_key: :region_id,
    dependent: :destroy

  has_many :user_regions,
    class_name: "UserRegion",
    primary_key: :id,
    foreign_key: :region_id,
    dependent: :destroy

  has_many :birds, through: :bird_regions, source: :bird

  has_many :users, through: :user_regions, source: :user

  def region_has_clear_specificity
    if self.county && !self.state
      errors.add(:state, "must specify a state when selecting a county")
    end
  end

  def region_is_unique_by_scope
    # if self.county
    #   return Region.none? do |region|
    #       self.county == region.county && self.state == region.state &&
    #       self.country == region.country
    #     end
    if self.state
      return Region.none? do |region|
          !region.county && self.state == region.state &&
          self.country == region.country
        end
    else
      return Region.none? do |region|
          !region.county && !region.state && self.country == region.country
        end
    end
  end
end
