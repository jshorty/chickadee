require 'open-uri'

class BirdPhoto < ActiveRecord::Base
  # Desired photo size from Flickr (Medium is 500px width).
  PHOTO_SIZE = "Medium"
  IMAGE_MAX_WIDTH = "500"
  IMAGE_MAX_HEIGHT = "320"

  has_attached_file :image
  # URL to default 'missing photo' image should go here:
  #default_url: "https://s3.amazonaws.com/chickadee-development/images/user_image.jpg",
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :bird,
    class_name: "Bird",
    primary_key: :id,
    foreign_key: :bird_id

  def self.create_photo_record(bird, flickr_photo_data)
    owner = flickr.people.getInfo(user_id: flickr_photo_data["owner"])
    image = find_image_with_appropriate_size(flickr_photo_data)

    BirdPhoto.create(
      bird_id: bird.id,
      owner: owner.try(:realname) || owner.try(:username),
      flickr_url: image.url,
      file_url: image.source,
    )
  end

  def self.replace(id)
    FlickRaw.api_key = ENV["FLICKR_KEY"]
    FlickRaw.shared_secret = ENV["FLICKR_SECRET"]
    byebug
    old_photo = find(id)
    bird = old_photo.bird
    photos = bird.photo_search
    photos.each do |photo|
      image = self.find_image_with_appropriate_size(photo)
      if bird.photographs.any? { |bp| bp.flickr_url == image.url }
        next
      else
        self.create_photo_record(bird, photo)
        old_photo.destroy
        return
      end
    end
  end

  def self.find_image_with_appropriate_size(flickr_photo_data)
    sizes = flickr.photos.getSizes(photo_id: flickr_photo_data["id"])
    is_landscape = sizes.any? { |img| (img.width.to_i > img.height.to_i) }
    image = sizes.find { |img| img.width == IMAGE_MAX_WIDTH } if is_landscape
    image = sizes.find { |img| img.height == IMAGE_MAX_HEIGHT } unless is_landscape
    image = sizes.find { |img| img.label == "Large Square" } unless image
    image
  end

  def retrieve_file
    self.image = URI.parse(file_url)
    self.update(local: true)
  end
end
