class ChangeLastQuizDateDataType < ActiveRecord::Migration
  def change
    change_column :users, :last_quiz_date, :date
  end
end
