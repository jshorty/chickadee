json.(@bird, :id, :common_name, :sci_name, :song_desc)

if @photograph
  json.photo do
    json.flickr_url @photograph.flickr_url
    json.photographer @photograph.owner
    json.image_url @photograph.image.url
  end
end

json.stats(@user_bird.stats_hash)
json.wikipedia_summary(@bird.wikipedia_summary)
json.wikipedia_link(@bird.wikipedia_url)
