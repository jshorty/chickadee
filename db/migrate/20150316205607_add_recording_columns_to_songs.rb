class AddRecordingColumnsToSongs < ActiveRecord::Migration
  def self.up
    add_attachment :songs, :recording
  end

  def self.down
    remove_attachment :songs, :recording
  end
end
