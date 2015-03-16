class CreateSongs < ActiveRecord::Migration
  def change
    create_table :songs do |t|
      t.integer :bird_id, null: false
      t.boolean :local, default: false
      t.string :info_url, null: false
      t.string :xeno_canto_url, null: false
      t.string :recordist
    end
  end
end
