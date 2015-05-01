json.array! @regions do |region|
  json.(region, :id, :county, :state, :country)
end

# json.array! @user_regions do |user_region|
#   json.(user_region, :region_id, :level)
# end

json.array! @countries do |country|
  json.(country)
end
