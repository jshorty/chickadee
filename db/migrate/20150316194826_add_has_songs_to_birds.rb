class AddHasSongsToBirds < ActiveRecord::Migration
  def change
    add_column :birds, :has_song, :boolean
  end
end
