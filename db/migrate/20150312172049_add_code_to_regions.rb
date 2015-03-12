class AddCodeToRegions < ActiveRecord::Migration
  def change
    add_column :regions, :code, :string, null: false
  end
end
