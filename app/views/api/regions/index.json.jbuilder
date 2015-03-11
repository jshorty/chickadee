json.array! @regions do |region|
  json.(region, :id, :county, :state, :country)
end
