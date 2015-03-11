class Region < ActiveRecord::Base
  require 'open-uri'

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

  def ebird_url #builds query string from seeded eBird tables
    base_url = "http://ebird.org/ws1.1/data/obs/region/recent?rtype="
    query_end = "&back=30&maxResults=10000&includeProvisional=false"

    if self.county
      region = "subnational2&r="
      code =  County.all
                    .joins("JOIN states ON counties.state = states.code")
                    .where(["states.name = ? AND counties.name = ?",
                            self.state, self.county])
                    .first
                    .code
    elsif self.state #several countries have two state entries w/ same name
      region = "subnational1&r="
      code = State.all
                  .joins("JOIN countries ON states.country = countries.code")
                  .where(["states.name = ? AND countries.name = ?",
                          self.state, self.country])
                  .first
                  .code
    else
      region = "country&r="
      code = Country.all.where({name: self.country}).first.code
    end

    base_url + region + code + query_end
  end

  def query_ebird
    open(ebird_url) do |response|
      return nil unless response.status == ["200", "OK"]
      xml_doc = Nokogiri::XML(response)
      return xml_doc
    end
  end

  def parse_birds_from_ebird_data
    doc = query_ebird
    common_names = doc.xpath("//com-name").children
    sci_names = doc.xpath("//sci-name").children
    birds = self.birds.dup

    common_names.length.times do |i|
      #filters out hybrids, and vaguely identified birds
      next if common_names[i].text.match(/sp.|\/| x /)

      bird = Bird.new(common_name: common_names[i].text,
                      sci_name: sci_names[i].text)
      if bird.save
        BirdRegion.create(bird_id: bird.id, region_id: self.id)
      end
    end
  end
end
