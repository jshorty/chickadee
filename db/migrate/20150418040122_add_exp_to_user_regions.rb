class AddExpToUserRegions < ActiveRecord::Migration
  def change
    add_column :user_regions, :exp, :integer, null: false, default: 0
  end
end
