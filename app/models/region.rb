class Region < ActiveRecord::Base
  validates :country, presence: true
  validates :county, uniqueness: {scope: :state}
  validate :region_has_clear_specificity

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
