json.(@region, :id, :county, :state, :country)

json.birds(@region.birds, :common_name, :sci_name)
