class AddChoicesToQuestions < ActiveRecord::Migration
  def change
    add_column :questions, :choice_a, :integer, null: false
    add_column :questions, :choice_b, :integer, null: false
    add_column :questions, :choice_c, :integer, null: false
  end
end
