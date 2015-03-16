class Bird < ActiveRecord::Base

  validates :common_name, :sci_name, presence: true
  validates :sci_name, uniqueness: true

  has_many :bird_regions,
    class_name: "BirdRegion",
    primary_key: :id,
    foreign_key: :bird_id,
    dependent: :destroy

  has_many :regions,
    through: :bird_regions,
    source: :region

  has_many :quizzes,
    through: :quiz_questions,
    source: :quiz,
    dependent: :destroy

  def genus
    self.sci_name.split(" ")[0]
  end

  def species
    self.sci_name.split(" ")[1]
  end

  def subspecies
    names = self.sci_name.split(" ")
    names.length > 2 ? names[2] : nil
  end

  def countries
    self.regions.pluck(:country).uniq
  end

  def xeno_canto_url
    base = "http://www.xeno-canto.org/api/2/recordings?query="
    sci_name = "#{genus} #{species}"
    base + sci_name
  end

  def check_for_songs
    uri = URI.encode(self.xeno_canto_url)
    payload = JSON.parse(RestClient.get(uri, {:accept => :json}))
    return payload
    # if payload["numRecordings"] == "0"

    # self.countries.each do |country|
    #   query_url = (self.xeno_canto_url+"+cnt:#{country.gsub(" ", "+")}")
    #   encoded_url = URI.encode(query_url)
    #   payload = JSON.parse(RestClient.get(encoded_url, {:accept => :json}))
  end

  def catch_redirect(url)
    #
    # resp = httpc.get(url)
    # res = Net::HTTP.start(parsed_url.host, parsed_url.port) do |http|
    #   http.get(url.request_uri)
    # end
    # res['location']
  end
end
