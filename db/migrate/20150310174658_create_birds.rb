class CreateBirds < ActiveRecord::Migration
  def change
    create_table :birds do |t|
      t.string :common_name, null: false
      t.string :scientific_name, null: false
      t.string :song_description
      t.timestamps
    end

    add_index :birds, :common_name, unique: true
    add_index :birds, :scientific_name, unique: true
  end
end
