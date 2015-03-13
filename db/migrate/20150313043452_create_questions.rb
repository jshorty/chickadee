class CreateQuestions < ActiveRecord::Migration
  def change
    create_table :questions do |t|
      t.integer :quiz_id, null: false
      t.integer :bird_id, null: false
      t.boolean :answered, null: false, default: false
      t.boolean :correct, null: false, default: false
      t.timestamps
    end

    add_index :questions, :quiz_id
  end
end
