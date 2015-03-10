class Region < ActiveRecord::Base
  validates :country, presence: true
  validate :region_has_clear_specificity
  validate :region_is_unique_by_scope

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
    if self.county && Region.all.where({
        county: self.county, state: self.state, country: self.country}).any?
      errors[:base] << "region already exists in the database"
    elsif self.state && Region.all.where({
        county: nil, state: self.state, country: self.country}).any?
      errors[:base] << "region already exists in the database"
    elsif Region.all.where({
        county: nil, state: nil, country: self.country}).any?
      errors[:base] << "region already exists in the database"
    end
  end

  def ebird_query_string
    base_url = "http://ebird.org/ws1.1/data/obs/region_spp/recent?"
    query_end = "&back=30&maxResults=10000&includeProvisional=false"

    if self.county
      region = "rtype=subnational2"

    elsif self.state
      region = "rtype=subnational1"

    else
      region = "rtype=country"

    end
  end
end
