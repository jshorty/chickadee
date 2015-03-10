class CreateRegions < ActiveRecord::Migration
  def change
    create_table :regions do |t|
      t.string :county
      t.string :state
      t.string :country, null: false
      t.timestamps
    end
  end
end
