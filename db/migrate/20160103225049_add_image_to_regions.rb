class AddImageToRegions < ActiveRecord::Migration
  def self.up
    add_attachment :regions, :image
    add_column :regions, :image_url, :string, default: nil
  end

  def self.down
    remove_attachment :regions, :image
    remove_column :regions, :image_url, default: nil
  end
end
