require 'rails_helper'

RSpec.describe Quiz, type: :model do
  it "allows max one incomplete quiz per user region" do
    quiz1 = Quiz.new(user_id: 1, region_id: 1, progress: 10);
    quiz2 = Quiz.new(user_id: 1, region_id: 1);
    quiz3 = Quiz.new(user_id: 1, region_id: 1);

    expect(quiz1.save).to be true
    expect(quiz2.save).to be true
    expect(quiz3.save).to be false
  end
end
