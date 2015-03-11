require 'rails_helper'

RSpec.describe Region, type: :model do
  subject(:region) { Region.new(county: "Westchester",
                                state: "New York", country: "United States")}

  it "requires a country and continuous specificity" do
    region1 = Region.new(county: "Cumberland")
    region2 = Region.new(county: "Suffolk", state: "Massachusetts")
    region3 = Region.new(county: "Washington", country: "United States")
    region4 = Region.new(state: "Arkansas", country: "United States")
    region5 = Region.new(country: "United States")

    expect(region.save).to be true
    expect(region1.save).to be false
    expect(region2.save).to be false
    expect(region3.save).to be false
    expect(region4.save).to be true
    expect(region5.save).to be true
  end

  it "prevents duplicates of any specificity" do
    region2 = Region.new(county: "Westchester",
                         state: "New York", country: "United States")
    region3 = Region.new(state: "Arkansas", country: "United States")
    region4 = Region.new(state: "Arkansas", country: "United States")
    region5 = Region.new(country: "United States")
    region6 = Region.new(country: "United States")

    expect(region.save).to be true
    expect(region2.save).to be false
    expect(region3.save).to be true
    expect(region4.save).to be false
    expect(region5.save).to be true
    expect(region6.save).to be false
  end
end
