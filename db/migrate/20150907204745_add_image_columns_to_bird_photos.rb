class AddImageColumnsToBirdPhotos < ActiveRecord::Migration
  def self.up
    add_attachment :bird_photos, :image
  end

  def self.down
    remove_attachment :bird_photos, :image
  end
end
