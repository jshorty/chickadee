class RemoveImageUrlFromRegions < ActiveRecord::Migration
  def change
    remove_column :regions, :image_url
  end
end
