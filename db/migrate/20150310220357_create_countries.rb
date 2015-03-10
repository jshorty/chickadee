class CreateCountries < ActiveRecord::Migration
  def change
    create_table :countries do |t|
      t.string :code, null: false
      t.string :name, null: false
    end

    add_index :countries, :code
    add_index :countries, :name
  end
end
