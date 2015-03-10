require 'rails_helper'

RSpec.describe Bird, type: :model do
  it "has a genus and species" do
    bird = Bird.new(common_name: "Wood Duck", sci_name: "Aix sponsa")
    bird.save!

    expect(bird.genus + " " + bird.species).to eq("Aix sponsa")
  end

  it "can have a subspecies" do
    bird1 = Bird.new(common_name: "Number Bird", sci_name: "One two three")
    bird2 = Bird.new(common_name: "Herring Gull", sci_name: "Larus argentatus")
    bird1.save!
    bird2.save!

    expect(bird1.subspecies).to eq("three")
    expect(bird2.subspecies).to be_nil
  end
end
