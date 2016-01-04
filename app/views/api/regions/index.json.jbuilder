json.array! @user_regions do |region|
  json.(region, :region_id, :level, :county, :state, :country)
  json.leaderboard (region.leaderboard(current_user.id))
  json.image (region.region.image.url)
end

json.array! @countries do |country|
  json.(country)
end
