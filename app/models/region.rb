class Region < ActiveRecord::Base
  require 'open-uri'

  validates :country, :code, presence: true
  validates :code, uniqueness: true
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

  has_many :quizzes,
    class_name: "Quiz",
    primary_key: :id,
    foreign_key: :region_id,
    dependent: :destroy

  has_many :birds,
    through: :bird_regions,
    source: :bird

  has_many :users,
    through: :user_regions,
     source: :user

  def name
    county_name = self.county ? "#{self.county}, " : ""
    state_name = self.state ? "#{self.state}, " : ""
    county_name + state_name + self.country
  end

  def region_has_clear_specificity
    if self.county && !self.state
      errors.add(:state, "must specify a state when selecting a county")
    end
  end

  def region_is_unique_by_scope
    if self.county && Region.all.where({
        county: self.county, state: self.state, country: self.country}).any?
      errors[:base] << "this county is already in the database for this state"
    elsif !self.county && self.state && Region.all.where({
        county: nil, state: self.state, country: self.country}).any?
      errors[:base] << "this state is already in the database for this country"
    elsif !self.county && !self.state && Region.all.where({
        county: nil, state: nil, country: self.country}).any?
      errors[:base] << "this country is already in the database"
    end
  end

  def ebird_url
    base_url = "http://ebird.org/ws1.1/data/obs/region/recent?rtype="
    query_end = "&back=30&maxResults=10000&includeProvisional=false"

    if self.county
      region = "subnational2&r="
    elsif self.state
      region = "subnational1&r="
    else
      region = "country&r="
    end

    base_url + region + self.code + query_end
  end

  def query_ebird
    open(ebird_url) do |response|
      return nil unless response.status == ["200", "OK"]
      xml_doc = Nokogiri::XML(response)
      return xml_doc
    end
  end

  def parse_birds_from_ebird_data
    self.touch
    doc = query_ebird
    common_names = doc.xpath("//com-name").children
    sci_names = doc.xpath("//sci-name").children
    birds = self.birds.dup

    common_names.length.times do |i|
      #filters out hybrids and birds not identified to species
      next if common_names[i].text.match(/sp.|\/| x |\(|\)/)

      bird = Bird.find_or_create_by(common_name: common_names[i].text,
                                    sci_name: sci_names[i].text)

      BirdRegion.create(bird_id: bird.id, region_id: self.id)
    end
  end

  def quiz_question
    parse_birds_from_ebird_data if self.birds.length < 4
    birds = self.birds.to_a.sample(4)
    unless birds.length == 4
      raise InvalidQuizError.new("Not enough birds for a quiz.")
    end
    birds
  end
end
