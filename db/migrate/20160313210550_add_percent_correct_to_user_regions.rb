class AddPercentCorrectToUserRegions < ActiveRecord::Migration
  def change
    add_column :user_regions, :total_answers, :integer, default: 0
    add_column :user_regions, :correct_answers, :integer, default: 0
  end
end
