require 'open-uri'

class BirdPhoto < ActiveRecord::Base

  has_attached_file :image
  # URL to default 'missing photo' image should go here:
  #default_url: "https://s3.amazonaws.com/chickadee-development/images/user_image.jpg",
  validates_attachment_content_type :image, content_type: /\Aimage\/.*\Z/

  belongs_to :bird,
    class_name: "Bird",
    primary_key: :id,
    foreign_key: :bird_id

  def retrieve_file
    self.image = URI.parse(file_url)
    self.update(local: true)
  end
end
