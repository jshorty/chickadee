class CreateBirdPhotos < ActiveRecord::Migration
  def change
    create_table :bird_photos do |t|
      t.integer :bird_id, null: false
      t.boolean :local, default: false
      t.string :file_url, null: false
      t.string :flickr_url, null: false
      t.string :owner
    end
  end
end
