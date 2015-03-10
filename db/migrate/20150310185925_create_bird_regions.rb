class CreateBirdRegions < ActiveRecord::Migration
  def change
    create_table :bird_regions do |t|
      t.integer :region_id, null: false
      t.integer :bird_id, null: false
      t.timestamps
    end

    add_index :bird_regions, :region_id
  end
end
