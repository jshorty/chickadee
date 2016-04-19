require 'open-uri'

class BirdPhoto < ActiveRecord::Base
  IMAGE_LICENSES = "1,2,3,4,5,6,7,8,9,10"
  PHOTO_SEARCH_TERMS =
  PHOTO_SIZE = "Medium" # Look for 500px width.
  IMAGE_MAX_WIDTH = 500
  IMAGE_MAX_HEIGHT = 320
  MAX_PHOTOS_PER_BIRD = 5
  PHOTO_SEARCH_DEFAULTS = {
    license: IMAGE_LICENSES,
    sort: "interestingness-desc",
    content_type: 'photo',
    tags: 'bird',
  }

  has_attached_file :image
  # URL to default 'missing photo' image should go here:
  #default_url: "https://s3.amazonaws.com/chickadee-development/images/user_image.jpg",
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :bird,
    class_name: "Bird",
    primary_key: :id,
    foreign_key: :bird_id

  PhotoNotFoundError = Class.new(StandardError)

  def self.get_photos_for_bird(bird)
    photo_data_with_images = self.search_flickr(bird)
    photo_data_with_images.each do |h|
      owner = flickr.people.getInfo(user_id: h[:photo_data]["owner"])
      BirdPhoto.create(
        bird_id: bird.id,
        owner: owner.try(:realname) || owner.try(:username) || "Anonymous",
        flickr_url: h[:image].url,
        file_url: h[:image].source,
      )
    end
  end

  def self.search_flickr(bird)
    # Tries to find quality landscape bird photos; takes a long time given the iterative API calls.
    FlickRaw.api_key = ENV["FLICKR_KEY"]
    FlickRaw.shared_secret = ENV["FLICKR_SECRET"]
    photos = flickr.photos.search({ text: "#{bird.sci_name} #{bird.common_name}" }.merge(PHOTO_SEARCH_DEFAULTS)).to_a
    photos = flickr.photos.search({ text: bird.sci_name }.merge(PHOTO_SEARCH_DEFAULTS)).to_a if photos.empty?
    photos = flickr.photos.search({ text: bird.common_name }.merge(PHOTO_SEARCH_DEFAULTS)).to_a if photos.empty?
    prioritized_photos = []
    photos.each do |photo|
      sizes = flickr.photos.getSizes(photo_id: photo["id"])
      landscape_image = sizes.find { |img| (img.width.to_i == IMAGE_MAX_WIDTH && IMAGE_MAX_WIDTH > img.height.to_i) }
      prioritized_photos << { photo_data: photo, image: landscape_image } if landscape_image
      break if prioritized_photos.length == MAX_PHOTOS_PER_BIRD
    end
    raise PhotoNotFoundError unless prioritized_photos.any?
    prioritized_photos
  end

  def retrieve_file
    return if local
    self.image = URI.parse(file_url)
    self.update(local: true)
  end
end
