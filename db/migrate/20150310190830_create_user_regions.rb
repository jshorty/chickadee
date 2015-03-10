class CreateUserRegions < ActiveRecord::Migration
  def change
    create_table :user_regions do |t|
      t.integer :user_id, null: false
      t.integer :region_id, null: false
      t.timestamps
    end

    add_index :user_regions, :user_id
  end
end
