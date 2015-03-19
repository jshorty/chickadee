json.array! @regions do |region|
  json.(region, :id, :county, :state, :country)
end

json.array! @countries do |country|
  json.(country)
end
