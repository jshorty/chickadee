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

  def get_songs
    uri = URI.encode(self.xeno_canto_url)
    payload = JSON.parse(RestClient.get(uri, {:accept => :json}))
    number_of_recordings = payload["numRecordings"].to_i

    if number_of_recordings == 0
      self.update!(has_songs: false)
      return false
    else
      max_songs = 15
      count = (number_of_recordings < max_songs) ? number_of_recordings : max_songs

      songs = payload["recordings"].sample(count)
      save_songs!(songs)
      self.update!(has_songs: true)
      return true
    end
  end

  def save_songs!(songs)
    songs.each do |song|
      Song.create!(bird_id: self.id, info_url: song["url"],
                  xeno_canto_url: song["file"], recordist: song["rec"])
    end
  end
end
