json.array! @user_regions do |region|
  json.(region, :region_id, :level, :county, :state, :country, :correct_answers, :total_answers, :percent_correct, :quiz_count)
  json.leaderboard (region.leaderboard(current_user.id))
  json.image (region.region.image.url)
  json.map_url (region.region.map_embed_url)
end

json.array! @countries do |country|
  json.(country)
end
