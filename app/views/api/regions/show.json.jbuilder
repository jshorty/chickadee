json.(@region, :id, :county, :state, :country)

json.updated_at(@region.updated_at.strftime("%b %d %Y"))
json.start_date((@region.updated_at.to_date - 30).strftime("%b %d %Y"))

json.birds(@region.birds, :common_name, :sci_name)
