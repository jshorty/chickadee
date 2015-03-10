# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

counter = 0
counter2 = 0
File.readlines(Rails.root.to_s + "/db/seeds/ebird_api_county.csv").each do |line|
  counter += 1
  cols = line.chomp.split(",")
  country, state, code, name = cols[0], cols[1], cols[2], cols[3]
  next if country == "COUNTRY_CODE"
  county = County.new({country: country, state: state, code: code, name: name})
  if !county.save
    puts county.errors.full_messages
  end
  counter2 += 1
end
puts counter.to_s + " lines processed."
puts counter2.to_s + " county save attempts."

counter = 0
counter2 = 0
File.readlines(Rails.root.to_s + "/db/seeds/ebird_api_state.csv").each do |line|
  counter += 1
  cols = line.chomp.split(",")
  country, code, name = cols[0], cols[1], cols[2]
  next if country == "COUNTRY_CODE"
  state = State.new({country: country, code: code, name: name})
  if !state.save
    puts state.name
    puts state.country
    puts state.errors.full_messages
  end
  counter2 += 1
end
puts counter
puts counter2

counter = 0
counter2 = 0
File.readlines(Rails.root.to_s + "/db/seeds/ebird_api_country.csv").each do |line|
  counter += 1
  cols = line.chomp.split(",")
  code, name = cols[0], cols[1]
  next if code == "COUNTRY_CODE"
  country = Country.new({code: code, name: name})
  if !country.save
    puts country.errors.full_messages
  end
  counter2 += 1
end
puts counter
puts counter2
