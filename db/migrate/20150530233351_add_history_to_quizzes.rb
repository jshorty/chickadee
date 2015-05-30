class AddHistoryToQuizzes < ActiveRecord::Migration
  def change
    add_column :quizzes, :history, :text, array: true, default: []
  end
end
