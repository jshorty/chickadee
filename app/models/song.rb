require 'net/http'
require 'open-uri'

class Song < ActiveRecord::Base

  validates :bird_id, :info_url, :xeno_canto_url, presence: true
  validates :xeno_canto_url, uniqueness: true

  belongs_to :bird,
    class_name: "Bird",
    primary_key: :id,
    foreign_key: :bird_id

  has_attached_file :recording, path: "recordings/:bird_id/:filename"
  validates_attachment_content_type :recording, content_type: "audio/mpeg"

  def retrieve_file
    puts "Downloading a song file now..."
    file_url = catch_redirect
    self.recording = URI.parse(file_url)
    puts "We got it!"
    self.update(local: true)
  end

  def catch_redirect
    file_url = Net::HTTP.get_response(URI.parse(self.xeno_canto_url))['location']
  end


end
