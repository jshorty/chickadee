class AddRatingToSongs < ActiveRecord::Migration
  def change
    add_column :songs, :rating, :string
  end
end
