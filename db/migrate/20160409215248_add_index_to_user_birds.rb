class AddIndexToUserBirds < ActiveRecord::Migration
  def change
    add_index :user_birds, :user_id
  end
end
