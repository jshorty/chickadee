class CreateQuizzes < ActiveRecord::Migration
  def change
    create_table :quizzes do |t|
      t.integer :user_id, null: false
      t.integer :region_id, null: false
      t.integer :progress, null: false, default: 0
      t.integer :score, null: false, default: 0
      t.timestamps
    end

    add_index :quizzes, :user_id
    add_index :quizzes, :progress
  end
end
