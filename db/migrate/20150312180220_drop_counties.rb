class DropCounties < ActiveRecord::Migration
  def change
    drop_table :counties
  end
end
