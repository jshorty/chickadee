class AddFavoriteBirdAndAboutToUsers < ActiveRecord::Migration
  def change
    add_column :users, :favorite, :string
    add_column :users, :about, :text
  end
end
