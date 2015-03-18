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

  has_many :songs,
    class_name: "Song",
    primary_key: :id,
    foreign_key: :bird_id,
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
      debugger
      max_songs = 15
      count = (number_of_recordings < max_songs) ? number_of_recordings : max_songs

      #prioritize high-quality recordings according to audio's current rating:
      songs = payload["recordings"].select{|song| song["q"] == "A"}.sample(count)
      remaining = count - songs.length
      if remaining > 0
        ["B", "C", "no score", "D", "E"].each do |score|
          songs += (payload["recordings"].select{|song| song["q"] == score}.sample(remaining))
          remaining = count - songs.length
          break if remaining == 0
        end
      end

      save_songs!(songs)
      self.update!(has_songs: true)
      return true
    end
  end

  def save_songs!(songs)
    songs.each do |song|
      Song.create!(bird_id: self.id, info_url: song["url"], rating: song["q"],
                   xeno_canto_url: song["file"], recordist: song["rec"])
    end
  end

  def random_song
    self.get_songs unless self.has_songs
    songs = self.songs.shuffle
    i = 0

    while i < songs.length
      song = songs[i]
      if song.local
        return song
      elsif song.retrieve_file
        return song
      else
        i += 1
      end
    end
  end
end
