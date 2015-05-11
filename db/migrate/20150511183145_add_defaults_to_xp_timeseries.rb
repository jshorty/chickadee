class AddDefaultsToXpTimeseries < ActiveRecord::Migration
  def change
    change_column :user_regions, :xp_day2, :integer, default: 0
    change_column :user_regions, :xp_day3, :integer, default: 0
    change_column :user_regions, :xp_day4, :integer, default: 0
    change_column :user_regions, :xp_day5, :integer, default: 0
    change_column :user_regions, :xp_day6, :integer, default: 0
    change_column :user_regions, :xp_day7, :integer, default: 0
  end
end
