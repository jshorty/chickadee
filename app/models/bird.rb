class Bird < ActiveRecord::Base
  MAX_SONGS = 15

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

  def countries
    self.regions.pluck(:country).uniq
  end

  def xeno_canto_url
    "http://www.xeno-canto.org/api/2/recordings?query=#{self.sci_name}"
  end

  def get_songs
    uri = URI.encode(self.xeno_canto_url)
    payload = JSON.parse(RestClient.get(uri, {:accept => :json}))
    num_recordings = payload["numRecordings"].to_i

    if num_recordings == 0
      self.update!(has_songs: false)
      return false
    else
      count = [num_recordings, MAX_SONGS].min
      songs = prioritize_songs_by_quality(payload["recordings"], count)
      save_songs!(songs)
      self.update!(has_songs: true)
      return true
    end
  end

  def prioritize_songs_by_quality(song_payload, count)
    songs = []
    remaining = count
    ["A", "B", "C", "no score", "D", "E"].each do |score|
      new_songs = song_payload.select {|song| song["q"] == score}
      songs << new_songs.sample(remaining)
      remaining = count - songs.length
      break if remaining == 0
    end
    songs
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
      begin
        song = songs[i]
        if song.local
          return song
        elsif song.retrieve_file
          return song
        else
          i += 1
        end
      rescue URI::InvalidURIError
        song.destroy
        i += 1
      end
    end
  end
end
