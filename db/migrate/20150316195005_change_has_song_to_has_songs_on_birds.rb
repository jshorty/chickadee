class ChangeHasSongToHasSongsOnBirds < ActiveRecord::Migration
  def change
    rename_column :birds, :has_song, :has_songs
  end
end
