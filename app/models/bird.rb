class Bird < ActiveRecord::Base
  MAX_SONGS = 15
  # Since we're providing attribution, we can use everything except
  # code 0, which is 'All Rights Reserved'.
  MAX_PHOTOS = 5
  IMAGE_LICENSES = "1,2,3,4,5,6,7,8,9,10"

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

  has_many :photographs,
    class_name: "BirdPhoto",
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

  def self.find_or_create_by_names(common_name, sci_name)
    # Right now we'll update scientific names, but just consider it a new
    # bird when the common name is different, since my guess is
    # the Clements checklist updates this less often. (2015-09-07)
    bird = self.find_by_common_name(common_name)
    if !bird
      bird = Bird.create(common_name: common_name, sci_name: sci_name)
    elsif bird.sci_name != sci_name
      bird.update!(sci_name: sci_name)
    end
    bird
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

  def get_photos! # Creates records in the database for new photos from Flickr.
    photos = photo_search
    return false if photos.empty?
    photos[0...MAX_PHOTOS].each { |photo| BirdPhoto.create_photo_record(self, photo) if photo }
    true
  end

  def photo_search
    FlickRaw.api_key = ENV["FLICKR_KEY"]
    FlickRaw.shared_secret = ENV["FLICKR_SECRET"]

    photos = flickr.photos.search(text: "#{sci_name} #{common_name}", license: IMAGE_LICENSES, sort: "interestingness-desc").to_a
    photos = flickr.photos.search(text: sci_name, license: IMAGE_LICENSES, sort: "interestingness-desc").to_a if photos.empty?
    photos = flickr.photos.search(text: common_name, license: IMAGE_LICENSES, sort: "interestingness-desc").to_a if photos.empty?
    photos
  end

  def prioritize_songs_by_quality(song_payload, count)
    songs = []
    remaining = count
    ["A", "B", "C", "no score", "D", "E"].each do |score|
      new_songs = song_payload.select {|song| song["q"] == score}
      songs.concat(new_songs.sample(remaining))
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

  def has_photos?
    photographs.any? || get_photos!
  end

  def random_photo
    # Send some kind of alert here and link to a placeholder.
    return false unless has_photos?

    photos = photographs.shuffle
    i = 0
    while i < photos.length
      begin
        return photos[i] if photos[i].local || photos[i].retrieve_file
      rescue URI::InvalidURIError
        song.destroy
      ensure
        i += 1
      end
    end
  end

  def random_song
    self.get_songs unless self.has_songs
    songs = self.songs.shuffle
    i = 0

    while i < songs.length
      begin
        return songs[i] if songs[i].local || songs[i].retrieve_file
      rescue URI::InvalidURIError
        songs[i].destroy
      ensure
        i += 1
      end
    end
  end
end
