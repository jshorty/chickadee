class AddStreakCountToUsers < ActiveRecord::Migration
  def change
    add_column :users, :streak_count, :integer, null: false, default: 0
    add_column :users, :last_quiz_date, :datetime
  end
end
