class RenameExpToXp < ActiveRecord::Migration
  def change
    rename_column :user_regions, :exp, :xp
  end
end
