class AddRegionsDataToUserRegions < ActiveRecord::Migration
  def change
    add_column :user_regions, :country, :string, null: false
    add_column :user_regions, :state, :string
    add_column :user_regions, :county, :string
  end
end
