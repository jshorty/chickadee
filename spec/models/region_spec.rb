require 'rails_helper'

RSpec.describe Region, type: :model do
  subject(:region) { Region.new(code: "X", county: "Westchester",
                                state: "New York", country: "United States")}

  it "requires a country and continuous specificity" do
    region1 = Region.new(code: "A", county: "Cumberland")
    region2 = Region.new(code: "B", county: "Suffolk", state: "Massachusetts")
    region3 = Region.new(code: "C", county: "Washington", country: "United States")
    region4 = Region.new(code: "D", state: "Arkansas", country: "United States")
    region5 = Region.new(code: "E", country: "United States")

    expect(region.save!).to be true
    expect(region1.save).to be false
    expect(region2.save).to be false
    expect(region3.save).to be false
    expect(region4.save).to be true
    expect(region5.save).to be true
  end

  it "prevents duplicates of any specificity" do
    region2 = Region.new(code: "A", county: "Westchester",
                         state: "New York", country: "United States")
    region3 = Region.new(code: "B", state: "Arkansas", country: "United States")
    region4 = Region.new(code: "C", state: "Arkansas", country: "United States")
    region5 = Region.new(code: "D", country: "United States")
    region6 = Region.new(code: "E", country: "United States")

    expect(region.save!).to be true
    expect(region2.save).to be false
    expect(region3.save).to be true
    expect(region4.save).to be false
    expect(region5.save).to be true
    expect(region6.save).to be false
  end

  it "allows only one region per eBird code" do
    region.save
    expect(Region.new(code: "X", country: "Turkey").save).to be false
  end
end
