class AddXpGainsToUserRegions < ActiveRecord::Migration
  def change
    add_column :user_regions, :xp_day2, :integer
    add_column :user_regions, :xp_day3, :integer
    add_column :user_regions, :xp_day4, :integer
    add_column :user_regions, :xp_day5, :integer
    add_column :user_regions, :xp_day6, :integer
    add_column :user_regions, :xp_day7, :integer
  end
end
