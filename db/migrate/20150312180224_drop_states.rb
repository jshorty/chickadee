class DropStates < ActiveRecord::Migration
  def change
    drop_table :states
  end
end
