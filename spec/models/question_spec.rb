require 'rails_helper'

RSpec.describe Question, type: :model do
  it "considers unanswered questions incorrect" do
    q1 = Question.new(quiz_id: 1, bird_id: 1, answered: false);
    q2 = Question.new(quiz_id: 1, bird_id: 1);
    q3 = Question.new(quiz_id: 1, bird_id: 1, correct: true);
    q4 = Question.new(quiz_id: 1, bird_id: 1,
                      answered: false, correct: true);

  expect(q1.save).to be true
  expect(q2.save).to be true
  expect(q3.save).to be false
  expect(q4.save).to be false
  end
end
