json.array! @birds do |bird|
  json.(bird, :id, :common_name, :sci_name)
end
