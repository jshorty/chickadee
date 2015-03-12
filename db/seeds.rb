
puts "Seeding eBird region data..."

processed = 0
saved = 0
File.readlines(Rails.root.to_s + "/db/seeds/ebird_api_country.csv").each do |line|
  processed += 1
  cols = line.chomp.split(",")
  code, name = cols[0], cols[1]
  next if code == "COUNTRY_CODE"
  country = Region.new({code: code,
                        country: name})
  if !country.save
    puts country.errors.full_messages
  else
    saved += 1
  end
end
puts (processed - 1).to_s + " countries processed."
puts saved.to_s + " countries saved."

processed = 0
saved = 0
File.readlines(Rails.root.to_s + "/db/seeds/ebird_api_state.csv").each do |line|
  processed += 1
  cols = line.chomp.split(",")
  country, code, name = cols[0], cols[1], cols[2]
  next if country == "COUNTRY_CODE"
  state = Region.new({country: Region.find_by(code: country).country,
                      code: code,
                      state: name})
  if !state.save
    puts "STATE, state: " + state.state + ", country: " + state.country
    puts state.errors.full_messages
  else
    saved += 1
  end
end
puts (processed - 1).to_s + " states processed."
puts saved.to_s + " states saved."

processed = 0
saved = 0
File.readlines(Rails.root.to_s + "/db/seeds/ebird_api_county.csv").each do |line|
  processed += 1
  cols = line.chomp.split(",")
  country, state, code, name = cols[0], cols[1], cols[2], cols[3]
  next if country == "COUNTRY_CODE"
  county = Region.new({country: Region.find_by(code: country).country,
                       state: Region.find_by(code: state).state,
                       code: code,
                       county: name})
  if !county.save
    puts county.errors.full_messages
  else
    saved += 1
  end
end
puts (processed - 1).to_s + " counties processed."
puts saved.to_s + " counties saved."
