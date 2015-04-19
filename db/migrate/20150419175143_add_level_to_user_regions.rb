class AddLevelToUserRegions < ActiveRecord::Migration
  def change
    add_column :user_regions, :level, :integer, null: false, default: 1
  end
end
