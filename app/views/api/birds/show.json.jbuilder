json.(@bird, :id, :common_name, :sci_name, :song_desc)

if @photograph
  json.photo do
    json.flickr_url @photograph.flickr_url
    json.photographer @photograph.owner
    json.image_url @photograph.image.url
  end
end
