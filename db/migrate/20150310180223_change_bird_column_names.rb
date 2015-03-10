class ChangeBirdColumnNames < ActiveRecord::Migration
  def change
    rename_column :birds, :scientific_name, :sci_name
    rename_column :birds, :song_description, :song_desc
  end
end
