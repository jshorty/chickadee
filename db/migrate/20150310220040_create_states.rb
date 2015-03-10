class CreateStates < ActiveRecord::Migration
  def change
    create_table :states do |t|
      t.string :code, null: false
      t.string :name, null: false
      t.string :country, null: false
    end

    add_index :states, :code
    add_index :states, :name
  end
end
