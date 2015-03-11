class RemoveTimestampsFromBirds < ActiveRecord::Migration
  def change
    remove_column :birds, :created_at
    remove_column :birds, :updated_at
  end
end
