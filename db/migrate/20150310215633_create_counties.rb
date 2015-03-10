class CreateCounties < ActiveRecord::Migration
  def change
    create_table :counties do |t|
      t.string :code, null: false
      t.string :name, null: false
      t.string :state, null: false
      t.string :country, null: false
    end
    add_index :counties, :code
    add_index :counties, :name
  end
end
