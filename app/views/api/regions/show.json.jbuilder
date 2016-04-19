json.(@region, :id, :county, :state, :country)
json.image_url(@region.image.url)
json.updated_at(@region.updated_at.strftime("%b %d %Y"))
json.start_date((@region.updated_at.to_date - 30).strftime("%b %d %Y"))

json.birds(@region.birds, :id, :common_name, :sci_name)
json.bird_image(@region.random_bird_photo_url)
json.level(@user_region.level)
json.xp(@user_region.xp)
json.percent_correct(@user_region.percent_correct)
json.map_url(@region.map_embed_url)
