class CreateUserBirds < ActiveRecord::Migration
  def change
    create_table :user_birds do |t|
      t.integer :user_id, null: false
      t.integer :bird_id, null: false
      t.integer :total_answers, default: 0
      t.integer :correct_answers, default: 0
      t.boolean :is_favorite, default: false
    end
  end
end
